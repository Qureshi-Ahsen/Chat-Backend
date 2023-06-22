const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../model/user');
const response=require('../helper/response');
const generatePresignedUrl=require('../config/filepath')

const register=async (req,res)=>{
  try {
    const { mimetype,path,size} =req.file;
    console.log(req.file);
    const {email,password,firstName,lastName,username}=req.body
    const userExists=await userModel.findOne({email:email});
    if(userExists){
     return response.errorResponseBadRequest(res,"User alresdy exists")
    };
    const bcryptPassword=await bcrypt.hash(password,10);
    const fileUrl =await generatePresignedUrl(path);
    const newUser=await userModel({
        firstName:firstName,lastName:lastName,email:email,password:bcryptPassword,
        username:username,
        avatar:{avatarType:mimetype,avatarName:fileUrl,avatarSize:size}
    });
    await newUser.save();
    response.successResponseWithData(res,newUser,"User registered Successfully")
  } catch (error) {
    console.log(error)
    response.errorResponseServer(res, "An error Occured While Registering Data! Try Again Later")
  }
};
const login=async(req,res)=>{
  try {
    const {email,password}=req.body;
    const user=await userModel.findOne({email:email});
    if(!user){
      response.errorResponseNotFound(res,"User with this Email does not exist")
    };
    const matchPassword=await bcrypt.compare(password,user.password)
    if(!matchPassword){
      response.errorResponseBadRequest(res,"Invalid Password")
    };
    const payload={id:user._id,email:user.email,role:user.role,currentRole:user.currentRole,firstName:user.firstName,lastName:user.lastName}
    const accessToken=await jwt.sign(payload,process.env.ACCESSTOKEN_KEY,{expiresIn:'2h'});
    const refreshToken=await jwt.sign({id:user._id},process.env.REFRESHTOKEN_KEY,{expiresIn:'7d'});
    const data={
      payload,
      accessToken,
      refreshToken
    }
    res.cookie('accessToken',accessToken,{maxAge:172800000,httpOnly:true})
    res.cookie('refreshToken',refreshToken,{maxAge:604800000,httpOnly:true})
    response.successResponseWithData(res,data,"User logged in Successfully")
  } catch (error) {
    console.log(error)
    return response.errorResponseServer(res,'An Error Occured while logging in! Please try again later.')
  }
};

const refresh=async(req,res)=>{
   try { 
     const id=req.decodedToken.id;
     const user=await userModel.findById({_id:id},{password:0})
     const payload={id:user._id,email:user.email,role:user.role,currentRole:user.currentRole,firstName:user.firstName,lastName:user.lastName}
     const newAccessToken= await jwt.sign(payload,process.env.ACCESSTOKEN_KEY,{expiresIn:'2h'});
     res.cookie('accessToken',newAccessToken,{maxAge:172800000,httpOnly:true})
     response.successResponseWithData(res,newAccessToken,"Generated Access token Successfully")
   } catch (error) {
    console.error('Error verifying refresh token:', error);
    return response.errorResponseServer(res,'Error verifying refresh token ! Try again later')
 }
};

module.exports={register,login,refresh}