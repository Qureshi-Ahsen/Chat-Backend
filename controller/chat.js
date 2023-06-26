const conversationModel=require('../model/conversation');
const userModel=require('../model/user')
const chatModel=require('../model/chat');
const response=require('../helper/response')
const generatePresignedUrl=require('../config/filepath')


const createConversation=async(req,res)=>{
    try {
        const id=req.user.id;
        const {reciever}=req.body;
        console.log(reciever);
        const recieverId=await userModel.findOne({username:reciever},{password:0});
        console.log(recieverId)
        if(!recieverId){
          return  response.errorResponseNotFound(res,"No Reciever found with this Username!")
        };
        const newConversation=await conversationModel.create({
            participants:[id,recieverId]
        });
        if(newConversation.participants.length >= 4){
            return response.errorResponseNotFound(res,"maximum group chat can Have four participants!")
         }
        await newConversation.save();
        return response.successResponseWithData(res,newConversation,`New conversation crested with:${reciever}!`)
    } catch (error) {
        console.log(error)
        return response.errorResponseServer(res,"An error Occured while creating a Conversation!")
    }
}


const createChat=async(req,res)=>{
    try {
        console.log(req.body)
        const {path}=req.file
        console.log(req.file)
        const _id=req.user.id;
        
        const {reciever,contentType,message,conversationId}=req.body;
        const recieverExist=await userModel.findOne({username:reciever});
        if(!recieverExist){
          return  response.errorResponseBadRequest(res,"No user with this username found")
        }; 
         const fileUrl =await generatePresignedUrl(path);
         console.log(fileUrl)
        let newChat=await chatModel.create({
            conversationId:conversationId,sender:_id,reciever:reciever,contentType:contentType,message:message
            })
        if(contentType==='audio' || contentType==='video' || contentType==='file'){
             newChat=await chatModel.create({
                conversationId:conversationId,sender:_id,reciever:reciever,contentType:contentType,messageUrl:fileUrl
                });  
        };
        await newChat.save();
        return response.successResponseWithData(res,newChat,'Message sent successfullly!')
    } catch (error) {
        console.log(error)
        return response.errorResponseServer(res,'An error Occured While Creating Chat!')
    }
};


const getAllConversations=async(req,res)=>{
    try {
        const id=req.user.id;
        const userConversations=await conversationModel.find({participants:id},{_id:1,participants:1}).limit(50)
        if(!userConversations){
          return  response.errorResponseNotFound(res,'No conversation found for this user')
        };
        return response.successResponseWithData(res,userConversations,"Retrieved User messages Succesfully")
    } catch (error) {
        return response.errorResponseServer(res,'An error Occured While loading Chat!')
    }
}
const getAllConversationById=async(req,res)=>{
    try {
        const _id=req.params.id;
        const userConversations=await chatModel.findById({conversationId:_id})
        if(!userConversations){
          return  response.errorResponseNotFound(res,'No conversation found for this user')
        };
        return response.successResponseWithData(res,userConversations,"Retrieved User messages Succesfully")
    } catch (error) {
        return response.errorResponseServer(res,'An error Occured While loading Chat messages!')
    }
}

module.exports={createChat,createConversation,getAllConversations,getAllConversationById}