import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import "./App.css"
import {Navbar} from './components/layout/Navbar';
import {Footer} from './components/layout/Footer';

import
  {HomePage}
  // LoginPage,
  // SignupPage,
  // EventsPage,
  // EventDetailPage,
  // ClubsPage,
  // ClubProfilePage,
  // UserProfilePage,
  // CreateEventPage,
  // RegisterClubPage,
  // NotFoundPage
 from './pages/HomePage';
//import { ProtectedRoute, AdminRoute } from './components/layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailPage />} />
              <Route path="/clubs" element={<ClubsPage />} />
              <Route path="/clubs/:clubId" element={<ClubProfilePage />} />
              <Route path="/register-club" element={<RegisterClubPage />} />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/create-event" element={
                <AdminRoute>
                  <CreateEventPage />
                </AdminRoute>
              } />
              
              <Route path="*" element={<NotFoundPage />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;