import React, { useState } from "react";
import Loader from "../Common/Loader";
import useSellers from "../../hooks/useSellers";
import { useQueryClient } from "@tanstack/react-query";
import useAddSeller from "../../hooks/useAddSeller";
import useDeleteSeller from "../../hooks/useDeleteSeller";
import useUpdateSeller from "../../hooks/useUpdateSeller";

const Sellers = () => {
    const [name, setName] = useState("");
    const { data: sellers, error, isLoading } = useSellers();
    const queryClient = useQueryClient();
    const addSellerMutation = useAddSeller();
    const deleteSellerMutation = useDeleteSeller()
    const updateSellerMutation = useUpdateSeller()

    const addSeller = () => {
        const newSeller = {
            name: name,
            id: sellers.length + 1,
        };
        addSellerMutation.mutate(newSeller)
        setName("")
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
        <input type="text" onChange={(event) => setName(event.target.value)} value={name}></input>
        <button disabled={addSellerMutation.isPending} onClick={addSeller}>{addSellerMutation.isPending ? "Adding Seller" : "Add Seller"}</button>
        { isLoading && <Loader/> }
        { error && <em>{error.message}</em> }
        { addSellerMutation.error && <em>{addSellerMutation.error.message}</em> }
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