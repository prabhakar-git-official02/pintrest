export const uploadImage = async(req,res) => {
    try{
        res.status(200).json(
            {
                msg : "Image Uploaded",file : req.file
            })
    }catch(err){
        res.status(500).json({msg : err?.message})
    }
}