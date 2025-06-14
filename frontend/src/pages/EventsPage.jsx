import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'event',
    tags: [],
    mediaUrl: '',
    eventDate: '',
  });

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

  // Handle create event
  const handleCreateEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        createdBy: user.clubId || user._id,
        tags: newEvent.tags.split(',').map(tag => tag.trim()),
      };
      
      const { data } = await axios.post(`${apiUrl}/api/events`, eventData);
      setEvents([data, ...events]);
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        description: '',
        type: 'event',
        tags: [],
        mediaUrl: '',
        eventDate: '',
      });
      toast.success('Event created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

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
    switch (event.type) {
      case 'podcast':
        return (
          <div className="relative pt-4">
            <audio controls className="w-full">
              <source src={event.mediaUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'video':
        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe 
              src={event.mediaUrl} 
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={event.title}
            />
          </div>
        );
      default:
        return (
          <img
            src={event.mediaUrl || `https://source.unsplash.com/random/600x400/?${event.type},${event.tags?.[0] || 'event'}`}
            alt={event.title}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = `https://source.unsplash.com/random/600x400/?${event.type},${event.tags?.[0] || 'event'}`;
            }}
          />
        );
    }
  };

  if (loading) return <div className="text-center py-20">Loading events...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Event</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title*</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  rows="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Type*</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                >
                  <option value="announcement">Announcement</option>
                  <option value="event">Event</option>
                  <option value="podcast">Podcast</option>
                  <option value="video">Video</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newEvent.tags}
                  onChange={(e) => setNewEvent({...newEvent, tags: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="technical, workshop, seminar"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Media URL
                </label>
                <input
                  type="url"
                  value={newEvent.mediaUrl}
                  onChange={(e) => setNewEvent({...newEvent, mediaUrl: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="https://example.com/media.mp4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Event Date</label>
                <input
                  type="datetime-local"
                  value={newEvent.eventDate}
                  onChange={(e) => setNewEvent({...newEvent, eventDate: e.target.value})}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={!newEvent.title || !newEvent.type}
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap"
                onClick={() => setShowCreateModal(true)}
              >
                + Add New Event
              </button>
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
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                onClick={() => setShowCreateModal(true)}
              >
                Create Your First Event
              </button>
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
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 text-sm font-medium">
                            {event.createdBy.name?.charAt(0) || 'C'}
                          </span>
                        </div>
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
                  {(user?.role === 'club_admin' || user?._id === event.createdBy?._id) && (
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
                  )}
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