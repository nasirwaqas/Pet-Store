import React, { useState, useEffect } from 'react';
import { Container, Navbar, NavDropdown,Nav } from 'react-bootstrap';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../style/LayoutStyle.css";
import { SidebarMenu } from './NavData/NavData'; // Ensure the import path is correct
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    navigate('/'); // Redirect to home page after logout
  };
  

  const getUserData = async () => {
    try {
      const res = await axios.post(`${API_URL}/user/getUserData`, {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const userName = localStorage.getItem('userName');

  return (
    <>
      <div className='main'>
        <div className='layout'>
          <div className='sidebar'>
            <div className='logo'>
            <h5><Link to="/admin" className="logo-link">Pet Store</Link></h5>
              <hr />
            </div>
            <div className='menu'>
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div className={`menu-item ${isActive ? "active" : ""}`} key={menu.path}
                  onClick={() => {
                    if (menu.action === 'logout') {
                      handleLogout(); // Trigger logout
                    } else {
                      navigate(menu.path);
                    }
                  }}
                >
                    <FontAwesomeIcon icon={menu.icon} className="menu-icon" />
                    <Link to={menu.path} className="menu-text">{menu.name}</Link>
                  </div>
                );
              })}
            </div>
          </div>
          <div className='content'>
            <Navbar className="bg-body-tertiary">
              <Container>
                <Navbar.Brand href="/admin">Online Pets Buy and Selling Store</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                <Navbar.Text>
             {userName ? (
                 <span className="navbar-text">
                {userName}
                </span>
              ) : (
               <Link to="/login">Login</Link>
              )}
               </Navbar.Text>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <div className='body'>
              {children} {/* This should render child components */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
