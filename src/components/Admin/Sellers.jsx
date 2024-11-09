import React, { useState } from "react";
import Loader from "../Common/Loader";
import useSellers from "../../hooks/useSellers";

const Sellers = () => {
    const { data: sellers, error, isLoading } = useSellers();
    const [name, setName] = useState("");
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
        { error && <em>{error.message}</em> }
        <table>
            <tbody> 
            { 
                sellers?.map( seller => 
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