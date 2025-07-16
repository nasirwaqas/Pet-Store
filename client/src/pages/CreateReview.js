import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons'; // Correct import for solid stars
import '../style/ReviewPage.css';
import UserNavbar from './UserNavbar';

const CreateReview = () => {
  const { id } = useParams(); // Pet ID from URL params
  const [pet, setPet] = useState(null); // Store pet details
  const [headline, setHeadline] = useState('');  // For review headline
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);  // For star hover effect
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
    const API_URL = process.env.REACT_APP_API_URL;


  // Fetch the pet details when the component is mounted
  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/pet/${id}`);
        setPet(res.data);
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };

    fetchPetDetails();
  }, [id]);

  // Handler for review headline change
  const handleHeadlineChange = (e) => {
    setHeadline(e.target.value);
  };

  // Handler for review text change
  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  // Handler for submitting the review
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !review || !headline) {
      setError('Rating, headline, and review cannot be empty.');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token is missing.');
      return;
    }
  
    try {
      // POST review to backend
      await axios.post(`${API_URL}/pet/${id}/review`, 
        {
          review, // Review text
          rating, // Rating value
          headline, // Review headline
        },
        {
          headers: { Authorization: `Bearer ${token}` } // Attach token to request
        }
      );
      // Display success message and reset the form
      setSuccessMessage('Review submitted successfully!');
      setHeadline('');
      setReview('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrorMessage('Error submitting review.');
    }
  };

  if (!pet) {
    return <div>Loading...</div>;
  }

  // Adjust image path if there are images
  const imagePath = pet.images && pet.images.length > 0 ? '/images/' + pet.images[0].split("\\").pop() : '/images/default-image.png';

  return (
    <>
      <UserNavbar />
      <Container fluid className="review-page">
        <Row>
          {/* Product Details Section */}
          <Col md={6} className="product-details">
            <Card>
              <Card.Img
                variant="top"
                src={imagePath}
                alt={pet.Type}
                onError={(e) => e.target.src = '/images/default-image.png'} // Fallback image
              />
              <Card.Body>
                <Card.Title>{pet.Type}</Card.Title>
                <Card.Text>{pet.description}</Card.Text>
                <Card.Text>
                  <strong>Price:</strong> Rs. {pet.price}
                </Card.Text>
                <Card.Text>
                  <strong>Status:</strong> {pet.status}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {/* Review Form Section */}
          <Col md={6} className="review-form">
            <h3>Write a Review</h3>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmitReview}>
              {/* Star Rating Input */}
              <Form.Group controlId="formRating">
                <Form.Label>Rating</Form.Label>
                <div className="star-rating">
                  {[...Array(5)].map((star, index) => {
                    const ratingValue = index + 1;
                    return (
                      <label key={index}>
                        <input
                          type="radio"
                          name="rating"
                          rules={[
                            {
                              required: true,
                              message: 'Please Give rating !',
                            },
                          ]}
                          value={ratingValue}
                          onClick={() => setRating(ratingValue)}
                          style={{ display: 'none' }} // Hide the actual radio input
                        />
                        <FontAwesomeIcon
                          icon={faStar}
                          className="star"
                          color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                          size="2x"
                          onMouseEnter={() => setHover(ratingValue)}
                          onMouseLeave={() => setHover(null)}
                        />
                      </label>
                    );
                  })}
                </div>
              </Form.Group>
              
              {/* Headline Input */}
              <Form.Group controlId="formHeadline">
                <Form.Label>Review Headline</Form.Label>
                <Form.Control
                  type="text"
                  value={headline}
                  rules={[
                    {
                      required: true,
                      message: 'Please Provide headline of the review',
                    },
                  ]}
                  onChange={handleHeadlineChange}
                  placeholder="What's most important to know?"
                  required
                />
              </Form.Group>

              {/* Review Textarea */}
              <Form.Group controlId="formReview">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={review}
                  rules={[
                    {
                      required: true,
                      message: 'Please Provide review information ',
                    },
                  ]}
                  onChange={handleReviewChange}
                  placeholder="What did you like or dislike? What did you use this product for?"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-3">
                Submit Review
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateReview;
