import { FaHome, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactUs = () => {
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
      <form className="w-full max-w-lg space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <input
          type="text"
          placeholder="Subject"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
        <textarea
          placeholder="Message"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
          rows="4"
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

