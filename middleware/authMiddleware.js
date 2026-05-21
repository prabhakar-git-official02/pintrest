import jwt from "jsonwebtoken"

export const authmiddleware = (req,res,next) => {
  try{
    const token = req.cookies.authToken
    console.log(token);
    
    if(!token){
       return res.status(401).json({msg : 'Login Expired'})
    }
        const verifyToken = jwt.verify(token,process.env.AUTH_SECRET_CODE)
        if(!verifyToken){
            return res.status(401).json({msg : 'Unauthorized access'})
        }
        req.user = verifyToken
        req.userId = verifyToken.userId;
        req.userEmail = verifyToken.userEmail;
        next();
    } catch(err){
        res.status(500).json({msg : err.message})
    }
}