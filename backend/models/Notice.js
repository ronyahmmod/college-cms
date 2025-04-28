const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  attachments: [
    {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["image", "pdf"],
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Notice", noticeSchema);
