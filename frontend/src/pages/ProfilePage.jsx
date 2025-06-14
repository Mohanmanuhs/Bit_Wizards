// src/pages/ProfilePage.jsx
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animated profile completion meter
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(75); // Example profile completion percentage
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Generate profile image with animation
  const getAvatarUrl = (name) => {
    const colors = ['FFAD08', 'EDD382', 'FC9E4F', 'FF521B', '0CCE6B'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=128&rounded=true&bold=true`;
  };

  // Floating bubbles background component
  const FloatingBubbles = () => {
    const bubbles = Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 30 + 10;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-100 opacity-20"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      );
    });
    return <div className="fixed inset-0 overflow-hidden pointer-events-none">{bubbles}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <FloatingBubbles />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Animated Profile Header */}
          <motion.div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 pb-16 relative"
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="absolute -bottom-12 left-6"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={getAvatarUrl(user?.name)} 
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
            </motion.div>
            <div className="pt-8 pl-32">
              <motion.h1 
                className="text-2xl font-bold text-white"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 5 }}
              >
                {user?.name}
              </motion.h1>
              <p className="text-indigo-100">{user?.email}</p>
            </div>
          </motion.div>

          {/* Profile Details with animated progress bar */}
          <div className="px-6 pt-16 pb-8">
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Profile Completion</span>
                <span className="text-sm font-medium text-gray-500">{progress}%</span>
              </div>
              <motion.div 
                className="w-full bg-gray-200 rounded-full h-2.5"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"></div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Account Type', value: user?.role || 'Student', icon: '👤' },
                { label: 'Club ID', value: user?.clubId || 'N/A', icon: '🏢' },
                { label: 'Member Since', value: new Date(user?.createdAt).toLocaleDateString(), icon: '📅' },
                { label: 'Status', value: 'Active', icon: '✅' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-indigo-200 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center">
                    <motion.span 
                      className="text-2xl mr-3"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 5 }}
                    >
                      {item.icon}
                    </motion.span>
                    <div>
                      <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{item.label}</h2>
                      <p className="mt-1 text-lg font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <motion.button
                onClick={logout}
                className="px-6 py-2 rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-red-500 to-pink-600 focus:outline-none"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0px 5px 15px rgba(239, 68, 68, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <motion.span 
                  animate={{ x: isHovered ? [0, 5, -5, 0] : 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center"
                >
                  Sign Out
                  <motion.span
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -20 }}
                    className="ml-2"
                  >
                    👋
                  </motion.span>
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};