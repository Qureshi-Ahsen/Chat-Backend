const mongoose=require('mongoose');
const status=['Online','Offline'];
const avatarSchema=new mongoose.Schema({
    avatarType:{type:String},
    avatarName:{type:String},
    avatarSize:{type:String}
})


const userSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    status:{type:String,required:true,enum:status,default:'Online'},
    avatar:{type:avatarSchema}
});

module.exports=mongoose.model('user',userSchema)