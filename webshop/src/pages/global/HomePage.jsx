import React, { useState, useMemo, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { Card, Button, Col, Row, Container, Toast, ToastContainer, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function HomePage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/products")
      .then(res => res.json())
      .then(json => setProducts(json))
  }, []);

  useEffect(() => {
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/categories")
      .then(res => res.json())
      .then(json => setCategories(json))
  }, []);

  const { addToCart } = useCart()
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [sortOption, setSortOption] = useState('default')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const handleAddToCart = (product) => {
    addToCart(product)
    setToastMsg(`${product.title} ${t('home.addedToCart')}`)
    setShowToast(true)
  }

  const displayedProducts = useMemo(() => {
    let result = [...products]
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }
    switch (sortOption) {
      case 'az':         result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'za':         result.sort((a, b) => b.title.localeCompare(a.title)); break
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

      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <h2 className="mb-0">
          {t('home.title')}
          <span className="text-muted fs-6 ms-2">({displayedProducts.length} {t('home.items')})</span>
        </h2>

        <div className="d-flex gap-2 flex-wrap">
          <Form.Select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="default">{t('home.selectCategory')}</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </Form.Select>

          <Form.Select
            value={sortOption}
            onChange={e => setSortOption(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="default">{t('home.sortBy')}</option>
            <option value="az">{t('home.sortAZ')}</option>
            <option value="za">{t('home.sortZA')}</option>
            <option value="price-asc">{t('home.sortPriceAsc')}</option>
            <option value="price-desc">{t('home.sortPriceDesc')}</option>
            <option value="rating-asc">{t('home.sortRatingAsc')}</option>
            <option value="rating-desc">{t('home.sortRatingDesc')}</option>
          </Form.Select>
        </div>
      </div>

      <Row>
        {displayedProducts.length === 0 ? (
          <Col className="text-center text-muted py-5">
            <h5>{t('home.noProducts')}</h5>
          </Col>
        ) : (
          displayedProducts.map((product) => (
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
                    {product.price} €
                  </Card.Text>
                  <div className="d-flex gap-2 mt-auto">
                    <Button
                      variant="primary"
                      className="flex-grow-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      🛒 {t('home.addToCart')}
                    </Button>
                    <Link to={`/product/${product.id}`}>
                      <Button variant="outline-secondary">🔍 {t('home.details')}</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
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