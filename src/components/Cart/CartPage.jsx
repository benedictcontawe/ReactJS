import React, { useMemo, useContext, memo } from 'react'
import './CartPage.css'
import remove from '../../assets/remove.png'
import Table from '../Common/Table'
import QuantityInput from '../SingleProduct/QuantityInput'
import UserContext from '../../contexts/UserContext'
import CartContext from '../../contexts/CartContext';
import { checkoutAPI } from '../../Network/oderServices'
import { toast } from 'react-toastify'
import config from '../../Network/config.json'

const CartPage = () => {
    const userObject = useContext(UserContext)
    const { cart, removeFromCart, updateCart, dispatchCart } = useContext(CartContext)
    console.log("CartPage", "cart", cart , "cart.lenght", cart.length)
    const subtotal = useMemo(() => {
        let total = 0;
        cart.forEach(item => {
            console.log("CartPage", "item", item)
            return total += item.product.price * item.quantity
        });
        return total;
    }, [cart])
    console.log("CartPage", cart, userObject)
    const checkout = () => {
        dispatchCart({ type: "CHECKING_OUT_CART" });
        checkoutAPI().then(() => {
            console.log("CartPage", "checkoutAPI", "success ")
            toast.success("Oder placed sucessfully! ")
            dispatchCart({ type: "CHECKED_OUT_CART" });
        }).catch(() => {
            toast.error("Something went wrong!")
            dispatchCart({type: "REVERT_CART", payload: { cart: cart  } });
        })
    }
  return (
    <section className="align_center cart_page">
        <div className="align_center user_info">
            <img src={`${config.back_end_url}/profile/${userObject?.profilePic}`} alt="user profile" />
            <p className="user_name">Name: {userObject?.name}</p>
            <p className="user_email">Email: {userObject?.email}</p>
        </div>
        <Table headings={["Item", "Price", "Quantity", "Total", "Remove"]} >
            <tbody>
                { cart.map(({product, quantity}) =>
                <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>${product.price}</td>
                    <td className='align_center table_quantity_input'>
                        <QuantityInput quantity={quantity} stock={product.stock} setQuantity={updateCart} cartPage={true} productId={product._id} />
                    </td>
                    <td>${product.price}</td>
                    <td>
                        <img src={remove} alt="remove icon" className='cart_remove_icon' onClick={() => removeFromCart(product._id)} />
                    </td>
                </tr>
                ) }
            </tbody>
        </Table>
        <table className="table cart_bill" >
            <tbody>
                <tr>
                    <td>Subtotal</td>
                    <td>${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Subtotal Charge</td>
                    <td>$5</td>
                </tr>
                <tr className='cart_bill_final'>
                    <td>Total</td>
                    <td>${(subtotal + 5).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        <button className="search_button checkout_button" onClick={checkout}>Checkout</button>
    </section>
  )
}

export default memo(CartPage)