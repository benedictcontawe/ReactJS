import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Common/Loader";

const Sellers = () => {
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState("")
    const [sellers, setSellers] = useState([])
    useEffect( () => {
        fetchSellers();
        /*
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
        */
    }, []);
    const fetchSellers = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get("https://jsonplaceholder.typicode.com/users")
            console.log("Sellers", "axios.get", response);
            setSellers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log("Sellers", "axios.get", "catch error", error);
            setIsLoading(false);
            setErrors(error.message);
        }
    }
    useEffect(() => {
      document.title = `Seller ${name}`
        return () => {
            console.log("Sellers", "Component Unmount")
        }
    }, [name])
    const addSeller = () => {
        const newSeller = {
            name: name,
            id: sellers.length + 1,
        };
        setSellers([newSeller, ...sellers]);
        axios.post("https://jsonplaceholder.typicode.com/users", newSeller)
        .then((response) => setSellers([response.data, ...sellers]))
        .catch((error) => {
            console.log("Sellers", "axios.post", "catch error", error);
            setErrors(error.message);
            setSellers(sellers);
        });
    };
    const updateSeller = (seller) => {
        const updatedSeller = {
            ...seller, name: seller.name + " Updated"
        }
        setSellers(
            sellers.map((mapSeller) =>
                mapSeller.id === seller.id ? updatedSeller : mapSeller
            )
        );
        axios.patch(`https://jsonplaceholder.typicode.com/users/${seller.id}`, updatedSeller)
        .then((response) => {
            console.log("Sellers", "axios.patch", response.data)
        })
        .catch((error) => {
            console.log("Sellers", "axios.patch", "catch error", error);
            setErrors(error.message);
            setSellers(sellers);
        });
    }
    const deleteSeller = (id) => {
        setSellers(sellers.filter((seller) => seller.id !== id));
        axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then((response) => {
            console.log("Sellers", "axios.delete", response.data)
        })
        .catch((error) => {
            console.log("Sellers", "axios.delete", "catch error", error);
            setErrors(error.message);
            setSellers(sellers);
        });
    }
    if(isLoading) return <Loader/>
    return (
        <>
        <h3>Admin Sellers Page</h3>
        <input type="text" onChange={(event) => setName(event.target.value)}></input>
        <button onClick={addSeller}>Add Seller</button>
        { isLoading && <Loader/> }
        { errors && <em>{errors}</em> }
        <table>
            <tbody> 
            { 
                sellers.map( seller => 
                    <tr key={seller.id}>
                        <td>
                            {seller.name}
                        </td>
                        <td>
                            <button onClick={() => updateSeller(seller)}>Update</button>
                        </td>
                        <td>
                            <button onClick={() => deleteSeller(seller.id)}>Delete</button>
                        </td>
                    </tr>
                ) 
            }
            </tbody>
        </table>
        </>
    );
};

export default Sellers;