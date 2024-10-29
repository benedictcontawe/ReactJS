import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Common/Loader";

const Sellers = () => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState("")
    const [sellers, setSellers] = useState([])
    useEffect( () => {
        setIsLoading(true)
        axios.get("https://jsonplaceholder.typicode.com/users")
        .then((response) => {
            console.log("Sellers", "axios.get", response);
            setSellers(response.data);
            setIsLoading(false);
        }).catch((error) => {
            console.log("Sellers", "axios.get", "catch error", error);
            setIsLoading(false);
            setErrors(error.message);
        })
    }, [])
    useEffect(() => {
      document.title = `Seller ${name}`
        return () => {
            console.log("Sellers", "Component Unmount")
        }
    }, [name])
    if(isLoading) return <Loader/>
    return (
        <>
        <h3>Admin Sellers Page</h3>
        <input type="text" onChange={(event) => setName(event.target.value)}></input>
        { isLoading && <Loader/> }
        { errors && <em>{errors}</em> }
        {
            sellers.map( seller => 
                <p key={seller.id}>{seller.name}</p>
            )
        }
        </>
    );
};

export default Sellers;