const mongoose=require('mongoose');

const chat=new mongoose.Schema({
    conversationId:{type:mongoose.Schema.Types.ObjectId,ref:'conversations',required:true},
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    reciever:{type:String,required:true},
    contentType:{type:String,required:true},
    message:{type:String},
    messageUrl:{type:String}
},{timestamps:true});

module.exports=mongoose.model('chat',chat);