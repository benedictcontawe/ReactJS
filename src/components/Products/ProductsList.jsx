import React from 'react'
import "./ProductsList.css"
import ProductCard from './ProductCard'
import useData from '../../hooks/useData'

const ProductsList = () => {
  const { data, error } = useData("/products")  
  //console.log("ProductList", data.products)
  return (
    <section>
        <header className="align_center products_list_header">
            <h2>Products</h2>
            <select name='sort' id='products_sorting' >
                <option value="">Relevance</option>
                <option value="price desc">Price High to Low</option>
                <option value="price asc">Price Low to High</option>
                <option value="rate desc">Rate High to Low</option>
                <option value="rate asc">Rate Low to High</option>
            </select>
        </header>
        <div className='products_list'>
          { error && <em className='form_error'>{error}</em> }
          { data.products &&
            data.products.map( product => 
              <ProductCard 
                key={product._id}
                id={product._id}
                image={product.images[0]}
                price={product.price}
                title={product.title}
                rating={product.reviews.rate}
                ratingCounts={product.reviews.counts}
                stock={product.stock}
              />
            )
          }
        </div>
    </section>
  )
}

export default ProductsList