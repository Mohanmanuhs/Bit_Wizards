import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import "./App.css"
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import  LoginPage from './pages/LoginPage';
import  RegisterPage  from './pages/RegisterPage';
import  EventsPage  from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import  ClubRequestsPage  from './pages/ClubRequestsPage';
import CreateEventPage from './pages/CreateEventPage';
import { HomePage }
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
import ClubListingPage from './pages/ClubListingPage';
import RegisterClubForm from './pages/RegisterClubForm';
//import { ProtectedRoute, AdminRoute } from './components/layout';

function App() {
  return (
    <AuthProvider>
        <div className="flex flex-col min-h-screen">

          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/admin/clubs" element={<ClubRequestsPage />} />
              <Route path="/events/create" element={<CreateEventPage />} />
              <Route path="/" element={
                  <HomePage />
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
               <Route path="/clubs" element={<ClubListingPage />} />
               <Route path="/register-club" element={<RegisterClubForm />} />
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
    </AuthProvider>
  );
}

export default App;