import React, { useEffect } from 'react'
import "./ProductsList.css"
import ProductCard from './ProductCard'
import useData from '../../hooks/useData'
import ProductCardSkeleton from './ProductCardSkeleton';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../Common/Pagination';

const ProductsList = () => {
  const [search, setSearch] = useSearchParams();
  const category = search.get("category")
  const page = search.get("page")
  const { data, error, isLoading } = useData("/products", {
    params: { 
      category: category, page: page
    }
  }, [category, page])
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8]
  const handlePageChange = (page) => {
    const currentParams = Object.fromEntries([...search])
    setSearch({ ...currentParams, page: page });
  }
  useEffect(() => {
    const handleScroll = () => {
      const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
      console.log("Scroll Top", scrollTop,"Client Height", clientHeight, "Scroll Height", scrollHeight);
      if(scrollTop + clientHeight >= scrollHeight - 1) {
        console.log("Reached to Bottom!")
      }
    }
    window.addEventListener("scroll", handleScroll)
  }, [])
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
          { isLoading ? skeletons.map( skeleton => <ProductCardSkeleton key={skeleton} />) : 
            data?.products &&
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
        { data && (
          <Pagination totalPost={data?.totalProducts} postsPerPage={8} onClick={handlePageChange} currentPage={page} />
        ) }
    </section>
  )
}

export default ProductsList