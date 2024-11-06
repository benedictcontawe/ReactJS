import React from 'react';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Routing from './components/Routing/Routing';
import jwtDecode from 'jwt-decode';

const App = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    try {
      const jwt = localStorage.getItem("token");
      const jwtUser = jwtDecode(jwt);
      console.log("App", jwtUser);
      if(Date.now() >= jwtUser.exp * 1000) {
        localStorage.removeItem("token")
        location.reload()
      } else {
        setUser(jwtUser);
      }
    } catch (error) {
      console.log("App error", error);
    }
  }, [])
  return (
    <div className='app'>
      <Navbar />
      <main>
        <Routing />
      </main>
    </div>
  )
}

export default App