import React from 'react'
import { Link } from "react-router-dom";
import './Navbar.css';
import DarkMode from "../DarkMode/DarkMode"
import Fire from '../../assets/fire.png'
import Star from '../../assets/glowing-star.png'
import Party from '../../assets/partying-face.png'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <h1>MovieManiac</h1>
        <div className="navbar_links">
            <DarkMode />
            <Link to='/popular'>
                Popular 
                <img src={Fire} alt='fire emoji' className='navbar_emoji'/>
            </Link>
        </div>
        <div className="navbar_links">
            <Link to='/top_rated'>
                Top Rated 
                <img src={Star} alt='star emoji' className='navbar_emoji'/>
            </Link>
        </div>
        <div className="navbar_links">
            <Link to='/upcoming'>
                Upcomming 
                <img src={Party} alt='party face emoji' className='navbar_emoji'/>
            </Link>
        </div>
    </nav>
  )
}

export default Navbar