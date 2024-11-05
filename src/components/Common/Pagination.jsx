import React from 'react'
import './Pagination.css'

const Pagination = ({ totalPost, postsPerPage, onClick, currentPage }) => {
    let pages = []
    for(let index=1; index <= Math.ceil(totalPost / postsPerPage); index++) {
        pages.push(index)
    }
  return (
    <React.Fragment>
    {
        pages?.length > 1 && 
        <ul className='pagination'>
        {
            pages.map( page =>
                <li key={page}> 
                    <button className={parseInt(currentPage) === page ? 'pagination_button active' : 'pagination_button'} onClick={() => onClick(page)}>
                        {page}
                    </button>
                </li>
            )
        }
        </ul>
    }
    </React.Fragment>
  )
}

export default Pagination