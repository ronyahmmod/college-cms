const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new course
router.post("/", async (req, res) => {
  try {
    const { code, name, description } = req.body;
    if (!code || !name || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const course = new Course({ code, name, description });
    await course.save();
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
