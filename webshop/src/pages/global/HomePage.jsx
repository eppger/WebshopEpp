import React, { useState, useMemo } from 'react'
import productsFromFile from "../../data/products.json"
import { useCart } from '../../context/CartContext'
import { Card, Button, Col, Row, Container, Toast, ToastContainer, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'

// Kõik unikaalsed kategooriad JSON failist
const allCategories = ['All', ...new Set(productsFromFile.map(p => p.category))]

function HomePage() {
  const [products] = useState(() => {
  const saved = localStorage.getItem("products");
  return saved ? JSON.parse(saved) : productsFromFile;
});

  const { addToCart } = useCart()
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [sortOption, setSortOption] = useState('default')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handleAddToCart = (product) => {
    addToCart(product)
    setToastMsg(`${product.title} added to cart! 🛒`)
    setShowToast(true)
  }

  // Filtreerimine + sorteerimine (useMemo = arvutatakse ainult siis kui muutub)
  const displayedProducts = useMemo(() => {
    let result = [...products]

    // Filtreeri kategooria järgi
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Sorteeri
    switch (sortOption) {
      case 'az':    result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za':    result.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break
      case 'price-desc': result.sort((a, b) => b.price - a.price); break
      case 'rating-asc':  result.sort((a, b) => a.rating.rate - b.rating.rate); break
      case 'rating-desc': result.sort((a, b) => b.rating.rate - a.rating.rate); break
      default: break
    }

    return result
  }, [products, sortOption, selectedCategory])

  return (
    <Container className="mt-4">

      {/* Pealkiri + filter + sort riba */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <h2 className="mb-0">
          Products
          <span className="text-muted fs-6 ms-2">({displayedProducts.length} items)</span>
        </h2>

        <div className="d-flex gap-2 flex-wrap">
          {/* Kategooria filter */}
          <Form.Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ width: 'auto' }}
          >
            {allCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All categories' : cat}
              </option>
            ))}
          </Form.Select>

          {/* Sorteerimine */}
          <Form.Select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="default">🔀 Sort by ...</option>
            <option value="az">🔤 Name A → Z</option>
            <option value="za">🔤 Name Z → A</option>
            <option value="price-asc">💰 Price low → high</option>
            <option value="price-desc">💰 Price high → low</option>
            <option value="rating-asc">⭐ Rating low → high</option>
            <option value="rating-desc">⭐ Rating high → low</option>
          </Form.Select>
        </div>
      </div>

      {/* Toodete grid */}
      <Row>
        {displayedProducts.length === 0 ? (
          <Col className="text-center text-muted py-5">
            <h5>No products found in this category.</h5>
          </Col>
        ) : (
          displayedProducts.map((product) => {
            return (
              <Col key={product.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    style={{ height: '200px', objectFit: 'contain', padding: '10px' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{ fontSize: '0.9rem' }}>
                      {product.title.length > 50
                        ? product.title.substring(0, 50) + '...'
                        : product.title}
                    </Card.Title>
                    <Card.Text className="text-success fw-bold">
                      {product.price.toFixed(2)} €
                    </Card.Text>

                    {/* Nupud */}
                    <div className="d-flex gap-2 mt-auto">
                      <Button
                        variant="primary"
                        className="flex-grow-1"
                        onClick={() => handleAddToCart(product)}
                      >
                        🛒 Add to cart
                      </Button>
                      <Link to={`/product/${product.id}`}>
                        <Button variant="outline-secondary">🔍 Details</Button>
                      </Link>
                    </div>

                  </Card.Body>
                </Card>
              </Col>
            )
          })
        )}
      </Row>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={2000} autohide bg="success">
          <Toast.Body className="text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  )
}

export default HomePage