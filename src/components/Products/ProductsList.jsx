import React from 'react'
import "./ProductsList.css"
import ProductCard from './ProductCard'
import useData from '../../hooks/useData'
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductsList = () => {
  const { data, error, isLoading } = useData("/products")
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8]
  console.log("ProductList", data?.products, error, isLoading)
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
          { isLoading && skeletons.map( skeleton => <ProductCardSkeleton key={skeleton} />) }
          { data?.products &&
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