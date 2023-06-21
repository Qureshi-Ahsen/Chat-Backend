const conversationModel=require('../model/conversation');
const userModel=require('../model/user')
const chatModel=require('../model/chat');
const response=require('../helper/response')

const createConversation=async(req,res)=>{
    try {
        const id=req.user.id;
        const {reciever}=req.body;
        const recieverId=await userModel.findOne({username:reciever});
        if(!recieverId){
            response.errorResponseNotFound(res,"No Reciever found with this Username!")
        };
        const newConversation=await conversationModel.create({
            participants:[id,recieverId]
        });
        await newConversation.save();
        return response.successResponseWithData(res,newConversation,`New conversation crested with:${reciever}!`)
    } catch (error) {
        console.log
        return response.errorResponseServer(res,"An error Occured while creating a Conversation!")
    }
}


const createChat=async(req,res)=>{
    try {
        const {filename}=req.file
        const _id=req.user.id;
        
        const {reciever,contentType,message,conversationId}=req.body;
        const recieverExist=await userModel.findOne({username:reciever});
        if(!recieverExist){
            response.errorResponseBadRequest(res,"No user with this username found")
        };
        let newChat=await chatModel.create({
            conversationId:conversationId,sender:_id,reciever:reciever,contentType:contentType,message:message
            })
        if(contentType==='Audio' || contentType==='Video' || contentType==='file'){
             newChat=await chatModel.create({
                conversationId:conversationId,sender:_id,reciever:reciever,contentType:contentType,message:message,messageUrl:filename
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
        const userConversations=await conversationModel.find({sender:id},{_id:1,participants:1})
        if(!userConversations){
            response.errorResponseNotFound(res,'No conversation found for this user')
        };
        return response.successResponseWithData(res,userConversations,"Retrieved User messages Succesfully")
    } catch (error) {
        return response.errorResponseServer(res,'An error Occured While Creating Chat!')
    }
}
const getAllConversationById=async(req,res)=>{
    try {
        const _id=req.params.id;
        const userConversations=await conversationModel.findById(_id,{_id:1,participants:1})
        if(!userConversations){
            response.errorResponseNotFound(res,'No conversation found for this user')
        };
        return response.successResponseWithData(res,userConversations,"Retrieved User messages Succesfully")
    } catch (error) {
        return response.errorResponseServer(res,'An error Occured While Creating Chat!')
    }
}

module.exports={createChat,createConversation,getAllConversations,getAllConversationById}