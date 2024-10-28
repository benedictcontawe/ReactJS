import React, { useEffect }from "react";

const Sales = () => {
    useEffect( () => {
        console.log("Sales Component Mount!")
        const notification = 5;
        document.title = `Sales ${notification} new Notification`
    }, [])
    return <h3>Admin Sales Page</h3>;
};

export default Sales;