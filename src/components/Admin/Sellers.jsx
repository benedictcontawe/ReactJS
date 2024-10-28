import React, { useEffect, useState } from "react";

const Sellers = () => {
    const [name, setName] = useState("");
    useEffect( () => {
        const notification = 5;
        document.title = `Seller ${name}`
    }, [name])
    return (
        <>
        <h3>Admin Sellers Page</h3>
        <input type="text" onChange={(e) => setName(e.target.value)}></input>
        </>
    );
};

export default Sellers;