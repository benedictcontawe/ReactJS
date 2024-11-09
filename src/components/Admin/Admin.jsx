import React from "react";
import { Link, Outlet, Navigate } from "react-router-dom";

const Admin = () => {
    const user = {role: "admin"}
    if(user.role !== "admin") {//Navigate to Home when not admin
        return <Navigate to='/'/>
    }
    return (
        <div>
            <h2>Admin Panel</h2>
            <ul>
                <li>
                    <Link to="/admin/sales">Sales</Link>
                </li>
                <li>
                    <Link to="/admin/todos">Todos</Link>
                </li>
                <li>
                    <Link to="/admin/sellers">Sellers</Link>
                </li>
            </ul>
            <Outlet />
        </div>
    );
};

export default Admin;