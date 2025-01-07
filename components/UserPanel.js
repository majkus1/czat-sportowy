import { useState, useEffect, useContext } from 'react'
import { UserContext } from './UserContext'
import Modal from './Modal'
import PrivateChatComponent from './PrivateChatComponent'
import io from 'socket.io-client'
import { GiPlayButton } from 'react-icons/gi'

const UserPanel = () => {
	const [isPrivateChatOpen, setPrivateChatOpen] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const [chatHistory, setChatHistory] = useState([])
	const { token } = useContext(UserContext)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const socket = io('http://localhost:3000')

	const handleSearch = async query => {
		if (!query) return

		try {
			const response = await fetch(`/api/searchUsers?query=${query}`)
			const data = await response.json()
			if (data.success) {
				setSearchResults(data.users)
			}
		} catch (error) {
			console.error('Error during user search:', error)
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			handleSearch(searchQuery)
		}, 500)

		return () => clearTimeout(timer)
	}, [searchQuery])

	const fetchChatHistory = async () => {
		// console.log('Fetching chat history...')
		const username = localStorage.getItem('username')
		if (username) {
			try {
				const response = await fetch(`/api/getChatHistory?username=${username}`)
				const data = await response.json()
				// console.log('Chat history data:', data)
				setChatHistory(data)
			} catch (error) {
				console.error('Błąd podczas pobierania historii czatów:', error)
			}
		}
	}

	useEffect(() => {
		fetchChatHistory()

		// Nasłuchuj na nowe wiadomości publiczne
		socket.on('receive_message', message => {
			if (message.receiver === localStorage.getItem('username')) {
				fetchChatHistory()
			}
		})

		// Nasłuchuj na nowe wiadomości prywatne
		socket.on('receive_private_message', message => {
			console.log('Private message received:', message)
			if (message.receiver === localStorage.getItem('username')) {
				fetchChatHistory()
			}
		})

		return () => {
			socket.off('receive_message')
			socket.off('receive_private_message')
		}
	}, [token])

	const openPrivateChat = username => {
		const currentUsername = localStorage.getItem('username')
		if (username === currentUsername) {
			console.warn('Nie możesz otworzyć czatu z samym sobą.')
			return
		}

		setSelectedUser(username)
		setPrivateChatOpen(true)
	}

	const closeModal = () => {
		setPrivateChatOpen(false)
		setSelectedUser(null)
		fetchChatHistory()
	}

	useEffect(() => {
		// console.log('Chat history updated:', chatHistory)
	}, [chatHistory])

	if (!token) return null

	return (
		<div>
			{isPrivateChatOpen && (
				<Modal onClose={closeModal}>
					<PrivateChatComponent receiver={selectedUser} />
				</Modal>
			)}
			<div className='history-chat'>
				<h2>Czaty Prywatne</h2>
				<ul>
					{chatHistory.map(chat => (
						<li key={chat.username}>
							<span onClick={() => openPrivateChat(chat.username)}>
								{chat.username}{' '}
								{chat.lastMessageDate && (
									<span>
										(
										{new Date(chat.lastMessageDate).toLocaleDateString() === new Date().toLocaleDateString()
											? 'dziś '
											: new Date(chat.lastMessageDate).toLocaleDateString([], {
													year: 'numeric',
													month: '2-digit',
													day: '2-digit',
											  }) + ' '}
										{new Date(chat.lastMessageDate).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}
										)
									</span>
								)}
							</span>
						</li>
					))}
				</ul>
			</div>
			<div className='box-search'>
				<input
					type='text'
					placeholder='Szukaj użytkownika...'
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<button onClick={handleSearch} className='search-btn'>Szukaj</button>
				<ul>
					{searchResults.map(user => (
						<li key={user.username} onClick={() => openPrivateChat(user.username)} style={{ cursor: "pointer" }}>
							{user.username}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

export default UserPanel
