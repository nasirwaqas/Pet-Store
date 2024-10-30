// CartModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Image, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const DeliveryForm = ({ handleDeliveryInfoSubmit }) => {
  return (
    <Form onSubmit={handleDeliveryInfoSubmit}>
      <h4>Delivery Information</h4>
      {/* The form inputs go here */}
      <Form.Group controlId="fullName">
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" placeholder="Enter your first and last name" required />
      </Form.Group>
      <Form.Group controlId="phoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control type="text" placeholder="Please enter your phone number" required />
      </Form.Group>
      <Form.Group controlId="addressLine">
        <Form.Label>Building / House No / Floor / Street</Form.Label>
        <Form.Control type="text" placeholder="Please enter" required />
      </Form.Group>
      <Form.Group controlId="colony">
        <Form.Label>Colony / Suburb / Locality / Landmark</Form.Label>
        <Form.Control type="text" placeholder="Please enter" required />
      </Form.Group>
      <Form.Group controlId="province">
        <Form.Label>Province</Form.Label>
        <Form.Control as="select" required>
          <option value="">Please choose your province</option>
          <option value="home">punjab</option>
          <option value="office">sindh</option>
          <option value="save">kpk</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="city">
        <Form.Label>City</Form.Label>
        <Form.Control as="select" required>
          <option value="">Please choose your city</option>
          <option value="home">Lahore</option>
          <option value="office">karachi</option>
          <option value="save">SiyalKot</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="area">
        <Form.Label>Area</Form.Label>
        <Form.Control as="select" required>
          <option value="">Please choose your area</option>
          <option value="home">inside of city</option>
          <option value="office">outside of City</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="fullAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control type="text" placeholder="For Example: House# 123, Street# 123, ABC Road" required />
      </Form.Group>
      <Form.Group controlId="deliveryLabel">
        <Form.Label>Select a label for effective delivery:</Form.Label>
        <Form.Control as="select" required>
          <option value="home">HOME</option>
          <option value="office">OFFICE</option>
          <option value="save">SAVE</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">Submit Delivery Info</Button>
    </Form>
  );
};

const CartModal = ({ show, handleClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(show){
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
    }
  }, [show]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(cart);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = (id, quantity) => {
    const updatedCart = cartItems.map(item => {
      if(item._id === id){
        return { ...item, quantity: parseInt(quantity) };
      }
      return item;
    }).filter(item => item.quantity > 0);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleProceedToCheckout = () => {
    setShowDeliveryForm(true); // Show delivery form
  };

  const handleDeliveryInfoSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // You can extract values from the form if needed

    setSuccess(true);
    setError(null);
    setShowDeliveryForm(false); // Hide the delivery form after submission
    handleClose(); // Close the modal
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Your Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {success && <Alert variant="success">Order placed successfully!</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {showDeliveryForm ? (
          <DeliveryForm handleDeliveryInfoSubmit={handleDeliveryInfoSubmit} />
        ) : (
          <>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ListGroup variant="flush">
                {cartItems.map(item => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={2}>
                        <Image 
                          src={item.images && item.images[0] ? `/images/${item.images[0].split('\\').pop()}` : '/images/default.jpg'} 
                          alt={item.breed} 
                          fluid 
                          rounded 
                        />
                      </Col>
                      <Col md={3}>
                        <Link to={`/pet-details/${item._id}`} onClick={handleClose}>{item.description}</Link>
                      </Col>
                      <Col md={2}>
                        Rs. {item.price}
                      </Col>
                      <Col md={3}>
                        <Form.Control
                          as="select"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        >
                          {[...Array(10).keys()].map(x => (
                            <option key={x+1} value={x+1}>{x+1}</option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col md={2}>
                        <Button variant="danger" onClick={() => handleRemoveItem(item._id)}>Remove</Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </>
        )}
      </Modal.Body>
      {cartItems.length > 0 && !showDeliveryForm && (
        <Modal.Footer className="d-flex justify-content-between">
          <h5>Total: Rs. {calculateTotal()}</h5>
          <Button variant="success" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
