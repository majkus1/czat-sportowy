import connectToDb from '../../lib/db';
import PrivateChat from '../../models/PrivateChat'; // Upewnij się, że masz taki model w swoim projekcie

export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).end();

  const { username } = req.query;

  await connectToDb();

  try {
    const chats = await PrivateChat.find({
      chatId: new RegExp(username, 'i')
    });

    const chatHistory = chats.map(chat => {
      const participants = chat.chatId.split('_');
      const otherUser = participants.find(participant => participant !== username);

      // Znajdź ostatnią wiadomość wysłaną przez drugiego użytkownika
      const lastMessageByOtherUser = chat.messages
        .filter(message => message.username === otherUser)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      return {
        username: otherUser,
        lastMessageDate: lastMessageByOtherUser ? lastMessageByOtherUser.timestamp : null,
      };
    });

    res.status(200).json(chatHistory);
  } catch (error) {
    res.status(500).json({ error: 'Błąd podczas pobierania historii czatów.' });
  }
};
