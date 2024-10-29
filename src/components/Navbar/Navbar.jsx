import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className='align_center navbar'>
        <div className='align_center'>
            <h1 className='navbar_heading'>CarWish</h1>
            <form className='align_center navbar_form'>
                <input type='text' className='navbar_search' placeholder='Search Products' />
                <button type='submit' className='search_button' >Search</button>
            </form>
        </div>
        <div>
            
        </div>
    </nav>
  )
}

export default Navbar