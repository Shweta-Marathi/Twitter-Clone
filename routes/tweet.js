const express = require("express");
const router = express.Router();

const Tweet = require("../models/Tweet");
const User = require("../models/user");
const auth = require("../middleware/auth");

console.log("Tweet routes loaded");


// ✅ CREATE TWEET
router.post("/", auth, async (req, res) => {
  try {
    const { text } = req.body;

    const tweet = new Tweet({
      user: req.user.id,
      text
    });

    await tweet.save();

    res.json({ message: "Tweet created", tweet });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//get all tweets

router.get("/", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("user", "username email followers") // ✅ FIXED
      .sort({ createdAt: -1 });

    res.json(tweets);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ❤️ LIKE / UNLIKE TWEET
router.put("/like/:id", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const alreadyLiked = tweet.likes.some(
      (id) => id.toString() === userId
    );

    if (!alreadyLiked) {
      tweet.likes.push(userId);
      await tweet.save();
      return res.json({ message: "Liked" });
    } else {
      tweet.likes = tweet.likes.filter(
        (id) => id.toString() !== userId
      );
      await tweet.save();
      return res.json({ message: "Unliked" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 📰 GET TIMELINE
router.get("/timeline", auth, async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .populate("user", "username email followers") // ✅ FIXED
      .sort({ createdAt: -1 });

    res.json(tweets);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🗑️ DELETE TWEET
router.delete("/:id", auth, async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    // 🔒 Only owner can delete
    if (tweet.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await tweet.deleteOne();

    res.json({ message: "Tweet deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EXPORT
module.exports = router;