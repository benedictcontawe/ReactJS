import React, { useEffect, useState } from "react";
import apiClient from "../../utils/api-client";
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
        apiClient.get("/users")
        .then((response) => {
            console.log("Sellers", "apiClient.get", response);
            setSellers(response.data);
            setIsLoading(false);
        }).catch((error) => {
            console.log("Sellers", "apiClient.get", "catch error", error);
            setIsLoading(false);
            setErrors(error.message);
        })
        */
    }, []);
    const fetchSellers = async () => {
        try {
            setIsLoading(true)
            const response = await apiClient.get("/users")
            console.log("Sellers", "apiClient.get", response);
            setSellers(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log("Sellers", "apiClient.get", "catch error", error);
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
        apiClient.post("/users", newSeller)
        .then((response) => setSellers([response.data, ...sellers]))
        .catch((error) => {
            console.log("Sellers", "apiClient.post", "catch error", error);
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
        apiClient.patch(`/users/${seller.id}`, updatedSeller)
        .then((response) => {
            console.log("Sellers", "apiClient.patch", response.data)
        })
        .catch((error) => {
            console.log("Sellers", "apiClient.patch", "catch error", error);
            setErrors(error.message);
            setSellers(sellers);
        });
    }
    const deleteSeller = (id) => {
        setSellers(sellers.filter((seller) => seller.id !== id));
        apiClient.delete(`/users/${id}`)
        .then((response) => {
            console.log("Sellers", "apiClient.delete", response.data)
        })
        .catch((error) => {
            console.log("Sellers", "apiClient.delete", "catch error", error);
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