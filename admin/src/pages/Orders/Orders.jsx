import React, { useEffect, useState } from 'react';
import './Orders.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(url + "/api/order/list");
      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Orders fetched successfully:", response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error fetching orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value
      });
      if (response.data.success) {
        fetchAllOrders(); // Refresh orders after updating the status
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  const paymentStatusHandler = async (event, orderId) => {
    const paymentStatus = event.target.value === "true";  // Ensure that the value is a boolean
  
    console.log("Updating payment status to:", paymentStatus, "for order:", orderId);

    try {
        const response = await axios.post(url + "/api/order/payment-status", {
            orderId,
            paymentStatus,  // Send the boolean value directly
        });

        console.log("Response from server:", response.data); // Ensure this shows in logs

        if (response.data.success) {
            fetchAllOrders(); // Refresh orders after updating payment status
        } else {
            toast.error("Failed to update payment status: " + response.data.message); // Show error message
        }
    } catch (error) {
        console.error("Error updating payment status:", error);  // More detailed logging
        toast.error("Error updating payment status.");
    }
};


  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className='order-item'>
              <img src={assets.parcel_icon} alt="Parcel icon" />
              <div>
                <p className='order-item-food'>
                  {Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, itemIndex) => (
                      <span key={itemIndex}>
                        {item.name} x {item.quantity}
                        {itemIndex !== order.items.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    <span>No items found</span>
                  )}
                </p>
                <p className='order-item-name'>{order.address.firstName} {order.address.lastName}</p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>{order.address.city}, {order.address.state} {order.address.zipcode}</p>
                  <p>{order.address.country}</p>
                </div>
                <p className='order-item-phone'>{order.address.phone}</p>
              </div>
              <p>Items: {order.items ? order.items.length : 0}</p>
              <p>Rp{order.amount}</p>

              {/* Container for both dropdowns */}
              <div className="order-status-payment">
                {/* Status Dropdown */}
                <select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {/* Payment Status Dropdown */}
                <select
                  onChange={(event) => paymentStatusHandler(event, order._id)}
                  value={order.payment ? true : false}  // Use booleans directly
                >
                  <option value={false}>UNPAID</option>
                  <option value={true}>PAID</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
