'use client'

import React, { useState, useEffect } from 'react';
import { ref, get, push, set } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { database, db as firestore } from '../firebase';
import { useRouter } from 'next/navigation';

const BillingForm = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    district: '',
    postcode: '',
    phone: '',
    email: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const router = useRouter();

  function getOrCreateDeviceId() {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
        localStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    }
    return null;
  }

  const uniqueDeviceId = getOrCreateDeviceId();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!uniqueDeviceId) return;

      const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {
        setCartItems(snapshot.val());
      } else {
        console.log('No data available');
      }
    };

    fetchCartItems();
  }, [uniqueDeviceId]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const promises = cartItems.map(async (item) => {
        const productRef = doc(firestore, `site/tls/products/${item.id}`);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          return {
            ...item,
            title: productDoc.data().title,
            // Use the price from the cart instead of Firestore
            price: item.price,
            images: productDoc.data().images,
          };
        } else {
          console.log(`No product found for ID: ${item.id}`);
          return null;
        }
      });

      const results = await Promise.all(promises);
      setCartData(results.filter(item => item !== null));
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(total);
    };

    if (cartData.length > 0) {
      calculateTotalPrice();
    }
  }, [cartData]);

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (formData.name.trim() === '') {
      errors.name = 'Name is required';
    }

    // Street validation
    if (formData.street.trim() === '') {
      errors.street = 'Street address is required';
    }

    // City validation
    if (formData.city.trim() === '') {
      errors.city = 'City is required';
    }

    // District validation
    if (formData.district.trim() === '') {
      errors.district = 'District is required';
    }

    // Postcode validation
    if (formData.postcode.trim() !== '') {
      if (!/^\d{6}$/.test(formData.postcode)) {
        errors.postcode = 'Postcode must be a 6-digit number';
      }
    }

    // Phone validation
    if (formData.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      errors.phone = 'Phone number must contain only digits';
    }

    // Email validation
    if (formData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const checkFormValidity = () => {
      const isValid = validateForm();
      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const orderRef = ref(database, 'tls/Orders');
      const newOrderRef = push(orderRef);
      const orderId = newOrderRef.key;
      
      const orderData = {
        address1: formData.street,
        address2: formData.city,
        address3: formData.district,
        email: formData.email,
        name: formData.name,
        orderId: orderId,
        phone: formData.phone,
        status: "202",
        userid: uniqueDeviceId,
        timestamp : new Date().toISOString(),
        data: cartData.map(item => ({
          imageUrl: item.images && item.images.length > 0 ? item.images[0] : '',
          label: item.title,
          price: item.price,
          productLabelId: 0, // Assuming this is not available in your current data
          productTitle: item.title,
          productid: item.id,
          quantity: item.quantity
        }))
      };

      console.log(orderData.userid);

      await set(ref(database, `tls/Orders/${orderId}`), orderData);

      localStorage.setItem('recdata', JSON.stringify(orderData))
      // Clear the cart
      const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
      await set(cartRef, null);

      // Format the order details for WhatsApp message
      const message = `Hi, an order for Kai's Lifestyle Studios\n` +
                      `Order ID: ${orderId}\n` + `and I would like to continue the payment to deliver my order.`

      // Encode the message to be URL-safe
      const encodedMessage = encodeURIComponent(message);

      const makeCall = async () => {
        const accountSid = process.env.NEXT_PUBLIC_TWILIO_AC_SID;
        const authToken = process.env.NEXT_PUBLIC_TWILIO_AC_TOKEN;
        const twilioPhoneNumber = process.env.NEXT_PUBLIC_TWILIO_PH_NO;
        const recipientPhoneNumber = process.env.NEXT_PUBLIC_TWILIO_RECEIVER_NO;

        const twiml = `
          <Response>
            <Say>Hello! You Have Received an Order From Kays Lifestyle , Please Check on Admin Panel to Confirm Order.</Say>
            <Pause length="1"/>
            <Say> I Repeat</Say>
            <Pause length="1"/>
            <Say>You have received an order from kays lifestyle, check the admin panel to confirm the order</Say>
            <Pause length="2"/>
            <Say>Thank You</Say>
          </Response>
        `;

        const apiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`;

        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + btoa(`${accountSid}:${authToken}`),
            },
            body: new URLSearchParams({
              From: twilioPhoneNumber,
              To: recipientPhoneNumber,
              Twiml: twiml,
            }),
          });

        } catch (error) {
          console.error(error);
        }
      };

      makeCall();

      window.location.href="/invoice.html"
      router.push('/products');
      
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className='flex justify-center items-center w-full px-4 sm:px-6 lg:px-8 mt-10'>
      <div className="flex flex-col lg:flex-row gap-8 py-6 mt-14 mb-8 w-full max-w-6xl">
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b">Billing details</h2>
          <form className="space-y-4" onSubmit={handlePlaceOrder}>
           <div>
              <label htmlFor="name" className="block mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className={`w-full p-2 border rounded ${formErrors.name ? '' : ''}`}
                required
                value={formData.name}
                onChange={handleInputChange}
              />
              {formErrors.name && <p className="text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="street" className="block mb-1">
                Street address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="street"
                placeholder="House number and street name"
                className={`w-full p-2 border rounded ${formErrors.street ? '' : ''}`}
                required
                value={formData.street}
                onChange={handleInputChange}
              />
              {formErrors.street && <p className="text-sm mt-1">{formErrors.street}</p>}
            </div>
            <div>
              <label htmlFor="city" className="block mb-1">
                Town / City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                className={`w-full p-2 border rounded ${formErrors.city ? '' : ''}`}
                required
                value={formData.city}
                onChange={handleInputChange}
              />
              {formErrors.city && <p className="text-sm mt-1">{formErrors.city}</p>}
            </div>
            <div>
              <label htmlFor="district" className="block mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="district"
                className={`w-full p-2 border rounded ${formErrors.district ? '' : ''}`}
                required
                value={formData.district}
                onChange={handleInputChange}
              />
              {formErrors.district && <p className="text-sm mt-1">{formErrors.district}</p>}
            </div>
            <div>
              <label htmlFor="postcode" className="block mb-1">
                Postcode / ZIP (optional)
              </label>
              <input
                type="number"
                id="postcode"
                className={`w-full p-2 border rounded ${formErrors.postcode ? '' : ''}`}
                value={formData.postcode}
                onChange={handleInputChange}
              />
              {formErrors.postcode && <p className="text-sm mt-1">{formErrors.postcode}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="phone"
                className={`w-full p-2 border rounded ${formErrors.phone ? '' : ''}`}
                required
                value={formData.phone}
                onChange={handleInputChange}
              />
              {formErrors.phone && <p className="text-sm mt-1">{formErrors.phone}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className={`w-full p-2 border rounded ${formErrors.email ? '' : ''}`}
                required
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && <p className="text-sm mt-1">{formErrors.email}</p>}
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
          <div className="border p-4 rounded">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b">Your order</h2>
            <div className="space-y-2 mb-4">
              {cartData.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <span className="text-sm">
                    {item.title} 
                    <br/>
                    <span className="text-gray-500">
                      Qty: {item.quantity} x ₹{item.price}
                    </span>
                  </span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mb-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
            <button 
              className={`w-full py-2 px-4 rounded transition-colors ${
                isFormValid 
                  ? "bg-gray-800 text-white hover:bg-gray-700" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handlePlaceOrder}
              disabled={!isFormValid}
            >
              PLACE ORDER
            </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BillingForm;