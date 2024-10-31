import React from 'react'
import './CartPage.css'
import user from '../../assets/user.webp'

const CartPage = () => {
  return (
    <section className="align_center cart_page">
        <div className="align_center user_info">
            <img src={user} alt="user profile" />
            <p className="user_name">Harley</p>
            <p className="user_email">harley@gmail.com</p>
        </div>
        {/* Cart Table */}
        <table className="table cart_bill">
            <tbody>
                <tr>
                    <td>Subtotal</td>
                    <td>$999</td>
                </tr>
                <tr>
                    <td>Subtotal Charge</td>
                    <td>$5</td>
                </tr>
                <tr className='cart_bill_final'>
                    <td>Total</td>
                    <td>$1004</td>
                </tr>
            </tbody>
            <button className="search_button checkout_button">Checkout</button>
        </table>
    </section>
  )
}

export default CartPage