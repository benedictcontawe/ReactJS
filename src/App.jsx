import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Routing from './components/Routing/Routing';
import { getUser, getJwt } from './components/Network/userServices';
import { addToCartAPI } from './components/Network/cartServices';
import setAuthToken from './components/Network/setAuthToken';
import 'react-toastify/dist/ReactToastify.css'

setAuthToken(getJwt());

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
    const productIndex = updatedCart.findIndex((item) => item.product_id === product._id)
    if(productIndex === -1) {
      updatedCart.push({product: product, quantity: quantity})
    } else {
      updatedCart[productIndex].quantity += quantity
    }
    setCart(updatedCart)
    addToCartAPI(product._id, quantity)
    .then(response => {
      console.log("App", "addToCartAPI", response.data)
      toast.success("Product Added Successfully!")
    }).catch(error => {
      console.log("App", "addToCartAPI", error.response)
      toast.error("Failed to add product!")
      setCart(cart)
    })
  }
  return (
    <div className='app'>
      <Navbar user={user} cartCount={cart.length} />
      <main>
        <ToastContainer position='top-right'/>
        <Routing addToCart={addToCart}/>
      </main>
    </div>
  )
}

export default App