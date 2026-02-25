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
        <h2>Toodete haldus</h2>
        <Link to="/admin/add-product">
          <Button variant="success">+ Lisa uus toode</Button>
        </Link>
      </div>

      {/* Otsing */}
      <InputGroup className="mb-3" style={{ maxWidth: "400px" }}>
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Otsi toote nimetuse järgi..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button variant="outline-secondary" onClick={() => setSearchQuery("")}>✕</Button>
        )}
      </InputGroup>

      <p className="text-muted">
        Kokku tooteid: <strong>{filteredProducts.length}</strong>
        {searchQuery && <span className="text-primary ms-2">(otsing: "{searchQuery}")</span>}
      </p>

      <Table striped bordered hover responsive size="sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Pilt</th>
            <th>Nimetus</th>
            <th>Hind</th>
            <th>Kategooria</th>
            <th>Kirjeldus</th>
            <th>Reiting</th>
            <th>Muuda</th>
            <th>Kustuta</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center text-muted py-4">
                Ühtegi toodet ei leitud otsisõnaga "<strong>{searchQuery}</strong>"
              </td>
            </tr>
          ) : null}
          {filteredProducts.map((product, index) => (
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.id}</td>

              {/* Pilt */}
              <td>
                <Image
                  src={product.image}
                  alt={product.title}
                  style={{ width: "50px", height: "50px", objectFit: "contain" }}
                />
              </td>

              {/* Nimetus */}
              <td style={{ maxWidth: "200px" }}>
                <span title={product.title}>
                  {product.title.length > 40
                    ? product.title.substring(0, 40) + "..."
                    : product.title}
                </span>
              </td>

              {/* Hind */}
              <td className="text-success fw-bold">
                {product.price.toFixed(2)} €
              </td>

              {/* Kategooria */}
              <td>
                <Badge bg="secondary">{product.category}</Badge>
              </td>

              {/* Kirjeldus */}
              <td style={{ maxWidth: "200px", fontSize: "0.8rem", color: "#666" }}>
                {product.description.length > 60
                  ? product.description.substring(0, 60) + "..."
                  : product.description}
              </td>

              {/* Reiting */}
              <td>
                <div>
                  <span className="text-warning">⭐</span>
                  <strong> {product.rating.rate}</strong>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>
                  ({product.rating.count} hinnangut)
                </div>
              </td>

              {/* Muuda */}
              <td>
                <Link to={`/admin/edit-product/${product.id}`}>
                  <Button variant="warning" size="sm">✏️ Muuda</Button>
                </Link>
              </td>

              {/* Kustuta */}
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteProduct(index)}
                >
                  🗑️ Kustuta
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  )
}

export default MaintainProducts