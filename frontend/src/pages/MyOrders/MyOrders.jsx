import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
            if (response.data.success) {
                setData(response.data.data);
                console.log("Orders fetched successfully:", response.data.data);
            } else {
                console.error("Error fetching orders:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className="my-orders">
            <h2>My Orders</h2>
            <div className="container">
                {data.length === 0 ? (
                    <p>No orders found</p> // Display if no orders exist
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="Parcel icon" />
                            <p>
                                {Array.isArray(order.items) && order.items.length > 0 ? (
                                    order.items.map((item, itemIndex) => (
                                        <span key={itemIndex}>
                                            {item.name} x {item.quantity}
                                            {itemIndex !== order.items.length - 1 ? ", " : ""}
                                        </span>
                                    ))
                                ) : (
                                    <span>No items found</span> // Fallback for missing items
                                )}
                            </p>
                            <p>${order.amount.toFixed(2)}</p>
                            <p>Items: {order.items ? order.items.length : 0}</p>
                            <p>
                                <span>&#x25cf;</span>
                                <b>{order.status || "Unknown"}</b> // Fallback for missing status
                            </p>
                            <button onClick={fetchOrders}>Track Order</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
