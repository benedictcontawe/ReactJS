import React, { useEffect, useState } from 'react'
import "./ProductsList.css"
import ProductCard from './ProductCard'
import useData from '../../hooks/useData'
import ProductCardSkeleton from './ProductCardSkeleton';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../Common/Pagination';

const ProductsList = () => {
  const [sortBy, setSortBy] = useState("");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [search, setSearch] = useSearchParams();
  const category = search.get("category")
  const page = search.get("page")
  const searchQuery = search.get("search")
  const { data, error, isLoading } = useData("/products", {
    params: { 
      search: searchQuery, category: category, page: page
    }
  }, [searchQuery, category, page])
  const skeletons = [1, 2, 3, 4, 5, 6, 7, 8]
  const handlePageChange = (page) => {
    const currentParams = Object.fromEntries([...search])
    setSearch({ ...currentParams, page: page });
  }
  useEffect(() => {
    const handleScroll = () => {
      const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
      console.log("ProductsList", "Scroll Top", scrollTop,"Client Height", clientHeight, "Scroll Height", scrollHeight);
      if(scrollTop + clientHeight >= scrollHeight - 1) {
        console.log("ProductsList", "Reached to Bottom!")
      }
    }
    window.addEventListener("scroll", handleScroll)
  }, [])
  useEffect(() => {
    console.log("ProductsList", "sortBy", sortBy)
    const dataIsNotEmpty = data && data.products
    if(dataIsNotEmpty) {
      const products = [...data.products]
      if(sortBy == "price desc") {
        setSortedProducts(products.sort((a, b) => { return b.price - a.price }))
      } else if (sortBy === "price asc") {
        setSortedProducts(products.sort((a, b) => a.price - b.price ))
      } else if (sortBy === "rate desc") {
        setSortedProducts(products.sort((a, b) => { return b.reviews.rate - a.reviews.rate }))
      } else if (sortBy === "rate asc") {
        setSortedProducts(products.sort((a, b) => a.reviews.rate - b.reviews.rate))
      } else {
        setSortedProducts(products)
      }
    }
  }, [sortBy, data])
  console.log("ProductList", data?.products, error, isLoading)
  return (
    <section>
        <header className="align_center products_list_header">
            <h2>Products</h2>
            <select name='sort' id='products_sorting' onChange={event => setSortBy(event.target.value)} >
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
            sortedProducts.map( product => 
              <ProductCard key={product._id} product={product} />
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