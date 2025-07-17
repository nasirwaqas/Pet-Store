import React, { useEffect, useState } from 'react';
import { Card, ListGroup, ProgressBar, Col, Row, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarOutline } from '@fortawesome/free-solid-svg-icons';
import '../style/ReviewPage.css';

const ViewReviews = () => {
  const { id } = useParams(); // Pet ID from URL params
    const API_URL = process.env.REACT_APP_API_URL;

  const [ratingData, setRatingData] = useState({
    overallRating: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    totalRatings: 0,
    reviews: [],
  });

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/pet/${id}/rating`);
        setRatingData(data);
      } catch (error) {
        console.error('Error fetching rating data:', error);
      }
    };

    fetchRating();
  }, [id]);

  const { overallRating, ratingBreakdown, totalRatings, reviews } = ratingData;

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} color="#ffc107" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} color="#ffc107" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarOutline} color="#e4e5e9" />);
      }
    }
    return stars;
  };

  const numericOverallRating = Number(overallRating);

  return (
    <>
   
    <div className='top-review-section'>
       <Container className="my-5">
      <Row >
        <Col md={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Row>
                <Col md={4} className="text-center">
                  <h3>Customer Reviews</h3>
                  <div>{renderStars(numericOverallRating)}</div>
                  <h4>{numericOverallRating.toFixed(1)} &nbsp; out of 5</h4>
                  <p>{totalRatings} Global Ratings</p>
                </Col>
                <Col md={8} text-center>
                  <h5>Rating Breakdown</h5>
                  {Object.keys(ratingBreakdown).reverse().map((rating) => (
                    <div key={rating} className="my-2">
                      <Row>
                        <Col xs={2}>{rating} Stars</Col>
                        <Col xs={8}>
                          <ProgressBar
                            now={(ratingBreakdown[rating] / totalRatings) * 100}
                            label={`${ratingBreakdown[rating]} reviews`}
                            variant="warning" // This sets the color to #ffc107
                          />
                        </Col>
                      </Row>
                    </div>
                  ))}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
 

      {/* Review this product section */}
      <Row className="mt-4">
        <Col>
          <h3>Review this product</h3>
          <p>Share your thoughts with other customers</p>
          <Link to={`/pet-details/${id}/review`}>
            <Button variant="primary">Write a customer review</Button>
          </Link>
        </Col>
      </Row>
      </Container>
     </div>
     <Container className="my-5">
      <Row className="mt-3">
        <Col>
          <h3>Top Reviews</h3>
          <ListGroup>
            {reviews.length === 0 ? (
              <p>No reviews available for this pet yet.</p>
            ) : (
              reviews.map((review) => {
                const reviewRating = Number(review.rating);
                return (
                  <ListGroup.Item key={review._id} className="shadow-sm mb-2 p-3">
                    <small className="text-muted"> {review.name}</small>
                    <div className="d-flex align-items-center">
                      {/* Render stars and headline */}
                      <div className="me-2">{renderStars(reviewRating)}</div>
                      <h5 className="mb-0">{review.headline}</h5>
                    </div>
                    {/* Render review content below the stars and headline */}
                    <p className="mt-2">{review.createdAt}</p>
                    <p>{review.review}</p>
                  </ListGroup.Item>
                );
              })
            )}
          </ListGroup>
        </Col>
      </Row>
    </Container>

    </>
  );
};

export default ViewReviews;
