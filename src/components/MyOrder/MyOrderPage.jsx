import React from 'react'
import './MyOrderPage.css'
import Table from '../Common/Table'
import useData from '../../hooks/useData'
import Loader from '../Common/Loader'

const MyOrderPage = () => {
  const { data: orders, error, isLoading } = useData("/order", null, ["myorders"], 1 * 60 * 1000);
  const getProductString = (order) => {
    const productStringArray = order.products.map( (_product) => 
      `${_product.product.title}(${_product.quantity})`
    );
    return productStringArray.join(", ");
};
  return (
    <section className="align_center myorder_page">
      {isLoading && <Loader />}
      {error && <em className='form_error'>{error}</em>}
      { orders &&
      <Table headings={["Order", "Products", "Total", "Status"]} >
          <tbody>
          { orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{getProductString(order)}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>{order.status}</td>
            </tr>
          )) }
          </tbody>
      </Table>
      }
    </section>
  )
}

export default MyOrderPage