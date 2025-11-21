// ProductDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Badge, Card, Button, Form } from 'react-bootstrap';
import '../style/ProductDetails.css';
import UserNavbar from './UserNavbar';
import ViewReviews from './ViewReviews';
import '../style/ProductDetails.css';
import Footer from './Footer';


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(''); // State to track the main image
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/product/${id}`);
        setProduct(res.data);
        setMainImage(`${API_URL}/images/${res.data.images[0].split('\\').pop()}`); // Set the default main image to the first image
        calculateAverageRating(res.data.reviews);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      setAverageRating(0);
      return;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = total / reviews.length;
    setAverageRating(avgRating.toFixed(1));
  };

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add items to the cart.');
      navigate('/login'); // Redirect to login page
      return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productInCart = cart.find((item) => item._id === product._id);
    if (productInCart) {
      productInCart.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Dispatch a custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));

    alert('product added to cart!');
  };

  // Handler for hovering over the side images
  const handleMouseOver = (index) => {
    setMainImage(`${API_URL}/images/${product.images[index].split('\\').pop()}`); // Set the main image to the hovered image
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <UserNavbar />
      <Container fluid className="product-details-page">
        <Row>
          {/* Left Section: Additional Side Images */}
          <Col xs={1} md={1} className="product-side-images">
            <div className="d-flex flex-column align-items-center">
              {product.images && product.images.map((image, index) => (
                <span
                  key={index}
                  className="side-imagebox"
                  onMouseOver={() => handleMouseOver(index)} // Hover event for each image
                >
                  <img
                    src={`${API_URL}/images/${image.split('\\').pop()}`}
                    className="w-100 h-100"
                    alt={product.size}
                  />
                </span>
              ))}
            </div>
          </Col>

          {/* Section: Main Image Box */}
          <Col xs={10} md={5} className="imagebox">
            <img
              src={mainImage} // Display the main image from the state
              alt={product.size}
            />
          </Col>

          {/* Middle Section: Product Details */}
          <Col xs={10} md={3} className="detailsbox">
            <div className="card-title">
              <Card.Title className="product-title">
                <Card.Text className="text-left cardtitle">
                  {product.description}
                </Card.Text>
              </Card.Title>
              <Col md={9} className="flex-item-right">
                {/* Ratings & Reviews */}
                <div className="rating-section">
                  <div className="review-section">
                    <h4>{averageRating} </h4>
                    <div className="stars">
                      {'★'.repeat(Math.floor(averageRating))}{' '}
                      {averageRating % 1 >= 0.5 ? '☆' : ''}
                      {'☆'.repeat(5 - Math.ceil(averageRating))}
                    </div>
                    <p>({product.reviews.length} reviews)</p>
                  </div>
                </div>
                {/* Price Section */}
                <div className="price-section">
                  {product.discount > 0 && (
                    <>
                      <p className="text-muted text-decoration-line-through">Rs. {product.originalPrice}</p>
                      <p className="text-danger">
                        Rs. {product.price} <span className="badge bg-success">{product.discount}% Off</span>
                      </p>
                    </>
                  )}
                  {!product.discount && <p className="text-success">Rs. {product.price}</p>}
                </div>

                <p>
                  <strong>Status:</strong>{' '}
                  <Badge bg={product.status === 'Available' ? 'success' : 'danger'}>
                    {product.status}
                  </Badge>
                </p>
                <p className='about'>
                  <strong>About this Product</strong>&nbsp;
                  {product.about}
                </p>
              </Col>
            </div>
          </Col>

          {/* Right Section: Delivery & Availability */}
          <Col xs={12} md={2} className="availabilitybox">
            {/* Price and Shipping Details */}
            <div className="price-shipping">
              <h5>Rs.{product.price}</h5>
              <p>Delivery October 2 - 22</p>
              <p><strong>Deliver to:</strong> Pakistan</p>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section my-3">
              <strong>Quantity:</strong>
              <Form.Select aria-label="Quantity" className="mt-2">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </Form.Select>
            </div>

            {/* Add to Cart & Buy Now Buttons */}
            <Button variant="warning" size="lg" className="me-3 w-100" onClick={handleAddToCart}>
              Add to Cart
            </Button>
            <Button variant="danger" size="lg" className="w-100 mt-2">
              Buy Now
            </Button>
          </Col>
        </Row>
      </Container>
      <ViewReviews />
      <Footer/>
    </>
  );
};

export default ProductDetails;
