const express = require("express");
const router = express.Router();
const Notice = require("../models/Notice");

// GET all notices
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a notice
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }
    const notice = new Notice({ title: title, content: content });
    await notice.save();
    res.status(200).json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update a notice
router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    notice.title = title || notice.title;
    notice.content = content || notice.content;
    await notice.save();
    res.json(notice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a notice
router.delete("/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" });
    }
    await notice.remove();
    res.status(500).json({ message: "Notice deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
