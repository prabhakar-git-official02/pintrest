import Posts from "../models/postsModel.js";

// Create Post
export const createPost = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        msg: "User not authenticated",
      });
    }

    const { postImage, description, save, like, comment } = req.body;

    if (!postImage) {
      return res.status(400).json({
        success: false,
        msg: "Post image is required",
      });
    }

    const newPost = await Posts.create({
      userId,
      postImage,
      description,
      save,
      like,
      comment,
    });

    res.status(201).json({
      success: true,
      msg: "Post created successfully",
      data: newPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "postImage",
      "description",
      "save",
      "like",
      "comment",
    ];

    const updateObj = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateObj[field] = req.body[field];
      }
    });

    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No valid fields provided",
      });
    }

    const existPost = await Posts.findById(id);

    if (!existPost) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }

    const updatedPost = await Posts.findByIdAndUpdate(
      id,
      { $set: updateObj },
      { new: true },
    );

    res.status(200).json({
      success: true,
      msg: "Post updated successfully",
      data: updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// Delete Particular field
export const deletePostField = async (req, res) => {
  try {
    const { id } = req.params;

    const fields = Object.keys(req.body);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        msg: "Provide field name to delete",
      });
    }

    const existPost = await Posts.findById(id);

    if (!existPost) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }

    const unsetObj = {};

    fields.forEach((field) => {
      unsetObj[field] = "";
    });

    const updatedPost = await Posts.findByIdAndUpdate(
      id,
      { $unset: unsetObj },
      { new: true },
    );

    res.status(200).json({
      success: true,
      msg: "Post field deleted successfully",
      data: updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const existPost = await Posts.findById(id);

    if (!existPost) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }

    await Posts.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      msg: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// get single post
export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Posts.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        msg: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// get all posts
export const getAllPost = async (req, res) => {
  try {
    const userId = req.userId;

    const posts = await Posts.find({ userId });

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No posts found",
      });
    }

    res.status(200).json({
      success: true,
      totalPosts: posts.length,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
