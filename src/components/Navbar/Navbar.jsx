import React from "react";

import "./Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <ul className='navbar_list'>
                <li>
                    <a href='/'>Home</a>
                </li>
                <li>
                    <a href='/products'>Products</a>
                </li>
                <li>
                    <a href='/articles'>Articles</a>
                </li>
                <li>
                    <a href='/admin'>Admin</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;