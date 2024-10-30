import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'; // Shopping cart icon

import '../style/Footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          {/* Company Info */}
          <Col md={4} className="mb-3">
            <h5>Pet Store</h5>
            <p>Your one-stop shop for all your pet needs. Buy, sell, and adopt pets with ease.</p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/home" className="text-light">Home</a></li>
              <li><a href="/about" className="text-light">About Us</a></li>
              <li><a href="/contact" className="text-light">Contact Us</a></li>
              <li><a href="/privacy" className="text-light">Privacy Policy</a></li>
            </ul>
          </Col>

          {/* Subscribe Section */}
          <Col md={4} className="mb-3">
            <h5>Subscribe to our Newsletter</h5>
            <Form className="d-flex">
              <Form.Control type="email" placeholder="Enter your email" className="mr-2" />
              <Button variant="warning" type="submit">
                Subscribe
              </Button>
            </Form>
          </Col>
        </Row>

        <Row className="text-center mt-4">
          <Col md={6} className="mb-3">
            {/* Social Media Links */}
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center">
              <a href="https://facebook.com" className="text-light mx-2">
                <FontAwesomeIcon icon={faFacebook} size="2x"  className='fb-icon'/>
              </a>
              <a href="https://twitter.com" className="text-light mx-2">
                <FontAwesomeIcon icon={faTwitter} size="2x" className='twittor-icon' />
              </a>
              <a href="https://instagram.com" className="text-light mx-2">
                <FontAwesomeIcon icon={faInstagram} size="2x" className='inst-icon'/>
              </a>
            </div>
          </Col>

          <Col md={6} className="mb-3">
            {/* Shopping Cart */}
            <h5>Shop with Us</h5>
            <a href="/cart" className="text-light">
              <FontAwesomeIcon icon={faShoppingCart} size="2x" /> Your Cart
            </a>
          </Col>
        </Row>

        <Row className="text-center mt-4">
          <Col>
            <p>&copy; {new Date().getFullYear()} Pet Store. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
