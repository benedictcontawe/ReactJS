import React from "react";

import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <ul className='navbar_list'>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/products'>Products</Link>
                </li>
                <li>
                    <Link to='/articles'>Articles</Link>
                </li>
                <li>
                    <Link to='/admin'>Admin</Link  >
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;