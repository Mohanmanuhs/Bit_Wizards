import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Detect scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check user's preferred color scheme
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const themeColors = {
    light: {
      bg: 'bg-white/80 backdrop-blur-sm',
      text: 'text-gray-800',
      hoverText: 'text-blue-600',
      activeText: 'text-blue-700',
      border: 'border-gray-200',
      button: 'bg-blue-600 hover:bg-blue-700',
      mobileBg: 'bg-white',
      dropdownBg: 'bg-white',
      dropdownText: 'text-gray-700',
      dropdownHover: 'bg-gray-100'
    },
    dark: {
      bg: 'bg-gray-900/80 backdrop-blur-sm',
      text: 'text-gray-100',
      hoverText: 'text-blue-400',
      activeText: 'text-blue-300',
      border: 'border-gray-700',
      button: 'bg-blue-600 hover:bg-blue-500',
      mobileBg: 'bg-gray-800',
      dropdownBg: 'bg-gray-800',
      dropdownText: 'text-gray-200',
      dropdownHover: 'bg-gray-700'
    }
  };

  const colors = darkMode ? themeColors.dark : themeColors.light;

  return (
    <nav className={`${colors.bg} ${colors.border} ${scrolled ? 'border-b' : ''} sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img className="h-8 w-auto" src={logo} alt="CampusPulse" />
              <span className={`ml-2 text-xl font-semibold ${colors.hoverText}`}>CampusPulse</span>
            </Link>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              {[
                { path: '/', icon: <FaHome className="mr-1.5" />, label: 'Home' },
                { path: '/events', icon: <FaCalendarAlt className="mr-1.5" />, label: 'Events' },
                { path: '/clubs', icon: <FaUsers className="mr-1.5" />, label: 'Clubs' }
              ].map(({ path, icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) =>
                    `px-1 pt-1 text-sm font-medium ${colors.text} ${
                      isActive
                        ? `${colors.activeText} border-b-2 ${colors.hoverText}`
                        : `hover:${colors.hoverText}`
                    }`
                  }
                >
                  <div className="flex items-center">{icon} {label}</div>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${colors.text} hover:${colors.hoverText}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                {['club_admin', 'super_admin'].includes(user.role) && (
                  <Link
                    to="/create-event"
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white ${colors.button} transition-colors`}
                  >
                    <FaPlus className="mr-1.5" /> Create
                  </Link>
                )}

                {/* Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    onMouseEnter={() => setDropdownOpen(true)}
                    className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                  >
                    <span className={`text-sm font-medium ${colors.text}`}>{user.name}</span>
                    <FaUserCircle className={`h-8 w-8 ${colors.hoverText} hover:${colors.activeText}`} />
                  </button>

                  {dropdownOpen && (
                    <div
                      className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${colors.dropdownBg} ring-1 ring-black ring-opacity-5`}
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 text-sm ${colors.dropdownText} hover:${colors.dropdownHover}`}
                          onClick={() => setDropdownOpen(false)}
                        >
                          Your Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${colors.dropdownText} hover:${colors.dropdownHover}`}
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${colors.hoverText} hover:${colors.activeText} transition-colors`}
                >
                  <FaSignInAlt className="mr-1.5" /> Login
                </Link>
                <Link
                  to="/Register"
                  className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white ${colors.button} transition-colors`}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${colors.text} hover:${colors.hoverText}`}
            >
              {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} ${colors.mobileBg}`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={toggleTheme}
            className={`w-full text-left px-4 py-2 flex items-center ${colors.text}`}
          >
            {darkMode ? <><FaSun className="mr-3 h-5 w-5" /> Light Mode</> : <><FaMoon className="mr-3 h-5 w-5" /> Dark Mode</>}
          </button>

          {[
            { to: '/', label: 'Home', icon: <FaHome /> },
            { to: '/events', label: 'Events', icon: <FaCalendarAlt /> },
            { to: '/clubs', label: 'Clubs', icon: <FaUsers /> }
          ].map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 text-base font-medium ${
                  isActive
                    ? `${colors.activeText} bg-opacity-10 ${colors.button.replace('hover:', '')}`
                    : `${colors.text} hover:${colors.dropdownHover}`
                }`
              }
            >
              <div className="flex items-center">{icon} <span className="ml-3">{label}</span></div>
            </NavLink>
          ))}

          {user && ['club_admin', 'super_admin'].includes(user.role) && (
            <NavLink
              to="/create-event"
              onClick={() => setMobileMenuOpen(false)}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
            >
              <div className="flex items-center"><FaPlus className="mr-3" /> Create Event</div>
            </NavLink>
          )}

          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
              >
                <div className="flex items-center"><FaUserCircle className="mr-3" /> Profile</div>
              </NavLink>
              <button
                onClick={handleLogout}
                className={`block w-full text-left pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
              >
                <div className="flex items-center hover:bg-black hover:cursor-pointer"><FaSignOutAlt className="mr-3" /> Sign out</div>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
              >
                <div className="flex items-center"><FaSignInAlt className="mr-3" /> Login</div>
              </NavLink>
              <NavLink
                to="/Register"
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium text-white ${colors.button}`}
              >
                <div className="flex items-center">Register</div>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
