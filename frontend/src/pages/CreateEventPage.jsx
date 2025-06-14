import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true
  });

const allowedTags = [
  "technical", "cultural", "sports", "social", "educational",
  "music", "talk", "competition", "workshop", "seminar", "general"
];

const CreateEventPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'event',
    tags: [], // tags should be an array
    mediaUrl: '',
    eventDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventData = {
        ...newEvent,
      };

      await api.post(`${apiUrl}/api/events`, eventData, {
        headers: {
          Authorization: `Bearer ${user.token}`, // make sure token is available
          "Content-Type": "application/json",
        },
      });

      toast.success('Event created successfully!');
      navigate('/events');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <button
              onClick={() => navigate('/events')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateEvent} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title*</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows="5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type*</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700">Event Date</label>
                <input
                  type="datetime-local"
                  value={newEvent.eventDate}
                  onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Tags (select multiple)</label>
              <select
                multiple
                value={newEvent.tags}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, option => option.value);
                  setNewEvent({ ...newEvent, tags: selected });
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 h-40"
              >
                {allowedTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Command (Mac) to select multiple tags.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Media URL</label>
              <input
                type="url"
                value={newEvent.mediaUrl}
                onChange={(e) => setNewEvent({ ...newEvent, mediaUrl: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="https://example.com/media.mp4"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={isSubmitting || !newEvent.title || !newEvent.type}
              >
                {isSubmitting ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
