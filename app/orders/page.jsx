'use client'

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import Link from 'next/link';

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  function getOrCreateDeviceId() {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    }
    return null;
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const uniqueDeviceId = getOrCreateDeviceId();



  useEffect(() => {
    const fetchOrders = async () => {
      if (!uniqueDeviceId) {
        console.log('No device ID found');
        setLoading(false);
        return;
      }

      const ordersRef = ref(database, 'tls/Orders');
      try {
        const snapshot = await get(ordersRef);
        if (snapshot.exists()) {
          const allOrders = snapshot.val();
          const userOrders = Object.entries(allOrders)
            .filter(([_, order]) => order.userid === uniqueDeviceId)
            .map(([key, order]) => ({
              id: key,
              ...order
            }))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp, newest first

          setOrders(userOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "403": return "bg-yellow-200 text-yellow-800"; // Pending
      case "200": return "bg-green-200 text-green-800"; // Completed
      case "500": return "bg-red-200 text-red-800"; // Cancelled
      default: return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "403": return "Pending";
      case "200": return "Completed";
      case "500": return "Cancelled";
      default: return "Unknown";
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
        <p className="mb-4">You haven't placed any orders yet.</p>
        <Link href="/products" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold">Order #{order.orderId}</h2>
                <p className="text-gray-600">{new Date(order.timestamp).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Shipping Address:</h3>
              <p>{order.name}</p>
              <p>{order.address1}</p>
              <p>{order.address2}, {order.address3}</p>
              <p>Phone: {order.phone}</p>
              <p>Email: {order.email}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Order Items:</h3>
              <ul className="space-y-2">
                {order.data.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.productTitle} (x{item.quantity})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Total:</span>
                <span>₹{order.data.reduce((total, item) => total + (item.price * item.quantity), 0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrdersPage;