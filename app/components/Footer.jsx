import Link from 'next/link';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';
import { BsClock } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 mt-auto">
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-4 md:mb-0">
            <Image 
              src="/logo.png" 
              alt="Brand Logo" 
              width={80} 
              height={80} 
              className="invert brightness-0 mb-4"
            />
            <p className="max-w-md">Discover elegance at Kais</p>
            <div className="flex mt-4 gap-4">
              <Link target="_blank" href="https://www.facebook.com/KaisTheStudio/" className=" text-2xl hover:text-blue-500">
                <FaFacebook />
              </Link>
              <Link target="_blank" href="https://www.instagram.com/kaisthestudio?igsh=MXJnZ3pwMDZqNzdhZQ%3D%3D" className="text-2xl hover:text-pink-500">
                <FaInstagram />
              </Link>
              <Link href="mailto:mail@kaisonline.com" className="text-2xl hover:text-green-600">
                <MdEmail />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="flex items-center"><FaWhatsapp className="mr-2" />+91 8089 71 8880</p>
            <p className="flex items-center"><BsClock className="mr-2" /> Mon-Sat, 10 AM to 6 PM</p>
            <p className="flex items-center"><MdEmail className="mr-2" /> mail@kaisonline.com</p>
            <p className="flex items-center"><MdLocationOn className="mr-2" />Kais the Studio Pullatt Arcade,</p>
            <p className="flex items-center">Kariparambu Tirurangadi PO</p>
            <p className="flex items-center">Malappuram Dist, Kerala - 676306</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <nav className="flex flex-wrap justify-center mb-4">
            <Link href="/about" className="mx-2 hover:underline">About Us</Link>
            <Link href="/policy#privacy-policy" className="mx-2 hover:underline">Privacy Policy</Link>
            <Link href="/policy#return-policy" className="mx-2 hover:underline">Return Policy</Link>
            <Link href="/policy#shipping-policy" className="mx-2 hover:underline">Shipping Policy</Link>
            <Link href="/policy#terms-conditions" className="mx-2 hover:underline">Terms and Conditions</Link>
          </nav>

          <div className="text-sm text-center mb-4">
            <h4 className="font-semibold mb-2">Most searched on store</h4>
            <div className="flex flex-wrap justify-center">
              {['Stationary', 'School', 'Kitchenware', 'Home Decor'].map((category, index) => (
                <Link key={index} href={`/search/${category.toLowerCase()}`} className="mx-2 hover:underline">
                  {category}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-3">
            © 2024 <Link href={"https://azoraads.com"}><span className='mx-1 text-blue-600 cursor-pointer'>Azora Ads.</span></Link> All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;