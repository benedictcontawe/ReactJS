import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Routing from './components/Routing/Routing';
import { getUser } from './components/Network/userServices';

const App = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    try {
      const jwtUser = getUser();
      console.log("App", jwtUser);
      if(Date.now() >= jwtUser.exp * 1000) {
        logout();
        location.reload();
      } else {
        setUser(jwtUser);
      }
    } catch (error) {
      console.log("App error", error);
    }
  }, [])
  return (
    <div className='app'>
      <Navbar user={user} />
      <main>
        <Routing />
      </main>
    </div>
  )
}

export default App