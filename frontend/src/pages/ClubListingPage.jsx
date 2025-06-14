import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const ClubListingPage = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true
  });

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const clubsResponse = await api.get('/api/clubs');
        let clubsData = clubsResponse.data.filter(club => club.isAproved === true);

        if (user) {
          const userResponse = await api.get(`/api/users/${user._id}`);
          const userFollowingClubs = userResponse.data.followingClubs || [];
          
          clubsData = clubsData.map(club => ({
            ...club,
            isFollowing: userFollowingClubs.includes(club._id),
            adminName: club.userId?.name || 'admin assigned'
          }));
        } else {
          clubsData = clubsData.map(club => ({
            ...club,
            isFollowing: false,
            adminName: club.userId?.name || 'No admin assigned'
          }));
        }

        setClubs(clubsData);
        setFilteredClubs(clubsData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch clubs');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, [user]);

  useEffect(() => {
    let results = clubs;
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(club => 
        club.name.toLowerCase().includes(searchLower) ||
        club.description?.toLowerCase().includes(searchLower) ||
        club.adminName?.toLowerCase().includes(searchLower)
      );
    }

    // Apply following status filter
    if (filter === 'following') {
      results = results.filter(club => club.isFollowing);
    } else if (filter === 'notFollowing') {
      results = results.filter(club => !club.isFollowing);
    }

    setFilteredClubs(results);
  }, [searchTerm, clubs, filter]);

  const handleFollowAction = async (clubId, isCurrentlyFollowing) => {
    if (!user) {
      alert('Please login to follow clubs');
      return;
    }

    try {
      const action = isCurrentlyFollowing ? 'unfollow' : 'follow';
      await api.post(`/api/users/${action}/${clubId}`);

      // Update UI state
      setClubs(clubs.map(club => 
        club._id === clubId 
          ? { ...club, isFollowing: !isCurrentlyFollowing } 
          : club
      ));
    } catch (err) {
      console.error('Follow error:', err);
      alert(err.response?.data?.message || `Failed to ${isCurrentlyFollowing ? 'unfollow' : 'follow'} club`);
    }
  };

  const handleAddClub = () => {
    navigate('/register-club');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-lg text-gray-700">Loading clubs...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-red-100 p-4">
          <div className="flex items-center justify-center text-red-500 mb-2">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center text-gray-800">Error</h2>
          <p className="text-center text-gray-600 mt-2">{error}</p>
        </div>
        <div className="p-4 bg-gray-50 text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Approved Clubs
          </h1>
          <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and join officially approved student organizations
          </p>
          
          {/* Add Club Button */}
          {user && (
            <div className="mt-6">
              <button
                onClick={handleAddClub}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center mx-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Register New Club
              </button>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              className="w-full pl-12 pr-4 py-4 border-0 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
              placeholder="Search clubs by name, description or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-4 border-0 rounded-xl shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
            >
              <option value="all">All Clubs</option>
              <option value="following">Following</option>
              <option value="notFollowing">Not Following</option>
            </select>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.length > 0 ? (
            filteredClubs.map((club) => (
              <div key={club._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                  {club.logoUrl ? (
                    <img
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                      src={club.logoUrl}
                      alt={club.name}
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <span className="text-4xl font-bold text-blue-600">{club.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {club.description || 'No description available.'}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Admin: {club.adminName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/clubs/${club._id}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View details →
                    </Link>
                    {user && (
                      <button
                        onClick={() => handleFollowAction(club._id, club.isFollowing)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          club.isFollowing
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {club.isFollowing ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="inline-block bg-white p-8 rounded-2xl shadow-lg">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {filter === 'following' ? 'No followed clubs found' : 
                   filter === 'notFollowing' ? 'You are following all clubs' : 
                   'No clubs found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'Try a different search' : 'No clubs match your current filters'}
                </p>
                {(searchTerm || filter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubListingPage;