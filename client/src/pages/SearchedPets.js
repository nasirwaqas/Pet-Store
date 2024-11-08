

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Alert, Container, Form, Button, Accordion } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import '../style/PetCard.css';
import UserNavbar from './UserNavbar';
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const SearchedPets = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [color, setColor] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const location = useLocation();

  // Example breed options for radio buttons
  const breedOptions = ['Labrador', 'Persian', 'Parrot'];

  // Example color options for specific breeds
  const colorOptions = {
    Labrador: ['Black', 'Yellow', 'Chocolate'],
    Persian: ['White', 'Grey', 'Black'],
    Parrot: ['Green', 'Red', 'Blue'],
  };

  // Extract search query from the URL
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || ''; // Get the pet type from the URL

  // Fetch pet data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const petRes = await axios.get('http://localhost:8080/pet/searchPets', { params: { category } });
        const petsData = Array.isArray(petRes.data) ? petRes.data : [];
        setPets(petsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPets([]);
      }
    };
    fetchData();
  }, [category]);

  // Filter pets based on user input
  useEffect(() => {
    let filtered = pets;

    if (category) {
      filtered = filtered.filter(pet => pet.status !== 'Blocked' && pet.category.toLowerCase() === category.toLowerCase());
    }

    if (selectedBreed) {
      filtered = filtered.filter(pet => pet.breed === selectedBreed);
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
  }, [category, pets, selectedBreed, color, priceRange, selectedRating]);

  // Calculate average rating for pets
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Update price range
  const handlePriceChange = (e) => {
    setPriceRange([e.target.value[0], e.target.value[1]]);
  };

  // Update rating selection
  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <UserNavbar />
      <Container fluid className="mt-4">
        <Row>
          {/* Left Sidebar Filter */}
          <Col xs={12} md={3} className="mb-4">
            <h5>Filter by</h5>
            <Form onSubmit={handleFilterSubmit}>
              <Accordion defaultActiveKey="0">
                {/* Breed Filter */}
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Breed</Accordion.Header>
                  <Accordion.Body>
                    {breedOptions.map((breed, index) => (
                      <Form.Check
                        key={index}
                        type="radio"
                        label={breed}
                        name="breed"
                        value={breed}
                        checked={selectedBreed === breed}
                        onChange={(e) => {
                          setSelectedBreed(e.target.value);
                          setColor(''); // Reset color when breed changes
                        }}
                      />
                    ))}
                  </Accordion.Body>
                </Accordion.Item>

                {/* Color Filter (conditionally shown based on breed) */}
                {selectedBreed && (
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>Color</Accordion.Header>
                    <Accordion.Body>
                      <Form.Group controlId="color">
                        <Form.Control
                          as="select"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                        >
                          <option value="">Select Color</option>
                          {colorOptions[selectedBreed]?.map((color, index) => (
                            <option key={index} value={color}>
                              {color}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                )}

                {/* Price Filter */}
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Price</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="priceRange">
                      <Form.Label>Price Range: {priceRange[0]} - {priceRange[200]}</Form.Label>
                      <Form.Range
                        value={priceRange}
                        min={0}
                        max={10000}
                        onChange={handlePriceChange}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>

                {/* Rating Filter */}
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Rating</Accordion.Header>
                  <Accordion.Body>
                    <div className="rating-filter">
                      {[1, 2, 3, 4, 5].map((star) => (
                     <FontAwesomeIcon
                     key={star}
                     icon={faStar}
                     className="star"
                     size="lg" // Use FontAwesomeIcon's size options like "xs", "sm", "lg" instead of numbers
                     color={star <= selectedRating ? 'gold' : 'grey'}
                     onClick={() => handleRatingChange(star)}
                   />
                   
                      ))}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>

                <Button className="mt-3" variant="primary" type="submit">
                  Apply Filters
                </Button>
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
