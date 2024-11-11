import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UserContext from './contexts/UserContext';
import CartContext from './contexts/CartContext';
import './App.css';
import Navbar from './components/NavBar/Navbar';
import Routing from './components/Routing/Routing';
import { getUser, getJwt, logout } from './Network/userServices';
import { addToCartAPI, removeFromCartAPI, increaseProductAPI, decreaseProductAPI } from './Network/cartServices';
import setAuthToken from './Network/setAuthToken';
import 'react-toastify/dist/ReactToastify.css'
import cartReducer from './components/reducers/cartReducer';
import useData from './hooks/useData';

setAuthToken(getJwt());

const App = () => {
  const [user, setUser] = useState(null)
  const [cart, dispatchCart] = useReducer(cartReducer, []);
  const {data: cartData, refetch} = useData("/cart", null, ["cart"])
  useEffect(() => {
    if(cartData) {
      dispatchCart({type: "GET_CART", payload: { products: cartData } });
    }
  }, [cartData]);
  useEffect(() => {
    if(user) refetch()
  }, [user]);
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
      console.log("App user", user);
    } catch (error) {
      console.log("App user error", error);
    }
  }, [])
  const addToCart = useCallback((product, quantity) => {
    dispatchCart({type: "ADD_TO_CART", payload: {product: product, quantity: quantity}})
    addToCartAPI(product._id, quantity)
    .then(response => {
      console.log("App", "addToCartAPI", response.data)
      toast.success("Product Added Successfully!")
    }).catch(error => {
      console.log("App", "addToCartAPI", error.response)
      toast.error("Failed to add product!")
      dispatchCart({type: "REVERT_CART", payload: { cart: cart  } });
    })
  }, [cart])
  const removeFromCart = useCallback((id) => {
    dispatchCart({type: "REMOVE_FROM_CART", payload: { id: id }})
    removeFromCartAPI(id).catch(error => {
      console.log("App", "removeFromCartAPI", error.response)
      toast.error("Something went wrong!")
      dispatchCart({type: "REVERT_CART", payload: { cart: cart  } });
    })
  }, [cart])
  const updateCart = useCallback((type, id) => {
    const updatedCart = [...cart]
    const productIndex = updatedCart.findIndex(item => item.product._id === id)
    if(type === "increase") {
      updatedCart[productIndex].quantity += 1
      dispatchCart({ type: "GET_CART", payload: { products: updatedCart } });
      increaseProductAPI(id).catch(error => {
        console.log("App", "increaseProductAPI", error.response)
        toast.error("Something went wrong!")
        dispatchCart({type: "REVERT_CART", payload: { cart: cart  } });
      })
    }
    if(type === "decrease") {
      updatedCart[productIndex].quantity -= 1
      dispatchCart({ type: "GET_CART", payload: { products: updatedCart } });
      decreaseProductAPI(id).catch(error => {
        console.log("App", "decreaseProductAPI", error.response)
        toast.error("Something went wrong!")
        dispatchCart({type: "REVERT_CART", payload: { cart: cart  } });
      })
    }
  }, [cart])
  return (
    <UserContext.Provider value={user}>
      <CartContext.Provider value={{cart, addToCart: addToCart, removeFromCart: removeFromCart, updateCart: updateCart, dispatchCart: dispatchCart}}>
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