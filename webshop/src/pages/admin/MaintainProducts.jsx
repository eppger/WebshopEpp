import { useState } from "react";
import productsDb from "../../data/products.json";
import { Link } from "react-router-dom";
import { Container, Table, Button, Badge, Image, Form, InputGroup } from "react-bootstrap";

function MaintainProducts() {
  const [products, setProducts] = useState(() => {
  const saved = localStorage.getItem("products");
  return saved ? JSON.parse(saved) : productsDb;
});


  const [searchQuery, setSearchQuery] = useState("");

function deleteProduct(index) {
  const updated = products.filter((_, i) => i !== index);
  localStorage.setItem("products", JSON.stringify(updated));
  setProducts(updated);
}

  // Filtreeri otsisõna järgi (.title sees)
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Manage Products ({filteredProducts.length})</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={() => { localStorage.removeItem("products"); setProducts(productsDb); }}>
            Restore original
          </Button>
          <Link to="/admin/add-product">
            <Button variant="success">+ Add new product</Button>
          </Link>
        </div>
      </div>

      {/* Otsing */}
      <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by product name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button variant="outline-secondary" onClick={() => setSearchQuery("")}>✕</Button>
        )}
      </InputGroup>

      {searchQuery && (
        <p className="text-muted">
          <span className="text-primary">Search: "{searchQuery}"</span>
          {' — '}<strong>{filteredProducts.length}</strong> result(s)
        </p>
      )}

      <style>{`
        .products-table thead th {
          background-color: #f5f5f5 !important;
          color: #555 !important;
          font-weight: 600;
          font-size: 0.78rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border: none !important;
          border-bottom: 2px solid #e0e0e0 !important;
          padding: 10px 8px;
        }
        .products-table tbody tr {
          background-color: #fff !important;
          border-bottom: 1px solid #e8e8e8 !important;
        }
        .products-table tbody tr:hover {
          background-color: #f9f9f9 !important;
        }
        .products-table td {
          border-color: #e8e8e8 !important;
          vertical-align: middle;
        }
        .products-table {
          border: 1px solid #e0e0e0 !important;
        }
      `}</style>

      <Table responsive size="sm" className="products-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Index</th>
            <th>Product</th>
            <th>Price</th>
            <th>Category</th>
            <th>Description</th>
            <th>Rating</th>
            <th>Image</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center text-muted py-4">
                No products found for "<strong>{searchQuery}</strong>"
              </td>
            </tr>
          ) : null}
          {filteredProducts.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{index}</td>

              {/* Product name + stock count */}
              <td style={{ maxWidth: "200px" }}>
                <div style={{ fontWeight: '600' }} title={product.title}>
                  {product.title.length > 30
                    ? product.title.substring(0, 30) + "..."
                    : product.title}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>
                  📦 {product.rating?.count ?? 0} in stock
                </div>
              </td>

              {/* Price */}
              <td className="text-success fw-bold">
                {product.price.toFixed(2)} €
              </td>

              {/* Category */}
              <td>
                <Badge bg="secondary">{product.category}</Badge>
              </td>

              {/* Description */}
              <td style={{ maxWidth: "200px", fontSize: "0.8rem", color: "#666" }}>
                {product.description.length > 60
                  ? product.description.substring(0, 60) + "..."
                  : product.description}
              </td>

              {/* Rating */}
              <td>
                <div><span className="text-warning">⭐</span> <strong>{product.rating.rate}</strong></div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>({product.rating.count} reviews)</div>
              </td>

              {/* Image */}
              <td>
                <Image
                  src={product.image}
                  alt={product.title}
                  style={{ width: "40px", height: "40px", objectFit: "contain" }}
                />
              </td>

              {/* Delete */}
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteProduct(index)}
                >
                  Delete
                </Button>
              </td>

              {/* Edit */}
              <td>
                <Link to={`/admin/edit-product/${product.id}`}>
                  <Button variant="outline-success" size="sm">Edit</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default MaintainProducts