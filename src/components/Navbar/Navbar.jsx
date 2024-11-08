import React, { useContext, useState } from 'react';
import './Navbar.css';
import rocket from '../../assets/rocket.png';
import star from '../../assets/glowing-star.png';
import idButton from '../../assets/id-button.png';
import memo from '../../assets/memo.png';
import order from '../../assets/package.png';
import lock from '../../assets/locked.png';
import LinkWithIcon from './LinkWithIcon';
import { NavLink, useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import CartContext from '../../contexts/CartContext';

const Navbar = () => {
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const user = useContext(UserContext)
  const { cart } = useContext(CartContext)
  const handleSubmit = (event) => {
    event.preventDefault()
    if(search.trim() !== "") {
      navigate(`/products?search=${search.trim()}`)
    }
  }
  return (
    <nav className='align_center navbar'>
        <div className='align_center'>
            <h1 className='navbar_heading'>CarWish</h1>
            <form className='align_center navbar_form' onSubmit={handleSubmit} >
                <input 
                  type='text' 
                  className='navbar_search' 
                  placeholder='Search Products' 
                  value={search}
                  onChange={event => setSearch(event.target.value)} />
                <button type='submit' className='search_button' >Search</button>
            </form>
        </div>
        <div className='align_center navbar_links'>
            <LinkWithIcon title="Home" link="/" emoji={rocket}/>
            <LinkWithIcon title="Products" link="/products" emoji={star}/>
            { !user &&
              <React.Fragment>
              <LinkWithIcon title="LogIn" link="/login" emoji={idButton}/>
              <LinkWithIcon title="SignUp" link="/signup" emoji={memo}/>
              </React.Fragment>
            }
            { user &&
              <React.Fragment>
              <LinkWithIcon title="My Orders" link="/myorders" emoji={order}/>
              <LinkWithIcon title="Logout" link="/logout" emoji={lock}/>
              <NavLink to="/cart" className='align_center'>
                Cart <p className="align_center cart_counts">{cart.length}</p>
              </NavLink>
              </React.Fragment>
            }
        </div>
    </nav>
  )
}

export default Navbar