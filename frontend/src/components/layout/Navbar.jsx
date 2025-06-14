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
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Theme-based colors
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
          {/* Logo and main navigation */}
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
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => 
                  `px-1 pt-1 text-sm font-medium ${colors.text} ${
                    isActive 
                      ? `${colors.activeText} border-b-2 ${colors.hoverText}`
                      : `hover:${colors.hoverText}`
                  }`
                }
              >
                <div className="flex items-center">
                  <FaHome className="mr-1.5" /> Home
                </div>
              </NavLink>
              
              <NavLink 
                to="/events" 
                className={({ isActive }) => 
                  `px-1 pt-1 text-sm font-medium ${colors.text} ${
                    isActive 
                      ? `${colors.activeText} border-b-2 ${colors.hoverText}`
                      : `hover:${colors.hoverText}`
                  }`
                }
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-1.5" /> Events
                </div>
              </NavLink>
              
              <NavLink 
                to="/clubs" 
                className={({ isActive }) => 
                  `px-1 pt-1 text-sm font-medium ${colors.text} ${
                    isActive 
                      ? `${colors.activeText} border-b-2 ${colors.hoverText}`
                      : `hover:${colors.hoverText}`
                  }`
                }
              >
                <div className="flex items-center">
                  <FaUsers className="mr-1.5" /> Clubs
                </div>
              </NavLink>
            </div>
          </div>

          {/* Right side - User controls */}
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
                
                <div className="relative ml-3">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${colors.text}`}>{user.name}</span>
                    <div className="relative group">
                      <FaUserCircle className={`h-8 w-8 ${colors.hoverText} hover:${colors.activeText} cursor-pointer`} />
                      <div className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${colors.dropdownBg} ring-1 ring-black ring-opacity-5 invisible group-hover:visible`}>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className={`block px-4 py-2 text-sm ${colors.dropdownText} hover:${colors.dropdownHover}`}
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
                    </div>
                  </div>
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
                  to="/signup"
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
              className={`inline-flex items-center justify-center p-2 rounded-md ${colors.text} hover:${colors.hoverText} hover:bg-opacity-10 focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <FaTimes className="block h-6 w-6" />
              ) : (
                <FaBars className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} ${colors.mobileBg}`}>
        <div className="pt-2 pb-3 space-y-1">
          <button
            onClick={toggleTheme}
            className={`w-full text-left px-4 py-2 flex items-center ${colors.text}`}
          >
            {darkMode ? (
              <>
                <FaSun className="mr-3 h-5 w-5" /> Light Mode
              </>
            ) : (
              <>
                <FaMoon className="mr-3 h-5 w-5" /> Dark Mode
              </>
            )}
          </button>
          
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 text-base font-medium ${
                isActive 
                  ? `${colors.activeText} bg-opacity-10 ${colors.button.replace('hover:', '')}`
                  : `${colors.text} hover:${colors.dropdownHover}`
              }`
            }
          >
            <div className="flex items-center">
              <FaHome className="mr-3" /> Home
            </div>
          </NavLink>
          
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 text-base font-medium ${
                isActive 
                  ? `${colors.activeText} bg-opacity-10 ${colors.button.replace('hover:', '')}`
                  : `${colors.text} hover:${colors.dropdownHover}`
              }`
            }
          >
            <div className="flex items-center">
              <FaCalendarAlt className="mr-3" /> Events
            </div>
          </NavLink>
          
          <NavLink
            to="/clubs"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `block pl-3 pr-4 py-2 text-base font-medium ${
                isActive 
                  ? `${colors.activeText} bg-opacity-10 ${colors.button.replace('hover:', '')}`
                  : `${colors.text} hover:${colors.dropdownHover}`
              }`
            }
          >
            <div className="flex items-center">
              <FaUsers className="mr-3" /> Clubs
            </div>
          </NavLink>
          
          {user && ['club_admin', 'super_admin'].includes(user.role) && (
            <NavLink
              to="/create-event"
              onClick={() => setMobileMenuOpen(false)}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
            >
              <div className="flex items-center">
                <FaPlus className="mr-3" /> Create Event
              </div>
            </NavLink>
          )}
          
          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
              >
                <div className="flex items-center">
                  <FaUserCircle className="mr-3" /> Profile
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className={`block w-full text-left pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
              >
                <div className="flex items-center">
                  <FaSignOutAlt className="mr-3" /> Sign out
                </div>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium ${colors.text} hover:${colors.dropdownHover}`}
              >
                <div className="flex items-center">
                  <FaSignInAlt className="mr-3" /> Login
                </div>
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className={`block pl-3 pr-4 py-2 text-base font-medium text-white ${colors.button}`}
              >
                <div className="flex items-center">
                  Register
                </div>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};