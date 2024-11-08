import React, { useState, useContext, memo } from 'react'
import './SingleProductPage.css'
import Loader from '../Common/Loader'
import QuantityInput from './QuantityInput';
import { useParams } from 'react-router-dom';
import useData from '../../hooks/useData';
import UserContext from '../../contexts/UserContext';
import CartContext from '../../contexts/CartContext';

const SingleProductPage = () => {
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const { addToCart } = useContext(CartContext)
    const user = useContext(UserContext)
    const { id } = useParams()
    const { data: product, error, isLoading } = useData(`/products/${id}`)
    console.log("SingleProductPage", product, error, isLoading)
    return (
    <section className='align_center single_product'>
    { error && <em className='form_error'>{error}</em> }
    { isLoading && <Loader />}
    { product && <React.Fragment>
        <div className='align_center'>
            <div className="single_product_thumbnails">
                { product.images.map( (image, index) => 
                    <img 
                        src={`http://localhost:8000/products/${image}`}
                        alt={product.title}  
                        onClick={() => setSelectedImage(index)} 
                        className={selectedImage === index ? "selected_image" : ""
                    } />
                ) }
            </div>
            <img 
                src={`http://localhost:8000/products/${product.images[selectedImage]}`} 
                alt={product.title} 
                className='single_product_display' 
            />
        </div>
        <div className="single_product_details">
            <h1 className='single_product_title'>{product.title}</h1>
            <p className='single_product_description'>{product.description}</p>
            <p className="single_productprice">${product.price.toFixed(2)}</p>
            { user && 
                <React.Fragment>
                <h2 className='quatity_title'>Quantity:</h2>
                <div className="align_center quantity_input">
                    <QuantityInput quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
                </div>
                <button className='search_button add_cart' onClick={() => addToCart(product, quantity)}>Add to Cart</button>
                </React.Fragment>
            }
        </div>
    </React.Fragment> }
    </section>
    )
}

export default memo(SingleProductPage)