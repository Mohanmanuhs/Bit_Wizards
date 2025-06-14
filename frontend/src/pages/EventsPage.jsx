import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

const EventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [clubFilter, setClubFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API with proper error handling
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = {};
        if (filter !== 'all') params.type = filter;
        if (clubFilter) params.clubId = clubFilter;

        const { data } = await axios.get(`${apiUrl}/api/events`, { params });

        // Ensure data is always an array
        if (!Array.isArray(data)) {
          console.error('Expected array but received:', data);
          setEvents([]);
        } else {
          setEvents(data);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.response?.data?.message || 'Failed to fetch events');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [filter, clubFilter]);

  // Handle delete event
  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`${apiUrl}/api/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
      toast.success('Event deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  // Render media based on event type
  const renderMedia = (event) => {
  // Helper function to transform YouTube URLs to embed format
  const getEmbedUrl = (url) => {
    if (!url) return null;

    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }

    return url;
  };

  // Default image URL based on event type
  const defaultImageUrl = `https://source.unsplash.com/random/600x400/?${event.type},${event.tags?.[0] || 'event'}`;

  switch (event.type) {
    case 'announcement':
      // For announcements, always show an image
      return (
        <img
          src={event.mediaUrl || defaultImageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = defaultImageUrl;
            e.target.onerror = null;
          }}
        />
      );

    case 'event':
      // For events, try to show video if URL is provided, otherwise show image
      const eventEmbedUrl = getEmbedUrl(event.mediaUrl);
      if (eventEmbedUrl) {
        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={eventEmbedUrl}
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={event.title}
            />
          </div>
        );
      }
      return (
        <img
          src={event.mediaUrl || defaultImageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = defaultImageUrl;
            e.target.onerror = null;
          }}
        />
      );

    case 'podcast':
      // For podcasts, show audio player if URL is provided, otherwise show image
      if (event.mediaUrl) {
        return (
          <div className="relative pt-4">
            <audio controls className="w-full">
              <source src={event.mediaUrl} type="audio/mpeg" />
              <source src={event.mediaUrl} type="audio/ogg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      }
      return (
        <img
          src={defaultImageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = defaultImageUrl;
            e.target.onerror = null;
          }}
        />
      );

    case 'video':
      // For videos, always try to show video player
      const videoEmbedUrl = getEmbedUrl(event.mediaUrl);
      return videoEmbedUrl ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={videoEmbedUrl}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={event.title}
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
          <span className="text-gray-500">
            {event.mediaUrl ? 'Invalid video URL' : 'No video provided'}
          </span>
        </div>
      );

    default:
      // Fallback for any unexpected types
      return (
        <img
          src={defaultImageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = defaultImageUrl;
            e.target.onerror = null;
          }}
        />
      );
  }
};

  if (loading) return <div className="text-center py-20">Loading events...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events & Announcements</h1>
            <p className="mt-2 text-gray-600">
              Stay updated with the latest happenings
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {user?.role === 'club_admin' && (
              <Link
                to="/events/create"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap text-center"
              >
                + Add New Event
              </Link>
            )}

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="announcement">Announcements</option>
              <option value="event">Events</option>
              <option value="podcast">Podcasts</option>
              <option value="video">Videos</option>
            </select>

            {user?.role === 'admin' && (
              <input
                type="text"
                placeholder="Filter by Club ID"
                value={clubFilter}
                onChange={(e) => setClubFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
          </div>
        </div>

        {/* Events Grid */}
        {!events || !Array.isArray(events) ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-red-500">No events data available</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <p className="text-gray-500">No events found matching your criteria</p>
            {user?.role === 'club_admin' && (
              <Link
                to="/events/create"
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block"
              >
                Create Your First Event
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative flex flex-col"
              >
                {/* Media Section */}
                <div className="relative">
                  {renderMedia(event)}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full capitalize">
                      {event.type}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-900">{event.title}</h2>
                    {event.eventDate && (
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {new Date(event.eventDate).toLocaleDateString()}
                        {event.eventDate.includes('T') && (
                          <span className="block text-xs">
                            {new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-gray-600 line-clamp-3">
                    {event.description}
                  </p>

                  {/* Tags */}
                  {event.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Created By */}
                  {event.createdBy && (
                    <div className="mt-4 flex items-center">
                      <div className="flex-shrink-0">
                        {event.createdBy.logoUrl ? (
                          <img
                            src={event.createdBy.logoUrl}
                            alt={event.createdBy.name}
                            className="w-8 h-8 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40';
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 text-sm font-medium">
                              {event.createdBy.name?.charAt(0) || 'C'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">
                          {event.createdBy.name || 'Club'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Posted {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {/* {(user?.role === 'club_admin' || user?._id === event.createdBy?._id) && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/events/edit/${event._id}`)}
                        className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )} */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;