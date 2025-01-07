import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import NavBar from '@/components/NavBar'
import ChatComponent from '@/components/ChatComponent'
import { UserContext } from '@/components/UserContext'
import { GiPlayButton } from 'react-icons/gi'
import Link from 'next/link'

export default function Plfootball() {
	const [fixtures, setFixtures] = useState([])
	const [activeChats, setActiveChats] = useState([])
	const [predictions, setPredictions] = useState({})
	const [teamStats, setTeamStats] = useState({})
	const [searchTerm, setSearchTerm] = useState('') // Dodaj stan dla pola wyszukiwania

	const { token } = useContext(UserContext)

	useEffect(() => {
		const loadFixtures = async () => {
			const response = await axios.get('/api/fixtures')
			setFixtures(response.data.response)
		}

		loadFixtures()
	}, [])

	const fetchTeamStatistics = async (teamId, leagueId) => {
		try {
			const response = await axios.post('/api/fetchTeamStatistics', { teamId, leagueId })
			return response.data // Zwraca statystyki
		} catch (error) {
			console.error('Error fetching team statistics:', error)
			return null
		}
	}

	const toggleChat = async id => {
		if (activeChats.includes(id)) {
			setActiveChats(activeChats.filter(chatId => chatId !== id))
		} else {
			setActiveChats([...activeChats, id])

			const fixture = fixtures.find(f => f.fixture.id === id)

			if (fixture) {
				try {
					// Pobranie statystyk drużyny gospodarzy
					const homeStats = await fetchTeamStatistics(fixture.teams.home.id, fixture.league.id)
					// Pobranie statystyk drużyny gości
					const awayStats = await fetchTeamStatistics(fixture.teams.away.id, fixture.league.id)

					// Aktualizacja stanu teamStats
					setTeamStats(prevStats => ({
						...prevStats,
						[id]: { homeStats, awayStats },
					}))

					// Pobierz przewidywania
					fetchPredictions(id)
				} catch (error) {
					console.error('Error fetching team statistics:', error)
				}
			}
		}
	}

	// Filtruj mecze na podstawie wartości wpisanej w polu wyszukiwania
	const filteredFixtures = fixtures.filter(fixture => {
		const leagueName = fixture.league.name.toLowerCase()
		const homeTeam = fixture.teams.home.name.toLowerCase()
		const awayTeam = fixture.teams.away.name.toLowerCase()
		const term = searchTerm.toLowerCase()

		return leagueName.includes(term) || homeTeam.includes(term) || awayTeam.includes(term)
	})

	const groupedFixtures = filteredFixtures.reduce((acc, fixture) => {
		const leagueKey = `${fixture.league.name} (${fixture.league.country})`
		if (!acc[leagueKey]) {
			acc[leagueKey] = []
		}
		acc[leagueKey].push(fixture)
		return acc
	}, {})

	return (
		<>
			<NavBar />
			<div className='content-league'>
				<h1>
					<img src='/img/football.png' className='icon-sport' />
					PIŁKA NOŻNA
				</h1>
				<div className='choose-time'>
					<Link href='/pilka-nozna/przedmeczowe' className='pre-match-p active-section'>
						PRZEDMECZOWE
					</Link>
					<Link href='/pilka-nozna/live' className='pre-match-p'>
						NA ŻYWO
					</Link>
				</div>

				{/* Dodane pole wyszukiwania */}
				<div className='search-container'>
					<input
						type='text'
						placeholder='Szukaj meczu lub ligi...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='search-input'
					/>
				</div>

				{Object.keys(groupedFixtures).length === 0 ? (
					''
				) : (
					Object.keys(groupedFixtures).map((leagueKey, leagueIndex) => (
						<div key={leagueIndex}>
							<h2 className='league-header'>{leagueKey}</h2>
							{groupedFixtures[leagueKey].map((fixture, index) => (
								<div key={fixture.fixture.id} className='chat-content'>
									<div onClick={() => toggleChat(fixture.fixture.id)} className='match-name'>
										<GiPlayButton style={{ marginRight: '10px' }} />
										<p>
											{fixture.teams.home.name} - {fixture.teams.away.name}
											<br></br> <span>{new Date(fixture.fixture.date).toLocaleString()}</span>
										</p>
									</div>
									{activeChats.includes(fixture.fixture.id) && (
										<div className='chat-public'>
											<ChatComponent
												token={token}
												username={localStorage.getItem('username')}
												chatId={`Liga-${fixture.fixture.id}`}
												homeTeam={fixture.teams.home.name}
												awayTeam={fixture.teams.away.name}
												homeStats={teamStats[fixture.fixture.id]?.homeStats || {}}
												awayStats={teamStats[fixture.fixture.id]?.awayStats || {}}
												isAnalysisEnabled={true}
												isLive={false}
											/>
										</div>
									)}
								</div>
							))}
						</div>
					))
				)}
			</div>
		</>
	)
}
