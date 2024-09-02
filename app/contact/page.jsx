'use client'

import React, { useState } from 'react';
import { FaHome, FaPhone, FaEnvelope } from 'react-icons/fa';
import emailjs from 'emailjs-com';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send(
      process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID, 
      process.env.NEXT_PUBLIC_EMAIL_TMP_ID, 
      {
        to_email: 'mail@kaisonline.com',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message
      },
      process.env.NEXT_PUBLIC_EMAIL_USER_ID 
    )
    .then((response) => {
      console.log('Email sent successfully:', response);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, (error) => {
      console.error('Failed to send email:', error);
      alert('Failed to send message. Please try again.');
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center my-12">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <FaHome className="text-4xl text-gray-800 mb-4" />
          <h2 className="text-xl font-bold mb-2">Address</h2>
          <p className="text-gray-600 text-center">
            Kais the Studio<br />
            Pullatt Arcade, Kariparambu<br />
            Tirurangadi PO, Malappuram Dist,<br />
            Kerala - 676306
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <FaPhone className="text-4xl text-gray-800 mb-4" />
          <h2 className="text-xl font-bold mb-2">Phone No</h2>
          <p className="text-gray-600 text-center">
            +91 8089 71 8880<br />
            0494 2955558
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <FaEnvelope className="text-4xl text-gray-800 mb-4" />
          <h2 className="text-xl font-bold mb-2">Email</h2>
          <p className="text-gray-600 text-center">mail@kaisonline.com</p>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Send us a message</h2>
      <form className="w-full max-w-lg space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          required
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg font-semibold hover:bg-gray-600 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;