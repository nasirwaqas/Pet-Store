import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Alert, Container, Form, Button, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Range } from 'react-range';
import '../style/ProductCard.css';
import UserNavbar from './UserNavbar';
import Footer from './Footer';

const SearchedProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sizeInput, setSizeInput] = useState('');
  const [color, setColor] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL;

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`${API_URL}/product/searchProducts`, { params: { category } });
        setProducts(Array.isArray(productRes.data) ? productRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
      }
    };
    fetchData();
  }, [category]);

  useEffect(() => {
    let filtered = products;

    if (category) {
      filtered = filtered.filter(product => product.status !== 'Blocked' && product.category.toLowerCase() === category.toLowerCase());
    }

    if (sizeInput) {
      filtered = filtered.filter(product => product.size.toLowerCase().includes(sizeInput.toLowerCase()));
    }

    if (color) {
      filtered = filtered.filter(product => product.color === color);
    }

    if (priceRange) {
      filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
    }

    if (selectedRating) {
      filtered = filtered.filter(product => calculateAverageRating(product.reviews) >= selectedRating);
    }

    setFilteredProducts(filtered);
  }, [category, products, sizeInput, color, priceRange, selectedRating]);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const handleRangeChange = (values) => {
    setPriceRange(values);
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  return (
    <>
      <UserNavbar />
      <Container fluid className="mt-4">
        <Row>
          {/* Sidebar Filters */}
          <Col xs={12} md={3} className="mb-4">
            <h5>Filter by</h5>
            <Form>
              <Accordion defaultActiveKey="0">
                {/* size Input Field */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Size</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="sizeInput">
                      <Form.Label>Enter Size</Form.Label>
                      <Form.Control
                        type="text"
                        value={sizeInput}
                        placeholder="Type size..."
                        onChange={(e) => setSizeInput(e.target.value)}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Price Range Filter with Two Handles */}
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Price</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="priceRange">
                      <Form.Label>
                        Price Range: {priceRange[0]} - {priceRange[1]}
                      </Form.Label>
                      <Range
                        step={50}
                        min={0}
                        max={10000}
                        values={priceRange}
                        onChange={handleRangeChange}
                        renderTrack={({ props, children }) => (
                          <div
                            {...props}
                            style={{
                              height: '6px',
                              width: '100%',
                              background: '#ddd',
                              margin: '20px 0'
                            }}
                          >
                            {children}
                          </div>
                        )}
                        renderThumb={({ props }) => (
                          <div
                            {...props}
                            style={{
                              height: '16px',
                              width: '16px',
                              backgroundColor: '#007bff',
                              borderRadius: '50%'
                            }}
                          />
                        )}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Rating Filter */}
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Rating</Accordion.Header>
                  <Accordion.Body>
                    <div className="rating-filter">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className="star"
                          color={star <= selectedRating ? 'gold' : 'grey'}
                          onClick={() => handleRatingChange(star)}
                        />
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form>
          </Col>

             {/* Right Side product Display */}
             <Col xs={12} md={9}>
            <Row>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col key={product._id} xs={12} sm={6} lg={4} className="d-flex align-items-stretch mb-4">
                    <Link to={`/product-details/${product._id}`} className="card-link">
                      <Card className="product-card">
                        {product.images && product.images.length > 0 && (
                          <Card.Img
                            className="product-image"
                            variant="top"
                            src={API_URL + '/images/' + product.images[0].split("\\").pop()}
                            alt={product.category}
                          />
                        )}
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="product-title">
                            <Card.Text className="text-left description">{product.description}</Card.Text>
                          </Card.Title>

                          <div className="d-flex">
                            <Card.Text className="product-price">Rs. {product.price}</Card.Text>
                            {product.discount && (
                              <span className="product-discount ms-2"> {product.discount}% Off</span>
                            )}
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <Card.Text className="sold-count">{product.soldCount || 0} sold</Card.Text>
                            <Card.Text className="product-rating">
                              <span className="stars">
                                {'★'.repeat(Math.round(calculateAverageRating(product.reviews)))} {/* Display average rating stars */}
                                {'☆'.repeat(5 - Math.round(calculateAverageRating(product.reviews)))} {/* Empty stars */}
                              </span>
                              ({product.reviews.length} reviews)
                            </Card.Text>
                          </div>

                          <Button variant="primary" className="mt-auto buy-now-button">
                            Buy Now
                          </Button>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                ))
              ) : (
                <Col>
                  <Alert variant="info">No products found matching your criteria.</Alert>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default SearchedProducts;