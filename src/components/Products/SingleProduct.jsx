import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const SingleProduct = () => {
    const { id } = useParams();
    console.log("SingleProduct", "params", id)
    const navigate = useNavigate()
    const handleBack = () => {
        console.log("SingleProduct", "handleBack",)
        navigate(-1)
    }
    return (
        <div>
            <h2>SingleProduct - {id} </h2>
            <button onClick={handleBack}>Go Back</button>
        </div>
    );
};

export default SingleProduct;