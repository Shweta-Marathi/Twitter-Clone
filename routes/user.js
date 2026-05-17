console.log("User routes loaded");

const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Tweet = require("../models/Tweet");
const auth = require("../middleware/auth");


// 👥 FOLLOW / UNFOLLOW (TOGGLE)
router.put("/follow/:id", auth, async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    const currentUser = await User.findById(req.user.id);

    // ❌ user not found
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // ❌ cannot follow yourself
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    // 🔍 check already following
    const isFollowing = currentUser.following.some(
      (id) => id.toString() === req.params.id
    );

    if (!isFollowing) {

      // ✅ FOLLOW
      currentUser.following.push(req.params.id);

      user.followers.push(req.user.id);

      await currentUser.save();

      await user.save();

      return res.json({
        message: "Followed"
      });

    } else {

      // ❌ UNFOLLOW
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      );

      user.followers = user.followers.filter(
        (id) => id.toString() !== req.user.id
      );

      await currentUser.save();

      await user.save();

      return res.json({
        message: "Unfollowed"
      });
    }

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});


// 👤 GET USER PROFILE
router.get("/profile/:id", async (req, res) => {

  try {

    const user = await User.findById(req.params.id)

      // ✅ POPULATE USERNAMES
      .populate("followers", "username")
      .populate("following", "username")

      // ❌ hide password
      .select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });
    }

    const tweets = await Tweet.find({
      user: req.params.id
    }).sort({
      createdAt: -1
    });

    res.json({
      user,
      tweets
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;