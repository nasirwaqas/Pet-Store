import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import UserNavbar from './pages/UserNavbar';
import RegistrationForm from './pages/RegistrationForm';
import { useSelector } from 'react-redux';
import Spinner from './components/spinner';
import PublicRoute from './components/publicRoute';
import ProtectedRoute from './components/protectedRoute';
import Profile from './pages/userProfile';
import AdminLayout from './components/Layout';
import AdminHome from './components/adminhome';
import AdminRoute from './components/AdminRoute'; // Import the AdminRoute
import UploadPetForm from './pages/PetForm';
import AdminManagement from './components/adminusers';
import AdminBookings from './components/adminbooking';
import AdminComplaints from './components/admincomplaints';
import UseLogout from '../src/hooks/HandleLogout';
import PetDetails from './pages/PetDetails';
import HomePage from './pages/HomePage';
import CreateReview from './pages/CreateReview';
import ManageProducts from './components/ManageProducts';
import CartModal from './pages/CartModal';
import SearchedPets from './pages/SearchedPets';
function App() {
  const { loading } = useSelector(state => state.alert);

  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner />
        ) : (
          <Routes>
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/" element={<HomePage/>} />
            <Route path="/pet-details/:id" element={<PetDetails />} />
            <Route path="/cart" element={<ProtectedRoute><CartModal /></ProtectedRoute>} />
            <Route path="/pet-details/:id/review" element={<ProtectedRoute><CreateReview/></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminHome/></AdminRoute>} /> {/* Protected Admin Route */}
            <Route path='/admin/users' element={<AdminRoute><AdminManagement/></AdminRoute>}/>
            <Route path='/manage/products' element={<AdminRoute><ManageProducts/></AdminRoute>} />
            <Route path='/admin/bookings' element={<AdminRoute><AdminBookings/></AdminRoute>}/>
            <Route path='/admin/complaints' element={<AdminRoute><AdminComplaints/></AdminRoute>}/>
            <Route path='/admin/logout' element={<AdminRoute><UseLogout/></AdminRoute>}/>
            <Route path='/uploadpet' element={<ProtectedRoute><UploadPetForm /></ProtectedRoute>} />
            <Route path="/pet/searchPets" element={<SearchedPets />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
