const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const streamifier = require("streamifier");
const authMiddleware = require("../middleware/auth");

// GET all notices (public)
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    console.log("Fetched notices:", notices);
    res.json(notices);
  } catch (err) {
    console.error("Error in GET /notices:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new notice (protected)
router.post(
  "/",
  authMiddleware,
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res
          .status(400)
          .json({ message: "Title and content are required" });
      }

      console.log(
        "Files received:",
        req.files ? req.files.map((f) => f.originalname) : "No files"
      );

      const attachments = [];
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  resource_type: file.mimetype.startsWith("image/")
                    ? "image"
                    : "raw",
                  folder: "college_cms_notices",
                },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(
                      new Error(`Cloudinary upload failed: ${error.message}`)
                    );
                  }
                  console.log("Cloudinary upload success:", result.secure_url);
                  resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    type: file.mimetype.startsWith("image/") ? "image" : "pdf",
                  });
                }
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
            })
        );

        attachments.push(...(await Promise.all(uploadPromises)));
      }

      console.log("Attachments to save:", attachments);

      const notice = new Notice({
        title,
        content,
        attachments,
      });

      await notice.save();
      console.log("Saved notice:", notice);
      res.status(201).json(notice);
    } catch (err) {
      console.error("Error in POST /notices:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT update a notice (protected)
router.put(
  "/:id",
  authMiddleware,
  upload.array("attachments", 5),
  async (req, res) => {
    try {
      const { title, content } = req.body;
      const notice = await Notice.findById(req.params.id);
      if (!notice) {
        return res.status(404).json({ message: "Notice not found" });
      }

      notice.title = title || notice.title;
      notice.content = content || notice.content;

      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  resource_type: file.mimetype.startsWith("image/")
                    ? "image"
                    : "raw",
                  folder: "college_cms_notices",
                },
                (error, result) => {
                  if (error) {
                    console.error("Cloudinary upload error:", error);
                    return reject(
                      new Error(`Cloudinary upload failed: ${error.message}`)
                    );
                  }
                  console.log("Cloudinary upload success:", result.secure_url);
                  resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                    type: file.mimetype.startsWith("image/") ? "image" : "pdf",
                  });
                }
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
            })
        );

        const newAttachments = await Promise.all(uploadPromises);
        notice.attachments = [...notice.attachments, ...newAttachments];
      }

      await notice.save();
      console.log("Updated notice:", notice);
      res.json(notice);
    } catch (err) {
      console.error("Error in PUT /notices:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// DELETE a notice (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }

    console.log("Deleting notice:", notice);

    if (notice.attachments && notice.attachments.length > 0) {
      const deletePromises = notice.attachments.map((attachment) =>
        cloudinary.uploader
          .destroy(attachment.public_id, {
            resource_type: attachment.type === "image" ? "image" : "raw",
          })
          .then((result) => {
            console.log(
              `Cloudinary delete result for ${attachment.public_id}:`,
              result
            );
          })
          .catch((error) => {
            console.error(
              `Cloudinary delete error for ${attachment.public_id}:`,
              error
            );
          })
      );
      await Promise.all(deletePromises);
    }

    await notice.deleteOne();
    console.log("Notice deleted from MongoDB:", req.params.id);
    res.json({ message: "Notice deleted" });
  } catch (err) {
    console.error("Error in DELETE /notices:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
