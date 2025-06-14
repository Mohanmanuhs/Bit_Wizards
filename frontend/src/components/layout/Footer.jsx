import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo2.jpg';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-indigo-600 p-2 rounded-lg mr-2">
                <img src={logo} alt="CampusPulse" className="h-6 w-6" />
              </span>
              CampusPulse
            </h3>
            <p className="text-gray-400 mb-4">
              Connecting students with campus events, clubs, and activities. Your one-stop platform for all college happenings.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/clubs" className="text-gray-400 hover:text-white transition">
                  Clubs
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <FaEnvelope className="mt-1 mr-2 text-indigo-400" />
                <span className="text-gray-400">codedil123@gmail.com</span>
              </div>
              <p className="text-gray-400">
                University Visvesvaraya College of Engineering (UVCE)<br />
                K.R. Circle, Dr. Ambedkar Veedhi,<br />
                Bangalore – 560001,<br />
                Karnataka, India
              </p>
              <button className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md transition">
                Get in Touch
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CampusPulse. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-gray-500 hover:text-white text-sm transition">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};