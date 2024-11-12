import React from 'react'
import "./ProductsSidebar.css"
import LinkWithIcon from '../NavBar/LinkWithIcon'
import useData from '../../hooks/useData'
import config from '../../Network/config.json'

const ProductsSidebar = () => {
  const { data: categories, error } = useData("/category", null, ["categories"], 24 * 60 * 60 * 1000);
  console.log("ProductsSidebar", categories)
  return (
    <aside className='products_sidebar'>
        <h2>Category</h2>
        <div className="category_links">
        { error && <em className='form_error'>{error}</em> }
          { categories &&
            categories.map( category => 
              <LinkWithIcon 
                key={category._id}
                title={category.name}
                link={`/products?category=${category.name}`}
                emoji={`${config.back_end_url}/category/${category.image}`}
                sidebar={true}
              />
            ) 
          }
        </div>
    </aside>
  )
}

export default ProductsSidebar