// models/PrivateChat.js

const mongoose = require('mongoose');

const privateChatSchema = new mongoose.Schema({
    user1: String,  // Nazwa użytkownika 1
    user2: String,  // Nazwa użytkownika 2
    chatId: String, // Unikalne ID czatu
    messages: [{
        username: String,
        content: String,
        // timestamp: { type: Date, default: Date.now }
        timestamp: { type: Date, default: Date.now } // Dodaj to pole
    }]
});

const PrivateChat = mongoose.models.PrivateChat || mongoose.model('PrivateChat', privateChatSchema);

module.exports = PrivateChat;
