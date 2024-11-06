import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Routing from './components/Routing/Routing';
import { getUser } from './components/Network/userServices';

const App = () => {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
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
  const addToCart = (product, quantity) => {
    const updatedCart = [...cart]
    updatedCart.findIndex((item) => item.product_id === product._id)
    if(productIndex === -1) {
      updatedCart.push({product: product, quantity: quantity})
    } else {
      updatedCart[productIndex].quantity += quantity
    }
    setCart(updatedCart)
  }
  return (
    <div className='app'>
      <Navbar user={user} cartCount={cart.length} />
      <main>
        <Routing addToCart={addToCart}/>
      </main>
    </div>
  )
}

export default App