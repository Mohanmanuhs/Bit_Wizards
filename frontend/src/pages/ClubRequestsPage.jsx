import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ClubRequestsPage = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("notVerified");

  // Fetch clubs from backend
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const { data } = await axios.get("/api/clubs");
        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setClubs(data);
        } else {
          console.error("Expected array but received:", data);
          setClubs([]); // Set to empty array if response isn't an array
          toast.error("Invalid clubs data format");
        }
      } catch (err) {
        console.error("Error fetching clubs:", err);
        toast.error(err.response?.data?.message || "Failed to fetch clubs");
        setClubs([]); // Ensure clubs is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Handle club verification
  const handleVerifyClub = async (clubId) => {
    try {
      const { data } = await axios.put(`/api/clubs/${clubId}`, { isAproved: true });
      setClubs(prevClubs => 
        prevClubs.map(club => club._id === clubId ? data : club)
      );
      toast.success("Club verified successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify club");
    }
  };

  // Handle club rejection
  const handleRejectClub = async (clubId) => {
    try {
      await axios.delete(`/api/clubs/${clubId}`);
      setClubs(prevClubs => 
        prevClubs.filter(club => club._id !== clubId)
      );
      toast.success("Club rejected and deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject club");
    }
  };

  // Filter clubs based on verification status
  const filteredClubs = Array.isArray(clubs) ? clubs.filter((club) => {
    if (filter === "verified") return club.isAproved;
    if (filter === "notVerified") return !club.isAproved;
    return true;
  }) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-5xl mx-auto text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading club requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">📋 Club Join Requests</h1>
          <select
            className="border border-gray-300 rounded-md px-4 py-2 bg-white text-gray-700 shadow-sm hover:shadow-md transition"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="verified">Verified</option>
            <option value="notVerified">Not Verified</option>
          </select>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-3 font-semibold text-white bg-indigo-600 px-8 py-4 text-lg">
            <div>Club Name</div>
            <div>Club ID</div>
            <div className="text-center">Actions</div>
          </div>

          {filteredClubs.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No {filter === "verified" ? "verified" : "pending"} clubs found.
            </div>
          ) : (
            filteredClubs.map((club) => (
              <div
                key={club._id}
                className="grid grid-cols-3 items-center px-8 py-5 border-t border-gray-200 hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center">
                  {club.logoUrl && (
                    <img 
                      src={club.logoUrl} 
                      alt={club.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                    />
                  )}
                  <div>
                    <div className="text-gray-800 font-medium">{club.name}</div>
                    <div className="text-gray-500 text-sm line-clamp-1">{club.description}</div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">{club._id}</div>
                <div className="flex justify-center gap-8">
                  {club.isAproved ? (
                    <button
                      onClick={() => handleRejectClub(club._id)}
                      className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                      title="Delete Club"
                    >
                      <Trash2 className="w-9 h-9" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleVerifyClub(club._id)}
                        className="text-green-600 hover:text-green-800 transition transform hover:scale-110"
                        title="Approve Club"
                      >
                        <CheckCircle className="w-9 h-9" />
                      </button>
                      <button
                        onClick={() => handleRejectClub(club._id)}
                        className="text-red-600 hover:text-red-800 transition transform hover:scale-110"
                        title="Reject Club"
                      >
                        <XCircle className="w-9 h-9" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubRequestsPage;