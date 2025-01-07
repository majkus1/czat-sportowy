import { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from './UserContext'
import io from 'socket.io-client'

// const socket = io('http://localhost:3000');
const socket = io('https://czatsportowy.pl');

const PrivateChatComponent = ({ receiver }) => {
	const [messages, setMessages] = useState([])
	const [currentMessage, setCurrentMessage] = useState('')
	const { token } = useContext(UserContext)
	// const socket = io('http://localhost:3000')
	const messagesContainerRef = useRef(null)

	useEffect(() => {
		if (messagesContainerRef.current) {
			const container = messagesContainerRef.current
			container.scrollTop = container.scrollHeight
		}
	}, [messages])

	useEffect(() => {
		const sender = localStorage.getItem('username') || 'Anonim'
		const chatId = [sender, receiver].sort().join('_')

		// Dołączanie do pokoju czatu
		socket.emit('join_chat', chatId)

		const fetchMessages = async () => {
			try {
				const response = await fetch(`/api/getPrivateMessages?chatId=${chatId}`)
				const data = await response.json()

				if (Array.isArray(data)) {
					setMessages(data)
				} else {
					console.error('Oczekiwano tablicy wiadomości, ale otrzymano:', data)
					setMessages([])
				}
			} catch (error) {
				console.error('Błąd podczas pobierania wiadomości:', error)
			}
		}

		fetchMessages()

		socket.on('receive_private_message', message => {
			console.log('Otrzymano prywatną wiadomość:', message)
			if (message.chatId === chatId) {
				setMessages(prevMessages => [...prevMessages, message])
			}
		})

		// return () => {
		// 	socket.off('receive_private_message')
		// }
		return () => {
			socket.off('receive_private_message');
			socket.off('join_chat');
		}
	}, [receiver])

	const handleSendMessage = async () => {
		if (!receiver) {
			console.error('Receiver is not defined!')
			return
		}

		const username = localStorage.getItem('username') || 'Anonim'
		const chatId = [username, receiver].sort().join('_')
		if (currentMessage.trim()) {
			console.log('Wysyłanie wiadomości od', username, 'do', chatId.split('_')[1])
			try {
				const response = await fetch('/api/sendPrivateMessage', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						username: username,
						content: currentMessage,
						chatId: chatId,
					}),
				})

				const data = await response.json()
				if (data.success) {
					const messageObject = {
						username: username,
						content: currentMessage,
						chatId: chatId,
					}
					socket.emit('send_private_message', messageObject)
					setCurrentMessage('')
				} else {
					console.error(data.message)
				}
			} catch (error) {
				console.error('Błąd podczas wysyłania wiadomości:', error)
			}
		}
	}

	const formatDate = timestamp => {
		const messageDate = new Date(timestamp)
		const currentDate = new Date()

		if (
			messageDate.getDate() === currentDate.getDate() &&
			messageDate.getMonth() === currentDate.getMonth() &&
			messageDate.getFullYear() === currentDate.getFullYear()
		) {
			return `Dziś ${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
		} else {
			return messageDate.toLocaleString([], {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
			})
		}
	}

	return (
		<div className='private-content-chat'>
			<div>
				<div className='messages-container' ref={messagesContainerRef}>
					{messages.map((msg, idx) => (
						<div key={idx} className='message-one'>
							<strong>{msg.username}</strong>: {msg.content}
							<span style={{ marginLeft: '10px', fontSize: '0.8em', color: 'gray' }}>{formatDate(msg.timestamp)}</span>
						</div>
					))}
				</div>
			</div>
			{token ? (
				<div className='send-public-chat'>
					<input
						value={currentMessage}
						onChange={e => setCurrentMessage(e.target.value)}
						type='text'
						placeholder='Napisz wiadomość...'
					/>
					<button onClick={handleSendMessage}>Wyślij</button>
				</div>
			) : (
				<p>Musisz się zalogować, aby napisać wiadomość.</p>
			)}
		</div>
	)
}

export default PrivateChatComponent
