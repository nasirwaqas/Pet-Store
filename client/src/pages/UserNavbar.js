import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Nav, Navbar, NavDropdown, Modal, InputGroup, FormControl, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import LoginForm from './Login';
import RegisterForm from './Register';
import CartModal from './CartModal';
import useLogout from '../hooks/HandleLogout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../style/UserNavbar.css';

const UserNavbar = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');  // Default to 'All'
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => setShowRegister(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  const handleCloseCart = () => setShowCart(false);
  const handleShowCart = () => setShowCart(true);
  const userName = localStorage.getItem('userName');
  const LogoutButton = useLogout();

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);  // Update selected category
  };

  const parseSearchQuery = (query) => {
    const filters = {
      type: '',
      breed: '',
      color: '',
      maxPrice: null,
      minRating: null,
    };

    const words = query.toLowerCase().split(' ');

    words.forEach(word => {
      if (['dog', 'cat', 'parrot', 'rabbit', 'hamster', 'fish', 'turtle', 'horse', 'peacock', 'pigeon', 'canary', 'cockatoo', 'macaw', 'finch'].includes(word)) {
        filters.type = word;
      } else if (['beagle', 'persian', 'sparrow'].includes(word)) {
        filters.breed = word;
      } else if (['black', 'white', 'brown'].includes(word)) {
        filters.color = word;
      } else if (word.startsWith('$') || word.startsWith('under')) {
        filters.maxPrice = word.replace(/\D/g, '');
      }
    });

    return filters;
  };

  const handleSearch = (e) => {
    e.preventDefault();
  
    // Only proceed if there's a search query
    if (searchQuery.trim()) {
      const filters = parseSearchQuery(searchQuery);
  
      // Build URL search params
      const params = new URLSearchParams();
      
      // If a specific category is selected (other than 'All')
      if (selectedCategory !== 'All' && selectedCategory) {
        params.append('category', selectedCategory);  // Include selected category
      } else if (filters.type) {
        // If no category is selected, use the 'type' from the search query
        params.append('type', filters.type);
      }
  
      // Include other filters from the parsed query
      if (filters.type) params.append('category', filters.type);
      if (filters.breed) params.append('breed', filters.breed);
      if (filters.color) params.append('color', filters.color);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);
  
      // Navigate to search results with filters applied
      navigate(`/pet/searchPets?${params.toString()}`, { state: { filters } });
    }
  };
  

  return (
    <div className='userNavbar' >
      <Navbar bg="dark" expand="lg" className="shadow-sm py-1" style={{ width: '100%', margin: '0 auto' }}>
        <Container fluid>
          <Navbar.Brand as={Link} to="/" id='logo' className="fw-bold">
            Pet Store
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarResponsive" className="custom-toggle" />
          
          <Navbar.Collapse id="navbarResponsive" bg="light">
            <Nav className="me-auto">
              <div className="d-none d-lg-block me-3" id='dileveroption'>
                <span className="location">Deliver to</span><br />
                <small>Pakistan</small>
              </div>
            </Nav>

            {/* Search Bar */}
            <Nav className="me-auto">
              <InputGroup className="search-bar mx-auto my-2 my-lg-0" size="sm"> 
                <NavDropdown 
                  title={selectedCategory} 
                  id="departments-dropdown" 
                  className="category-dropdown me-2"
                  onSelect={handleCategorySelect}  // Handle category selection
                >
                  <NavDropdown.Item eventKey="All">All</NavDropdown.Item>
                  <NavDropdown.Item eventKey="dog">Dog</NavDropdown.Item>
                  <NavDropdown.Item eventKey="cat">Cat</NavDropdown.Item>
                  <NavDropdown.Item eventKey="Horse">Horse</NavDropdown.Item>
                  <NavDropdown.Item eventKey="rabbit">Rabbit</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item eventKey="hamster">Hamster</NavDropdown.Item>
                  <NavDropdown.Item eventKey="fish">Fish</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item eventKey="parrot">Parrot</NavDropdown.Item>
                  <NavDropdown.Item eventKey="trutle">Trutle</NavDropdown.Item>
                  <NavDropdown.Item eventKey="peacock">Peacock</NavDropdown.Item>
                  <NavDropdown.Item eventKey="pigeon">Pigeon</NavDropdown.Item>
                  <NavDropdown.Item eventKey="canary">Canary</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item eventKey="More Categories"> <strong>More Categories</strong>  </NavDropdown.Item>
                </NavDropdown>

                <FormControl
                  placeholder="Search pet store"
                  aria-label="Search"
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <Button 
                  variant="warning" 
                  className="search-button"
                  onClick={handleSearch}  // Trigger search
                >
                  Search
                </Button>
              </InputGroup>
            </Nav>

            <Nav className="ms-a">
              <NavDropdown title="EN" id="language-dropdown" className="me-3">
                <NavDropdown.Item href="#">English</NavDropdown.Item>
                <NavDropdown.Item href="#">Urdu</NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title={userName ? `Hello, ${userName}` : 'Hello, Sign in'} id="account-dropdown" className="me-3">
                {userName ? (
                  <>
                    <NavDropdown.Item as={Link} to="/profile">Your Account</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/orders">Your Orders</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>{LogoutButton}</NavDropdown.Item>
                  </>
                ) : (
                  <>
                    <NavDropdown.Item onClick={handleShowLogin}>Sign in</NavDropdown.Item>
                    <NavDropdown.Item onClick={handleShowRegister}>Register</NavDropdown.Item>
                  </>
                )}
              </NavDropdown>

              <Nav.Link as={Link} to="/orders" id='returnOrders' className="me-3">
                <div className="text-center small">
                  Returns<br />
                  <strong>& Orders</strong>
                </div>
              </Nav.Link>

              <Nav.Link onClick={handleShowCart} className="me-3" style={{ cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                <Badge pill bg="danger" className="ms-1">
                  {cartCount}
                </Badge>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Register Modal */}
      <Modal show={showRegister} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-center">Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterForm handleClose={handleCloseRegister} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseRegister}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Login Modal */}
      <Modal show={showLogin} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-center">Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm handleClose={handleCloseLogin} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogin}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cart Modal */}
      <CartModal show={showCart} handleClose={handleCloseCart} />
    </div>
  );
};

export default UserNavbar;
