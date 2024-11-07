import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from './contexts/UserContext';
import CartContext from './contexts/CartContext';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Routing from './components/Routing/Routing';
import { getUser, getJwt } from './Network/userServices';
import { addToCartAPI, getCartaPI, removeFromCartAPI, increaseProductAPI, decreaseProductAPI } from './Network/cartServices';
import setAuthToken from './Network/setAuthToken';
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
    const productIndex = updatedCart.findIndex((item) => item.product._id === product._id);
    if(productIndex === -1) {
      updatedCart.push({product: product, quantity: quantity});
    } else {
      updatedCart[productIndex].quantity += quantity;
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
  const removeFromCart = (id) => {
    const oldCart = [...cart]
    const newCart = oldCart.filter(item => item.product._id !== id)
    setCart(newCart);
    removeFromCartAPI(id).catch(error => {
      console.log("App", "removeFromCartAPI", error.response)
      toast.error("Something went wrong!")
      setCart(oldCart);
    })
  }
  const updateCart = (type, id) => {
    const oldCart = [...cart]
    const updatedCart = [...cart]
    const productIndex = updatedCart.findIndex(item => item.product._id === id)
    if(type === "increase") {
      updatedCart[productIndex].quantity += 1
      setCart(updatedCart)
      increaseProductAPI(id).catch(error => {
        console.log("App", "increaseProductAPI", error.response)
        toast.error("Something went wrong!")
        setCart(oldCart);
      })
    }
    if(type === "decrease") {
      updatedCart[productIndex].quantity -= 1
      setCart(updatedCart)
      decreaseProductAPI(id).catch(error => {
        console.log("App", "decreaseProductAPI", error.response)
        toast.error("Something went wrong!")
        setCart(oldCart);
      })
    }
  }
  const getCart = () => {
    getCartaPI().then(response => {
      setCart(response.data)
    }).catch(error => {
      console.log("App", "getCartaPI", error.response)
      toast.error("Something went wrong!")
    })
  }
  useEffect(() => {
    if(user) getCart()
  }, [user])
  return (
    <UserContext.Provider value={user}>
      <CartContext.Provider value={{cart, addToCart: addToCart, removeFromCart: removeFromCart, updateCart: updateCart, setCart: setCart}}>
        <div className='app'>
          <Navbar/>
          <main>
            <ToastContainer position='top-right'/>
            <Routing />
          </main>
        </div>
      </CartContext.Provider>
    </UserContext.Provider>
  )
}

export default App