import React, { useState } from "react";
import Loader from "../Common/Loader";
import useSellers from "../../hooks/useSellers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../utils/api-client";

const Sellers = () => {
    const [name, setName] = useState("");
    const { data: sellers, error, isLoading } = useSellers();
    const queryClient = useQueryClient();
    const addSellerMutation = useMutation({
        mutationFn: (newSeller) => apiClient.post("/users", newSeller).then(response => response.data),
        onSuccess: (savedSeller, newSeller) => {
            /* Method 1: Invalid cahced data
            queryClient.invalidateQueries({
                queryKey: ["sellers"],
            })
            Method 2: Update the cached data */
            queryClient.setQueryData(["sellers"], (sellers) => [
                savedSeller, 
                ...sellers,
           ])
        },
        onError: null,
    } )

    const deleteSellerMutation = useMutation ( {
        mutationFn: (id) => apiClient.delete(`/users/${id}`).then((response) => response.data)     
    } )

    const updateSellerMutation = useMutation( {
        mutationFn: (updatedSeller) => apiClient.patch(`/users/${updatedSeller.id}`, updatedSeller).then((response) => { return response.data }),
        onSuccess: (updatedSeller) => {
            queryClient.setQueryData(["sellers"], (sellers) => sellers.map((mapSeller) =>
                mapSeller.id === updatedSeller.id ? updatedSeller : mapSeller
            ) )
        }
    } )

    const addSeller = () => {
        const newSeller = {
            name: name,
            id: sellers.length + 1,
        };
        addSellerMutation.mutate(newSeller)
    };

    const updateSeller = (seller) => {
        const updatedSeller = {
            ...seller, name: seller.name + " Updated"
        }
        updateSellerMutation.mutate(updatedSeller)
    }

    const deleteSeller = (id) => {
        deleteSellerMutation.mutate(id, {
            onSuccess: () => {
                queryClient.setQueryData(["sellers"], (sellers) => sellers.filter(seller => seller.id !== id))
            }
        })
    }

    if(isLoading) return <Loader/>
    return (
        <React.Fragment>
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
        </React.Fragment>
    );
};

export default Sellers;