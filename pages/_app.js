import { useState, useEffect } from "react";
import '../styles/LoginModal.scss'
import '../styles/All.scss'
import { UserContext } from '@/components/UserContext';

function MyApp({ Component, pageProps }) {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Pobieranie tokenu z localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ token, setToken: handleLogin, username, setUsername, handleLogout }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  );
}

export default MyApp;
