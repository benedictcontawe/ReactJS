import React, { useEffect, useState } from 'react'
import "./ProductsList.css"
import ProductCard from './ProductCard'
import useData from '../../hooks/useData'
import ProductCardSkeleton from './ProductCardSkeleton';
import { useSearchParams } from 'react-router-dom';

const ProductsList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useSearchParams();
  const category = search.get("category")
  const { data, error, isLoading } = useData("/products", {
    params: { 
      category: category, parPage: 5, page: page
    }
  }, [category, page])
  useEffect(() => {
    setPage(1)
  }, [category])
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8]
  const handlePageChange = (page) => {
    const currentParams = Object.fromEntries([...search])
    setSearch({ ...currentParams, page: parseInt(currentParams.page) + 1 });
  }   
  useEffect(() => {
    const handleScroll = () => {
      const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
      console.log("Scroll Top", scrollTop,"Client Height", clientHeight, "Scroll Height", scrollHeight);
      if(scrollTop + clientHeight >= scrollHeight - 1 && !isLoading && data && page < data.totalPages) {
        console.log("Reached to Bottom!")
        setPage((previous) => {
          previous + 1
        })
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data, isLoading])
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
          { data?.products && data.products.map((product) => 
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
          ) } 
          { isLoading && skeletons.map( skeleton => <ProductCardSkeleton key={skeleton} />) }
        </div>
    </section>
  )
}

export default ProductsList