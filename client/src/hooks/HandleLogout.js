// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));

    window.location.reload(); // Refresh the page to update the navbar
    navigate('/');
  };

  return (
    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
  );
};

export default useLogout;
