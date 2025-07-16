import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Card, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../style/PetCard.css';

const PetCard = () => {
  const [pets, setPets] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;


  // Fetch pet data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const petRes = await axios.get(`${API_URL}/admin/pets`);
        const petsData = Array.isArray(petRes.data) ? petRes.data : petRes.data.pets || [];
        setPets(petsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPets([]);
      }
    };
    fetchData();
  }, []);

  // Calculate average rating
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1); // Return average rating with one decimal place
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col xs={12}>
          <h2 className="text-center my-4">
            <span className="border-top border-bottom border-dark px-3">Our Pets</span>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-around">
        {pets && pets.length > 0 ? (
          pets.filter(pet => pet.status !== 'Blocked').map((pet) => (
            <Col key={pet._id} xs={12} sm={6} lg={3} className="d-flex align-items-stretch mb-4">
              <Link to={`/pet-details/${pet._id}`} className="card-link"> {/* Wrap the entire card */}
                <Card className="pet-card">
                  {pet.images && pet.images.length > 0 && (
                    <Card.Img className="pet-image" variant="top" src={'/images/' + pet.images[0].split("\\").pop()} alt={pet.Type} />
                  )}
                  <Card.Body className="d-flex flex-column">
                    {/* Pet Title */}
                    <Card.Title className="pet-title">
                      <Card.Text className="text-left description">
                        {pet.description}
                      </Card.Text>
                    </Card.Title>

                    {/* Price and Discount */}
                    <div className="d-flex">
                      <Card.Text className="pet-price">
                        Rs. {pet.price}
                      </Card.Text>
                      {pet.discount && (
                        <span className="pet-discount ms-2"> {pet.discount}% Off</span>
                      )}
                    </div>

                    {/* Sold Count, Average Rating, and Reviews */}
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
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <Col>
            <Alert variant="info">No pets have been uploaded yet.</Alert>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default PetCard;
