import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Common/Loader";

const Sellers = () => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [sellers, setSellers] = useState([])
    useEffect( () => {
        setIsLoading(true)
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
            console.log("Sellers", "axios.get", response)
            setSellers(response.data)
            setIsLoading(false)
        })
        document.title = `Seller ${name}`
        return () => {
            console.log("Sellers", "Component Unmount")
        }
    }, [name])
    if(isLoading) return <div>
        <h3>Loading. . .</h3> 
        <Loader/>
    </div>
    return (
        <>
        <h3>Admin Sellers Page</h3>
        <input type="text" onChange={(e) => setName(e.target.value)}></input>
        { isLoading && <Loader/> }
        {
            sellers.map( seller => 
                <p key={seller.id}>{seller.name}</p>
            )
        }
        </>
    );
};

export default Sellers;