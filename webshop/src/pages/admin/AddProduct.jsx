import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";
import productsDb from "../../data/products.json";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    image: "",
    rating: { rate: 0, count: 0 }
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Nimetus on kohustuslik";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Sisesta kehtiv hind (> 0)";
    if (!formData.category.trim()) newErrors.category = "Kategooria on kohustuslik";
    if (!formData.description.trim()) newErrors.description = "Kirjeldus on kohustuslik";
    if (!formData.image.trim()) newErrors.image = "Pildi URL on kohustuslik";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

const existing = localStorage.getItem("products");
const currentProducts = existing ? JSON.parse(existing) : productsDb;

    const newProduct = {
      id: Date.now(),
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
      rating: { rate: 0, count: 0 }
    };

    const updated = [...currentProducts, newProduct];
    localStorage.setItem("products", JSON.stringify(updated));

    setSuccess(true);
    setTimeout(() => navigate("/admin/maintain-products"), 1500);
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "700px" }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/maintain-products">
          <Button variant="outline-secondary">← Tagasi</Button>
        </Link>
        <h2 className="mb-0">Lisa uus toode</h2>
      </div>

      {success && (
        <Alert variant="success">
          ✅ Toode lisatud! Suunatakse tagasi...
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Nimetus *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Toote nimetus"
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hind (€) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="nt. 29.99"
                    step="0.01"
                    min="0"
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kategooria *</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="nt. electronics"
                    isInvalid={!!errors.category}
                  />
                  <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Pildi URL *</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                isInvalid={!!errors.image}
              />
              <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
              {formData.image && (
                <div className="mt-2 text-center">
                  <img
                    src={formData.image}
                    alt="Eelvaade"
                    style={{ maxHeight: "150px", maxWidth: "100%", objectFit: "contain", border: "1px solid #ddd", borderRadius: "8px", padding: "8px" }}
                    onError={e => e.target.style.display = "none"}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Kirjeldus *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Toote kirjeldus..."
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" className="flex-grow-1">
                ✅ Lisa toode
              </Button>
              <Link to="/admin/maintain-products">
                <Button variant="outline-danger">Tühista</Button>
              </Link>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AddProduct;