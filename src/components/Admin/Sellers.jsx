import React, { useEffect, useState } from "react";
import axios from "axios";

const Sellers = () => {
    const [name, setName] = useState("");
    const [sellers, setSellers] = useState([])
    useEffect( () => {
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
            console.log("Sellers", "axios.get", response)
            setSellers(response.data)
        })
        document.title = `Seller ${name}`
        return () => {
            console.log("Sellers", "Component Unmount")
        }
    }, [name])
    return (
        <>
        <h3>Admin Sellers Page</h3>
        <input type="text" onChange={(e) => setName(e.target.value)}></input>
        {
            sellers.map(seller => 
                <p key={seller.id}>{seller.name}</p>
            )
        }
        </>
    );
};

export default Sellers;