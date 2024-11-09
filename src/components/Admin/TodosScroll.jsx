import React, { useState }from "react";
import Loader from "../Common/Loader";
import useTodosPagination from "../../hooks/useTodosScroll";

const TodosScroll = () => {
    const pageSize = 10
    const { data, error, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } = useTodosPagination({pageSize})
    return <React.Fragment>
        <h3>Todos Pagination</h3>
        { isLoading && <Loader/> }
        { error && <em>{error.message}</em> }
        { data?.pages.map((page, index) => <React.Fragment key={index}>
            { page?.map(todo => 
                <p key={todo.id} >{todo.title}</p>
            ) }
        </React.Fragment> ) }
        { hasNextPage && 
            <button disabled={isFetchingNextPage} onClick={fetchNextPage} >
                {isFetchingNextPage ? "Loading..." : "Load More"}
            </button> 
        }
    </React.Fragment>
}

export default TodosScroll