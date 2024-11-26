import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Alert, Container, Form, Button, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { Range } from 'react-range';
import '../style/PetCard.css';
import UserNavbar from './UserNavbar';
import Footer from './Footer';

const SearchedPets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [breedInput, setBreedInput] = useState('');
  const [color, setColor] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petRes = await axios.get('http://localhost:8080/pet/searchPets', { params: { category } });
        setPets(Array.isArray(petRes.data) ? petRes.data : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPets([]);
      }
    };
    fetchData();
  }, [category]);

  useEffect(() => {
    let filtered = pets;

    if (category) {
      filtered = filtered.filter(pet => pet.status !== 'Blocked' && pet.category.toLowerCase() === category.toLowerCase());
    }

    if (breedInput) {
      filtered = filtered.filter(pet => pet.breed.toLowerCase().includes(breedInput.toLowerCase()));
    }

    if (color) {
      filtered = filtered.filter(pet => pet.color === color);
    }

    if (priceRange) {
      filtered = filtered.filter(pet => pet.price >= priceRange[0] && pet.price <= priceRange[1]);
    }

    if (selectedRating) {
      filtered = filtered.filter(pet => calculateAverageRating(pet.reviews) >= selectedRating);
    }

    setFilteredPets(filtered);
  }, [category, pets, breedInput, color, priceRange, selectedRating]);

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
                {/* Breed Input Field */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Breed</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="breedInput">
                      <Form.Label>Enter Breed</Form.Label>
                      <Form.Control
                        type="text"
                        value={breedInput}
                        placeholder="Type breed..."
                        onChange={(e) => setBreedInput(e.target.value)}
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

             {/* Right Side Pet Display */}
             <Col xs={12} md={9}>
            <Row>
              {filteredPets.length > 0 ? (
                filteredPets.map((pet) => (
                  <Col key={pet._id} xs={12} sm={6} lg={4} className="d-flex align-items-stretch mb-4">
                    <Link to={`/pet-details/${pet._id}`} className="card-link">
                      <Card className="pet-card">
                        {pet.images && pet.images.length > 0 && (
                          <Card.Img
                            className="pet-image"
                            variant="top"
                            src={'/images/' + pet.images[0].split("\\").pop()}
                            alt={pet.category}
                          />
                        )}
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="pet-title">
                            <Card.Text className="text-left description">{pet.description}</Card.Text>
                          </Card.Title>

                          <div className="d-flex">
                            <Card.Text className="pet-price">Rs. {pet.price}</Card.Text>
                            {pet.discount && (
                              <span className="pet-discount ms-2"> {pet.discount}% Off</span>
                            )}
                          </div>

                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <Card.Text className="sold-count">{pet.soldCount || 0} sold</Card.Text>
                            <Card.Text className="pet-rating">
                              <span className="stars">
                                {'★'.repeat(Math.round(calculateAverageRating(pet.reviews)))} {/* Display average rating stars */}
                                {'☆'.repeat(5 - Math.round(calculateAverageRating(pet.reviews)))} {/* Empty stars */}
                              </span>
                              ({pet.reviews.length} reviews)
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
                  <Alert variant="info">No pets found matching your criteria.</Alert>
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

export default SearchedPets;