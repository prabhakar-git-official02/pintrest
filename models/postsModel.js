import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    postImage : {
        url : {
            type : String
        },
        public_id : {
            type : String
        }
    },
    description : {
        type : String
    },

    save : {
        type : Boolean,
        default : false
    },

    like : {
        type : Boolean,
        default : false
    },

    Commend  : []
    
},{timestamps : true})

const Posts = mongoose.model("Posts",postsSchema,"posts")

export default Posts
