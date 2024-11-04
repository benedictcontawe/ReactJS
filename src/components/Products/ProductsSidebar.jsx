import React, { useEffect, useState } from 'react'
import "./ProductsSidebar.css"
import apiClient from '../utils/api-client'
import LinkWithIcon from '../NavBar/LinkWithIcon'
import rocket from "../../assets/rocket.png"

const ProductsSidebar = () => {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState("")
  useEffect(() => {
    apiClient.get("/category")
    .then(response => setCategories(response.data))
    .catch(error => setError(error.message))
  }, [])
  return (
    <aside className='products_sidebar'>
        <h2>Category</h2>
        <div className="category_links">
        { error && <em className='form_error'>{error}</em> }
          {
            categories.map( category => 
              <LinkWithIcon 
                key={category._id}
                title={category.name}
                link={`products?category=${category.name}`}
                emoji={`http://localhost:8000/category/${category.image}`}
                sidebar={true}
              />
            )
          }
        </div>
    </aside>
  )
}

export default ProductsSidebar