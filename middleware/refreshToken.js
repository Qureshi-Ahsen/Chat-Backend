const response = require('../helper/response');
const jwt=require('jsonwebtoken');

const verifyRefreshToken=async(req,res,next)=>{
    try {
        const refreshToken=req.cookies.refreshToken;
        if(!refreshToken){
            response.errorResponseBadRequest(res,'Cookie is not Present login ')
        };
        const decodedToken=await jwt.verify(refreshToken,process.env.REFRESHTOKEN_KEY);
        if(!decodedToken){
            res.status(401).json("Token is invalid or has expired")
        }
        console.log(decodedToken)
        req.decodedToken=decodedToken;
        next();
    } catch (error) {
        console.log(error)
        response.errorResponseServer(res,"An Error Occured While decoding the token")
    }
};
module.exports=verifyRefreshToken