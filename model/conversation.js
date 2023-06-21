const mongoose=require('mongoose');

const conversation=new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true}]
});


module.exports=mongoose.model('conversation',conversation)