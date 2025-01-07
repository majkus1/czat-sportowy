import React, { useState, useContext } from 'react';
import { UserContext } from '@/components/UserContext'
import { GiPlayButton } from 'react-icons/gi'

export default function LoginModal({ isOpen, onRequestClose, onLogin }) {
	const [username, setUsernames] = useState('')
	const [password, setPassword] = useState('')
	// const { setToken, setUsername: setContextUsername } = useContext(UserContext);
	const { setToken, setUsername } = useContext(UserContext);



	if (!isOpen) return null

	// const handleSubmit = async e => {
	// 	e.preventDefault()
	// 	const response = await fetch('/api/login', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ username, password }),
	// 	})

	// 	if (response.ok) {
	// 		// const { token } = await response.json();
	// 		const data = await response.json()
	// 		const { token } = data
	// 		console.log('Otrzymany token:', token) // Dodane
	// 		localStorage.setItem('username', data.username);
	// 		localStorage.setItem('token', token)
	// 		onLogin(token)
	// 		alert('Pomyślnie zalogowano jako ' + data.username + '!');
	// 		// onLogin(data.username);
	// 		onRequestClose();
	// 	} else {
	// 		const errorMessage = await response.text()
	// 		alert(errorMessage)
	// 	}
	// }

	const handleSubmit = async e => {
		e.preventDefault();
		const response = await fetch('/api/login', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ username, password }),
		});
	  
		if (response.ok) {
		  const data = await response.json();
		  const { token } = data;
	  
		  // Ustaw wartości w kontekście
		  setToken(token);
		  setUsername(data.username);
	  
		  localStorage.setItem('username', data.username);
		  localStorage.setItem('token', token);
	  
		  onLogin(token); // To może być zbędne, jeśli ustawiasz token w kontekście powyżej
		  alert('Pomyślnie zalogowano jako ' + data.username + '!');
		//   console.log('Otrzymany token:', token)
		  onRequestClose();
		} else {
		  const errorMessage = await response.text();
		  alert(errorMessage);
		}
	  };
	  

	return (
		<div>
			<div className='overlay' onClick={onRequestClose}>
				<div className='modal' onClick={e => e.stopPropagation()}>
					<h2>Logowanie</h2>
					<form onSubmit={handleSubmit}>
						<div>
							<label>Login</label>
							<input type='text' value={username} onChange={e => setUsernames(e.target.value)} required />
						</div>
						<div>
							<label>Hasło</label>
							<input type='password' value={password} onChange={e => setPassword(e.target.value)} required />
						</div>
						<button type='submit' className='btn-to-login'><GiPlayButton style={{ marginRight: '5px' }}/> Zaloguj się</button>
					</form>
				</div>
			</div>
		</div>
	)
}
