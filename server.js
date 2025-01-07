const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors') // Dodajemy wymagany moduł CORS

const app = express()

// Konfigurujemy CORS dla Express
app.use(cors())

const server = http.createServer(app)

// Konfigurujemy CORS dla socket.io
const io = socketIo(server, {
	cors: {
		origin: ['http://localhost:3001', 'https://czatsportowy.pl', 'https://www.czatsportowy.pl'],
		methods: ['GET', 'POST'],
	},
})

io.on('connection', socket => {
	console.log('Użytkownik połączony')

	// Umożliw użytkownikowi dołączenie do pokoju czatu na podstawie chatId
	socket.on('join_chat', chatId => {
		socket.join(chatId)
	})

	socket.on('send_message', message => {
		message.timestamp = new Date()
		// Emituj wiadomość tylko do klientów, którzy są w tym samym czacie
		io.to(message.chatId).emit('receive_message', message)
	})

	// server.js
	socket.on('send_private_message', message => {
        console.log("Private message sent:", message);
		message.timestamp = new Date()
		io.to(message.chatId).emit('receive_private_message', message)
	})

	socket.on('disconnect', () => {
		console.log('Użytkownik rozłączony')
	})
})

server.listen(3000, () => {
	console.log('Serwer działa na porcie 3000')
})




// const express = require('express');
// const next = require('next');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');

// // Konfiguracja Next.js
// const dev = process.env.NODE_ENV !== 'production';
// const nextApp = next({ dev });
// const handle = nextApp.getRequestHandler();

// // Utwórz aplikację Express.js
// const app = express();

// // Ustaw CORS dla Express.js
// app.use(cors());

// // Obsługa statycznych plików z katalogu public
// app.use('/public', express.static('public'));

// // Przekieruj wszystkie żądania do Next.js
// app.all('*', (req, res) => {
//   return handle(req, res);
// });

// // Utwórz serwer HTTP dla Express i socket.io
// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: '*',  // Pozwalaj na połączenia z dowolnego źródła; dostosuj to w produkcji!
//     methods: ['GET', 'POST']
//   }
// });

// // Logika dla socket.io
// io.on('connection', socket => {
//   console.log('Użytkownik połączony');

//   socket.on('join_chat', chatId => {
//     socket.join(chatId);
//   });

//   socket.on('send_message', message => {
//     message.timestamp = new Date();
//     io.to(message.chatId).emit('receive_message', message);
//   });

//   socket.on('send_private_message', message => {
//     message.timestamp = new Date();
//     io.to(message.chatId).emit('receive_private_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('Użytkownik rozłączony');
//   });
// });

// // Uruchom serwer
// nextApp.prepare().then(() => {
//   server.listen(3000, () => {
//     console.log('Serwer działa na porcie 3000');
//   });
// });




// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors');
// const next = require('next');

// const dev = process.env.NODE_ENV !== 'production';
// const nextApp = next({ dev });
// const handle = nextApp.getRequestHandler();

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = socketIo(server, {
//   cors: {
//     origin: 'http://localhost:3001',
//     methods: ['GET', 'POST'],
//   },
// });

// io.on('connection', socket => {
//   console.log('Użytkownik połączony');

//   socket.on('join_chat', chatId => {
//     socket.join(chatId);
//   });

//   socket.on('send_message', message => {
//     message.timestamp = new Date();
//     io.to(message.chatId).emit('receive_message', message);
//   });

//   socket.on('send_private_message', message => {
//     console.log("Private message sent:", message);
//     message.timestamp = new Date();
//     io.to(message.chatId).emit('receive_private_message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('Użytkownik rozłączony');
//   });
// });

// app.all('*', (req, res) => {
//   return handle(req, res);
// });

// nextApp.prepare().then(() => {
//   server.listen(3000, () => {
//     console.log('Serwer działa na porcie 3000');
//   });
// });
