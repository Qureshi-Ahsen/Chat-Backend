const response = require('../helper/response');
const jwt=require('jsonwebtoken');

const verifyAccessToken=async(req,res,next)=>{
    try {
        const accessToken=req.cookies.accessToken;
        
        if(!accessToken){
            response.errorResponseBadRequest(res,'Cookie is not present or expired!')
        };
        const decodedToken=await jwt.verify(accessToken,process.env.ACCESSTOKEN_KEY);
        if(!decodedToken){
            res.status(401).json("Token is invalid or has expired")
        }
        req.user=decodedToken;
        next();
    } catch (error) {
        console.log(error)
       return response.errorResponseServer(res,"An Error Occured While decoding the token")
    }
};
module.exports=verifyAccessToken