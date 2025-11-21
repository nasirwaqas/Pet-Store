import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Image, Form, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';



const DeliveryForm = ({ handleDeliveryInfoSubmit }) => (
  <Form onSubmit={handleDeliveryInfoSubmit}>
    <h4>Delivery Information</h4>
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
    <Button variant="primary" type="submit">Submit Delivery Info</Button>
  </Form>
);

const PaymentOptions = ({ handlePaymentSubmit }) => (
  <Form onSubmit={handlePaymentSubmit}>
    <h4>Select Payment Method</h4>
    <Form.Group controlId="paymentMethod">
      <Form.Check 
        type="radio" 
        label="Cash on Delivery" 
        name="paymentMethod" 
        value="Cash on Delivery" 
        required 
      />
      <Form.Check 
        type="radio" 
        label="Credit Card" 
        name="paymentMethod" 
        value="Credit Card" 
      />
      <Form.Check 
        type="radio" 
        label="Debit Card" 
        name="paymentMethod" 
        value="Debit Card" 
      />
      <Form.Check 
        type="radio" 
        label="Online Payment" 
        name="paymentMethod" 
        value="Online Payment" 
      />
    </Form.Group>
    <Button variant="success" type="submit">Confirm Payment</Button>
  </Form>
);

const CartModal = ({ show, handleClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (show) {
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
    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, quantity: parseInt(quantity) } : item
    ).filter(item => item.quantity > 0);
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

  const calculateTotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  const handleProceedToCheckout = () => {
    setShowDeliveryForm(true);
  };

  const handleDeliveryInfoSubmit = (e) => {
    e.preventDefault();
    setShowDeliveryForm(false);
    setShowPaymentOptions(true); // Show payment options after delivery form submission
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    const paymentMethod = e.target.paymentMethod.value;
    console.log('Selected Payment Method:', paymentMethod);

    // Implement further payment handling logic here
    setSuccess(true);
    setError(null);
    setShowPaymentOptions(false); // Hide payment options after submission
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

        {showPaymentOptions ? (
          <PaymentOptions handlePaymentSubmit={handlePaymentSubmit} />
        ) : showDeliveryForm ? (
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
                          src={item.images && item.images[0] ? API_URL + `/images/${item.images[0].split('\\').pop()}` : '/images/default.jpg'} 
                          alt={item.size} 
                          fluid 
                          rounded 
                        />
                      </Col>
                      <Col md={3}>
                        <Link to={`/product-details/${item._id}`} onClick={handleClose}>{item.description}</Link>
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
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
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
      {cartItems.length > 0 && !showDeliveryForm && !showPaymentOptions && (
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
