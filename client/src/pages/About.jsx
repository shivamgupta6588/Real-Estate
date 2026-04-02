import { Link } from 'react-router-dom';
import { FaHome, FaShieldAlt, FaUsers, FaStar, FaHandshake, FaSearch } from 'react-icons/fa';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About <span className="text-blue-400">ShivamEstate</span></h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Your trusted partner for discovering, buying, and renting properties. We simplify real estate for everyone.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to ShivamEstate! We are your premier destination for all things related to real estate. Whether you&apos;re buying, selling, or exploring, our platform is designed to meet your every need.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our mission is to simplify the real estate journey. We provide a comprehensive and user-friendly experience, helping you find your dream home, showcase your property, or get valuable insights into the market.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe everyone deserves a place they can truly call home, and we&apos;re committed to making that journey as seamless as possible.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              {icon:<FaHome/>, label:"Properties", value:"500+", color:"text-blue-600"},
              {icon:<FaUsers/>, label:"Happy Clients", value:"200+", color:"text-green-600"},
              {icon:<FaStar/>, label:"5-Star Reviews", value:"150+", color:"text-yellow-500"},
              {icon:<FaHandshake/>, label:"Deals Closed", value:"100+", color:"text-purple-600"},
            ].map((stat)=>(
              <div key={stat.label} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100">
                <span className={`text-3xl ${stat.color} flex justify-center mb-2`}>{stat.icon}</span>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">What We Offer</h2>
          <p className="text-gray-500 text-center mb-10 text-sm">Everything you need to find your perfect property</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {icon:<FaSearch className="text-2xl"/>, title:"Smart Search", desc:"Advanced filters to narrow down properties by type, price, amenities, and more.", color:"bg-blue-50 text-blue-600"},
              {icon:<FaShieldAlt className="text-2xl"/>, title:"Verified Listings", desc:"Every listing is reviewed to ensure accuracy and reliability for our users.", color:"bg-green-50 text-green-600"},
              {icon:<FaHandshake className="text-2xl"/>, title:"Direct Connect", desc:"Get in touch with landlords and owners directly through our platform.", color:"bg-purple-50 text-purple-600"},
            ].map((feature)=>(
              <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-700 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">Join thousands of users who have already found their perfect home through ShivamEstate.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-sm">
            Browse Properties
          </Link>
          <Link to="/sign-up" className="border border-slate-300 text-slate-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors text-sm">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;

