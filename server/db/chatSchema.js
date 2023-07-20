const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const chatRoomSchema = new mongoose.Schema({
    participants:[ObjectId],
    randomStringID:String,
    createdAt:Date
})

const chatRooms=mongoose.model('chatRoom',chatRoomSchema);

const messageSchema=new mongoose.Schema({
    chatRoomId:{
        type:ObjectId,
        ref:'chatrooms'
    },
    msgFrom:String,
    msgTo:String,
    msgBody:String,
    visited:{
        type:Boolean,
        default:false
    },
    timestamp:Date,
})

const messages=mongoose.model('messages',messageSchema)

module.exports = {

    chatRooms,
    messages
}