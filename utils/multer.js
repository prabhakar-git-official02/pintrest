import multer from "multer";

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,"/uploads")
    },
    filename : (req,file,cb) => {
        cb(null,Date.now()+"-"+file.originalname)
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype.startsWith("Image")){
        cb(null,true)
    } else {
        cb(new Error("Image only allowed"),false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits : {
        fileSize : 2 * 1000 * 1000
    }
})

export default upload