
export const singleUpload = async(req,res) => {
    try{
        res.status(200).json({
            success : true,
            msg : "Image uploaded successfully",
            file : req.file,
        })
    }catch(err){
        res.status(500).json({msg : err?.message})
    }
}

export const multipleUpload = async(req,res) => {
    try{
        res.status(200).json({
            success : true,
            msg : "Images Uploaded successfully",
            files : req.files,
        })
    }catch(err){
        res.status(500).json({msg : err?.message})
    }
}