import React from "react";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
    const { id } = useParams();
    console.log("SingleProduct", "params", id)
    return (
        <div>
            <h2>SingleProduct - {id} </h2>
        </div>
    );
};

export default SingleProduct;