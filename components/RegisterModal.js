import React, { useState } from 'react'
import { GiPlayButton } from 'react-icons/gi'

export default function RegisterModal({ isOpen, onRequestClose, onRegister }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [username, setUsername] = useState('')

	if (!isOpen) return null

	const handleSubmit = async e => {
		e.preventDefault()

		const response = await fetch('/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password, username }),
		})

		if (response.ok) {
			// // const { token } = await response.json();
			// // onRegister(token);
			// const data = await response.json()
			// console.log('Otrzymane dane po zalogowaniu:', data)
			// localStorage.setItem('username', data.username);
			// // alert('Pomyślnie zarejestrowano!')
			// alert('Pomyślnie zarejestrowano jako ' + data.username + '!');
			// onRegister(data.username);
			// onRequestClose()

			const data = await response.json()
			console.log('Otrzymane dane po zalogowaniu:', data)
			localStorage.setItem('username', data.username)
			localStorage.setItem('token', data.token) // Jeśli twój backend zwraca token, zapisz go również w localStorage
			alert('Pomyślnie zarejestrowano jako ' + data.username + '!')
			onRegister(data.token) // przekaz token zamiast username
			onRequestClose()
		} else {
			const errorMessage = await response.text()
			alert(errorMessage)
		}
	}

	return (
		<div className='modalOverlay' onClick={onRequestClose}>
			<div className='modal-register' onClick={e => e.stopPropagation()}>
				<h2>Rejestracja</h2>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Login</label>
						<input type='text' value={username} onChange={e => setUsername(e.target.value)} required />
					</div>
					<div>
						<label>Email</label>
						<input type='email' value={email} onChange={e => setEmail(e.target.value)} required />
					</div>
					<div>
						<label>Hasło</label>
						<input type='password' value={password} onChange={e => setPassword(e.target.value)} required />
					</div>
					<button type='submit' className='btn-to-reg'><GiPlayButton style={{ marginRight: '5px' }}/> Zarejestruj się</button>
				</form>
			</div>
		</div>
	)
}
