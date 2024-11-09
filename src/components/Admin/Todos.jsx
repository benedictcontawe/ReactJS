import React, { useState }from "react";
import Loader from "../Common/Loader";
import useTodosPagination from "../../hooks/useTodosPagination";

const Todos = () => {
    const [page, setPage] = useState(1)
    const pageSize = 10
    const { data: todos, error, isLoading } = useTodosPagination({page, pageSize})
    return <React.Fragment>
        <h3>Todos Pagination</h3>
        { isLoading && <Loader/> }
        { error && <em>{error.message}</em> }
        { todos?.map(todo => 
            <p key={todo.id} >{todo.title}</p>
        ) }
        <button disabled={page === 1} onClick={() => setPage(page - 1)} >Previous</button>
        <button disabled={page * pageSize > 200} onClick={() => setPage(page + 1)} >Next</button>
    </React.Fragment>
}

export default Todos