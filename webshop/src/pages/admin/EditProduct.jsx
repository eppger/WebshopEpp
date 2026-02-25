import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col, Alert } from "react-bootstrap";

function EditProduct() {
  const { index } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: 0,  
    title: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    rating: 0,
    count: 0
  });

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/products/" + index)
      .then(res => res.json())
      .then(json => {
        setFormData(json);
        setLoading(false);
      });
  }, [index]);

  useEffect(() => {
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/categories")
      .then(res => res.json())
      .then(json => setCategories(json));
  }, []);

    

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Enter a valid price (> 0)";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    fetch("https://699edb8f78dda56d396b9d19.mockapi.io/products/" + index, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate("/admin/maintain-products"), 1500);
      });
  };

  if (loading) return <Container className="mt-4"><p>Loading...</p></Container>;

  if (!formData.id === 0) return (
    <Container className="mt-4 text-center">
      <h4>❌ Product not found!</h4>
      <Link to="/admin/maintain-products">
        <Button variant="secondary" className="mt-3">← Back</Button>
      </Link>
    </Container>
  );

  return (
    <Container className="mt-4" style={{ maxWidth: "700px" }}>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/maintain-products">
          <Button variant="outline-secondary">← Back</Button>
        </Link>
        <h2 className="mb-0">✏️ Edit Product</h2>
      </div>

      {success && (
        <Alert variant="success">✅ Product updated! Redirecting...</Alert>
      )}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                isInvalid={!!errors.title}
              />
              <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (€) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    isInvalid={!!errors.price}
                  />
                  <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  {!showNewCategory ? (
                    <>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        isInvalid={!!errors.category}
                      >
                        <option value="">-- Select category --</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 mt-1"
                        onClick={() => setShowNewCategory(true)}
                      >
                        + Add new category
                      </Button>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="text"
                        placeholder="New category name..."
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                      />
                      <div className="d-flex gap-2 mt-1">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            if (newCategory.trim()) {
                              setFormData(prev => ({ ...prev, category: newCategory.trim() }));
                              setCategories(prev => [...prev, { id: Date.now(), name: newCategory.trim() }]);
                              setNewCategory("");
                              setShowNewCategory(false);
                            }
                          }}
                        >
                          ✔ Use
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => { setShowNewCategory(false); setNewCategory(""); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                isInvalid={!!errors.image}
              />
              <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
              {formData.image && (
                <div className="mt-2 text-center">
                  <img
                    src={formData.image}
                    alt="Preview"
                    style={{ maxHeight: "150px", maxWidth: "100%", objectFit: "contain", border: "1px solid #ddd", borderRadius: "8px", padding: "8px" }}
                    onError={e => e.target.style.display = "none"}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock count</Form.Label>
              <Form.Control
                type="number"
                name="count"
                value={formData.count}
                onChange={handleChange}
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="success" className="flex-grow-1">
                💾 Save changes
              </Button>
              <Link to="/admin/maintain-products">
                <Button variant="outline-danger">Cancel</Button>
              </Link>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditProduct;