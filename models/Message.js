import mongoose from 'mongoose';

// const messageSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     timestamp: {
//         type: Date,
//         default: Date.now
//     }
// });
const messageSchema = new mongoose.Schema({
    username: String,
    content: String,
    chatId: String, // Nowe pole
    // timestamp: { type: Date, default: Date.now }
    timestamp: { type: Date, default: Date.now } // Dodaj to pole
});


let Message;

try {
    // Próba pobrania modelu, jeśli istnieje
    Message = mongoose.model('Message');
} catch {
    // Jeśli model nie istnieje, skompiluj go
    Message = mongoose.model('Message', messageSchema);
}

export default Message;

