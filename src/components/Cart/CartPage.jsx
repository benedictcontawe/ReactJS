import React, { useEffect, useState } from 'react'
import './CartPage.css'
import remove from '../../assets/remove.png'
import user from '../../assets/user.webp'
import Table from '../Common/Table'
import QuantityInput from '../SingleProduct/QuantityInput'

const CartPage = ({cart}) => {
    const [subtotal, setSubtotal] = useState(0)
    useEffect(() => {
        let total = 0;
        cart.forEach(item => {
            total += item.product.price * item.quantity
        });
        setSubtotal(total)
    }, [cart])
    console.log("CartPage", cart)
  return (
    <section className="align_center cart_page">
        <div className="align_center user_info">
            <img src={user} alt="user profile" />
            <p className="user_name">Harley</p>
            <p className="user_email">harley@gmail.com</p>
        </div>
        <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]} >
            <tbody>
                { cart.map(({product, quantity}) =>
                <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>${product.price}</td>
                    <td className='align_center table_quantity_input'>
                        <QuantityInput quantity={quantity} stock={product.stock} />
                    </td>
                    <td>${product.price}</td>
                    <td><img src={remove} alt="remove icon" className='cart_remove_icon' /></td>
                </tr>
                ) }
            </tbody>
        </Table>
        <table className="table cart_bill" >
            <tbody>
                <tr>
                    <td>Subtotal</td>
                    <td>${subtotal}</td>
                </tr>
                <tr>
                    <td>Subtotal Charge</td>
                    <td>$5</td>
                </tr>
                <tr className='cart_bill_final'>
                    <td>Total</td>
                    <td>${subtotal + 5}</td>
                </tr>
            </tbody>
        </table>
        <button className="search_button checkout_button">Checkout</button>
    </section>
  )
}

export default CartPage