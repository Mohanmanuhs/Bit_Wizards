import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/images/logo.png'; // Replace with your hero image

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-50"
            src={heroImage}
            alt="College students at an event"
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Discover Campus Life Like Never Before
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            CampusPulse connects you with all the events, clubs, and activities happening across your university.
          </p>
          <div className="mt-10">
            {user ? (
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Events
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md shadow-sm text-white bg-transparent hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to stay connected
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: 'Event Discovery',
                  description: 'Find all upcoming events in one place with powerful filtering options.',
                  icon: '🎯',
                },
                {
                  name: 'Club Engagement',
                  description: 'Follow your favorite clubs and never miss their updates.',
                  icon: '🏛️',
                },
                {
                  name: 'Media Content',
                  description: 'Watch videos and listen to podcasts from campus organizations.',
                  icon: '🎥',
                },
                {
                  name: 'Interactive Features',
                  description: 'Like, comment, and engage with event content.',
                  icon: '💬',
                },
                {
                  name: 'Personalized Feed',
                  description: 'Get recommendations based on your interests.',
                  icon: '✨',
                },
                {
                  name: 'Club Management',
                  description: 'For admins - easily manage and promote your events.',
                  icon: '🛠️',
                },
              ].map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg text-2xl">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block">Start exploring campus life today.</span>
          </h2>
          <div className="mt-8 flex justify-center">
            {user ? (
              <Link
                to="/events"
                className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Browse Events
              </Link>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Sign up for free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-5 py-3 border border-white text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* For Clubs Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Are you a club organizer?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Register your club on CampusPulse to reach more students, manage your events, and grow your community.
              </p>
              <div className="mt-8 sm:flex">
                <div className="rounded-md shadow">
                  <Link
                    to={user ? "/register-club" : "/login"}
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Register Your Club
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    to="/clubs"
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    View All Clubs
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:px-0 lg:max-w-none">
                <div className="pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden sm:pt-96 sm:pb-20 lg:pt-64 lg:pb-14 bg-gradient-to-r from-indigo-500 to-indigo-800">
                  <div className="relative px-6 flex flex-col items-center justify-center h-full">
                    <div className="text-center text-white">
                      <h3 className="text-xl font-bold">Club Dashboard</h3>
                      <p className="mt-2">Manage all your events in one place</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};