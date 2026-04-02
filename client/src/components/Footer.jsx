import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHome } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <FaHome className="text-blue-400 text-2xl" />
            <span className="font-bold text-xl">
              <span className="text-blue-400">Shivam</span>
              <span className="text-blue-600">Estate</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your trusted partner for buying, renting, and discovering your perfect property. Simplifying real estate for everyone.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
            <li><Link to="/search" className="hover:text-blue-400 transition-colors">Search Properties</Link></li>
            <li><Link to="/search?type=rent" className="hover:text-blue-400 transition-colors">For Rent</Link></li>
            <li><Link to="/search?type=sale" className="hover:text-blue-400 transition-colors">For Sale</Link></li>
            <li><Link to="/search?offer=true" className="hover:text-blue-400 transition-colors">Special Offers</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link to="/sign-in" className="hover:text-blue-400 transition-colors">Sign In</Link></li>
            <li><Link to="/sign-up" className="hover:text-blue-400 transition-colors">Sign Up</Link></li>
            <li><Link to="/profile" className="hover:text-blue-400 transition-colors">My Profile</Link></li>
            <li><Link to="/create-list" className="hover:text-blue-400 transition-colors">List a Property</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Connect</h3>
          <div className="flex gap-4 mb-4">
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 transition-colors text-xl"><FaFacebook /></a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-sky-400 transition-colors text-xl"><FaTwitter /></a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-500 transition-colors text-xl"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-600 transition-colors text-xl"><FaLinkedin /></a>
          </div>
          <p className="text-sm text-gray-400">Have questions? We&apos;re here to help you find your perfect property.</p>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShivamEstate. All rights reserved.</p>
          <p>Built with ❤️ for seamless real estate discovery.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
