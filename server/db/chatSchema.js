const { ObjectId } = require('mongodb');
const mongoose = require('mongoose')

const chatRoomSchema = new mongoose.Schema({
    participants:[ObjectId],
    randomStrindID:String,
    createdAt:Date
})

const chatRooms=mongoose.model('chatRoom',chatRoomSchema);

const messageSchema=new mongoose.Schema({
    chatRoomId:{
        type:ObjectId,
        ref:'chatRoom'
    },
    msgFrom:ObjectId,
    msgTo:ObjectId,
    msgBody:String,
    timestamp:Date,
})

const messages=mongoose.model('messages',messageSchema)

module.exports = {
    users,
    chatRooms,
    messages
}