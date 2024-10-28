import React from "react";
import { useSearchParams } from "react-router-dom";

const Articles = () => {
    const [ searchParams, setSearchParams ] = useSearchParams()
    const sortBy = searchParams.get("sortBy")
    const category = searchParams.get("category")
    const handleSortBy = () => {
        setSearchParams({
            sortBy: "views",
            category: "electronics",
        });
    }
    return (
        <div>
            <h2>
                Articles
                <p>
                    SortBy: {sortBy} Category: {category}
                </p>
            </h2>
            <button onClick={handleSortBy}>Sort by views</button>
        </div>
    );
};

export default Articles;