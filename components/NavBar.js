import { useState, useEffect, useContext } from 'react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'
import { UserContext } from '@/components/UserContext'
import UserPanel from '@/components/UserPanel'
import { GiPlayButton } from 'react-icons/gi'

const getWindowWidth = () => {
	if (typeof window !== 'undefined') {
		return window.innerWidth
	}
	return null
}

export default function NavBar() {
	const [isRegisterModalOpen, setRegisterModalOpen] = useState(false)
	const [isLoginModalOpen, setLoginModalOpen] = useState(false)
	const { token, setToken, setUsername } = useContext(UserContext)
	const [isUserPanelVisible, setUserPanelVisible] = useState(false)
	const windowWidth = getWindowWidth()

	const handleLogin = newToken => {
		setToken(newToken)
		setLoginModalOpen(false)
		localStorage.setItem('token', newToken)
	}

	const handleRegister = newToken => {
		setToken(newToken)
		setRegisterModalOpen(false)
		localStorage.setItem('token', newToken)
	}

	const handleLogout = () => {
		setToken(null)
		setUsername(null)
		localStorage.removeItem('token')
		localStorage.removeItem('username')
	}

	return (
		<div>
			<div className='head-navbar'>
				<h1>Czat Sportowy</h1>
				<p>z myślą o kibicach</p>
			</div>
			<div className='panel'>
				{token ? (
					<div className='panel-login'>
						<span className='you-log'>Jesteś zalogowany</span>
						<button className='panel-button' onClick={() => setUserPanelVisible(!isUserPanelVisible)}>
							<GiPlayButton />
							Panel
						</button>

						<button onClick={handleLogout} className='log-out-btn'>
							<GiPlayButton />
							Wyloguj się
						</button>
					</div>
				) : (
					<div className='panellogreg'>
						<button onClick={() => setLoginModalOpen(true)} className='btn-login'>
							<GiPlayButton />
							Logowanie
						</button>
						<LoginModal
							isOpen={isLoginModalOpen}
							onRequestClose={() => setLoginModalOpen(false)}
							onLogin={handleLogin}
							className='login-modal'
						/>
						<button onClick={() => setRegisterModalOpen(true)} className='btn-reg'>
							<GiPlayButton />
							Rejestracja
						</button>
						<RegisterModal
							isOpen={isRegisterModalOpen}
							onRequestClose={() => setRegisterModalOpen(false)}
							onRegister={handleRegister}
							className='register-modal'
						/>
					</div>
				)}

				{(isUserPanelVisible || (windowWidth && windowWidth > 900)) && <UserPanel />}
			</div>
		</div>
	)
}
