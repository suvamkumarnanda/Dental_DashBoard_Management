import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import teeth from '../assets/teeth.png'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenus = () => {
    setIsMenuOpen(false);
  };

 
  const handleLogin = () => {
    closeMenus();
    navigate('/login');
  };

  //  navigate to landing page 
  const handleSection = (Id) => {
    closeMenus();
    if (location.pathname !== '/') {
      navigate(`/#${Id}`);
    } else {
      const el = document.getElementById(Id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Contact link logic
  const handleContact = () => {
    closeMenus();
    if (location.pathname === '/') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };


  const handleDashboard = () => {
    closeMenus();
    if (user && user.role === 'admin') {
      navigate('/dashboard'); // Navigate to admin dashboard
    } else if (user && user.role === 'patient') {
      navigate('/patient-dashboard'); // Navigate to patient dashboard
    } else {
     
      navigate('/login'); 
    }
  };

  return (
    <header className="bg-pink-900 text-white shadow-md">
      <div className="container  items-center  mx-auto flex justify-between p-4">
       
        <div className="flex items-center">
          <img
            src={teeth} 
            alt="Dental Checkup"
            className="w-12 h-10 mr-2"
          />
          <Link to="/" className="text-2xl font-bold hover:text-blue-300">
            DentaSphere&trade;
          </Link>
        </div>

        
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

       
        <nav
          id="primary-navigation"
          className={`flex-col md:flex-row md:flex items-center md:space-x-6 absolute md:static bg-blue-700 md:bg-transparent w-full md:w-auto left-0 md:left-auto top-16 md:top-auto transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'flex' : 'hidden'
          }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-2 hover:text-blue-300 ${isActive ? 'font-semibold underline' : ''}`
            }
            onClick={closeMenus}
          >
            Home
          </NavLink>

          <button
            onClick={() => handleSection('services')}
            className="block px-4 py-2 hover:text-blue-300 cursor-pointer bg-transparent border-none"
          >
            Services
          </button>

          <button
            onClick={handleContact}
            className="block px-4 py-2 hover:text-blue-300 cursor-pointer bg-transparent border-none"
          >
            Contact
          </button>


          {user ? ( 
            <button
              onClick={handleDashboard}
              className={`block px-4 py-2 hover:text-blue-300 bg-transparent border-none cursor-pointer ${
                // Add active style if current path is a dashboard route
                (location.pathname === '/dashboard' || location.pathname === '/patient-dashboard')
                  ? 'font-semibold underline' : ''
              }`}
            >
              Dashboard
            </button>
          ) : (
           
             <button
              onClick={handleLogin} // redirects to login page
              className={`block px-4 py-2 hover:text-blue-300 bg-transparent border-none cursor-pointer ${
                location.pathname === '/dashboard' ? 'font-semibold underline' : ''
              }`}
            >
              Dashboard
            </button>
          )}

          
          {user && user.role === 'admin' && (
            <NavLink
              to="/patients"
              className={({ isActive }) =>
                `block px-4 py-2 hover:text-blue-300 ${isActive ? 'font-semibold underline' : ''}`
              }
              onClick={closeMenus}
            >
              Patients
            </NavLink>
          )}

         
          {!user && (
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `block px-4 py-2 hover:text-blue-300 ${isActive ? 'font-semibold underline' : ''}`
              }
              onClick={closeMenus}
            >
              Register
            </NavLink>
          )}


          {/* Login button or user info */}
          {user ? (
            <>
              <span className="block px-4 py-2">Hello, {user?.name }</span>
              <button
                onClick={() => {
                  logout();
                  closeMenus();
                }}
                className="block px-4 py-2 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLogin}
              className="block px-4 py-2 hover:text-blue-300 bg-transparent border-none cursor-pointer"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
