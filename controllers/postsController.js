import Posts from "../models/postsModel";

// create Post
export const createPost = async (req, res) => {
  try {

    const postdata = req.body;

    const userId = req.userId;

    console.log(req.userId);

    if (!userId) {
      return res.status(409).json({ msg: "User not logged" });
    }


    const userPost = await Posts.create({
      userId: req.userId,
      ...postdata,
    });

    res.status(201).json({ msg: "Post Created" });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// update post
export const updatePost = async (req, res) => {
  try {
    const {id} = req.params
    const postObj = {};
    let isValid = false;

    const fields = [
        "postImage",
        "description",
        "save",
        "like",
        "commend"
    ];

    fields?.forEach((field) => {
      if (req.body[field] !== undefined) {
        postObj[field] = req.body[field];
        isValid = true;
      }
    });

    const existPost = await Posts.findById(id);

    if (!existPost) {
      return res.status(401).json({ msg: "Post not found" });
    }

    if (!isValid) {
      return res.status(400).json({ msg: "Invalid Field" });
    }

    const update = await Posts.findByIdAndUpdate(
      id,
      { $set: postObj },
      { new: true },
      { upsert: true },
    );

    res.status(200).json({ msg: "Post Updated", data: update });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};


// delete Post field
export const deletePostField = async (req, res) => {
  try {
    const data = req.body;
    const {id} = req.params

    const existPost = await Posts.findById(id);

    if (!existPost) {
      return res.status(401).json({ msg: "Post not found" });
    }

    const updateddata = await UserProfile.findByIdAndUpdate(
       id,
      { $unset: data },
      { new: true },
    );

    res.status(200).json({ msg: "Post Field deleted" });
  } catch (err) {
    res.status(500).json({ msg: err?.message });
  }
};

// delete Post 
export const deletePost = async(req,res) => {
    try{
        const {id} = req.params

        const existPost = await Posts.findById(id)

        if(!existPost){
            return res.status(404).json({msg : "Post not found"})
        }

        await Posts.findByIdAndDelete(id)

        res.status(200).json({msg : "Post Deleted"})
    }catch(err){
        res.status(500).json({msg : err?.message})
    }
}

// get post by id 
export const getpost = async(req,res) => {
    try{
        const {id} = req.params

        const existPost = await Posts.findById(id)

        if(!existPost){
            return res.status(404).json({msg : "Post not found"})
        }

        const post = await Posts.findById(id)

        res.status(200).json({data : post})
    }catch(err){
        res.status(500).json({msg : err?.message})
    }
}

// get all post
export const getAllpost = async(req,res) => {
    try{

        const userid = req.userId

        const existuser = await Posts.findOne({userId : userid})

        if(!existuser){
            return res.status(404).json({msg : "Posts not found"})
        }
        const post = await Posts.find(id)

        res.status(200).json({data : post})
    }catch(err){
        res.status(500).json({msg : err?.message})
    }
}