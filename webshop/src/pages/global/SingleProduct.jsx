import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { Container, Row, Col, Badge, Button, Card, Toast, ToastContainer, Spinner } from 'react-bootstrap'

function SingleProduct() {
  const { index } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    fetch(`https://699edb8f78dda56d396b9d19.mockapi.io/products/${index}`)
      .then(res => res.json())
      .then(json => {
        setProduct(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [index])

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="mt-5 text-center">
        <h3>Product not found!</h3>
        <Link to="/">
          <Button variant="primary" className="mt-3">← Back to shop</Button>
        </Link>
      </Container>
    )
  }

  return (
    <Container className="mt-5">
      <Link to="/" className="text-decoration-none text-secondary">
        ← Back to products
      </Link>

      <Card className="mt-3 shadow-sm">
        <Row className="g-0">

          {/* Pilt */}
          <Col md={4} className="d-flex align-items-center justify-content-center p-4">
            <img
              src={product.image}
              alt={product.title}
              style={{ maxHeight: '350px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </Col>

          {/* Info */}
          <Col md={8}>
            <Card.Body>

              {/* Kategooria */}
              <Badge bg="secondary" className="mb-2">{product.category}</Badge>

              {/* Pealkiri */}
              <h2 className="mb-3">{product.title}</h2>

              {/* Hind */}
              <h3 className="text-success mb-3">{Number(product.price).toFixed(2)} €</h3>

              {/* Kirjeldus */}
              <p className="text-muted mb-4">{product.description}</p>

              {/* Reiting */}
              {product.rating && (
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div>
                    <span className="text-warning fs-5">⭐</span>
                    <strong className="fs-5"> {product.rating.rate}</strong>
                    <span className="text-muted"> / 5</span>
                  </div>
                  <div className="text-muted">
                    ({product.rating.count} reviews)
                  </div>
                </div>
              )}

              {/* Nupud */}
              <div className="d-flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => { addToCart(product); setShowToast(true) }}
                >
                  🛒 Add to cart
                </Button>
                <Link to="/">
                  <Button variant="outline-secondary" size="lg">
                    ← Continue shopping
                  </Button>
                </Link>
              </div>

            </Card.Body>
          </Col>
        </Row>
      </Card>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={2500} autohide bg="success">
          <Toast.Body className="text-white">
            🛒 <strong>{product.title.substring(0, 30)}...</strong> added to cart!
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </Container>
  )
}

export default SingleProduct