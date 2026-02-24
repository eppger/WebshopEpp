import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          WebShop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Avaleht
            </Nav.Link>
            <Nav.Link as={NavLink} to="/shops">
              Poed
            </Nav.Link>
            <Nav.Link as={NavLink} to="/cart">
              🛒 Ostukorv
            </Nav.Link>
            <Nav.Link as={NavLink} to="/contact">
              Kontakt
            </Nav.Link>
          </Nav>

          {/* Admin dropdown */}
          <Nav className="me-auto">
            <NavDropdown title="Admin" id="admin-dropdown">
              <NavDropdown.Item as={NavLink} to="/admin">
                Admin avaleht
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/admin/add-product">
                Lisa toode
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/admin/maintain-products">
                Halda tooteid
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/admin/maintain-categories">
                Halda kategooriaid
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/admin/maintain-shops">
                Halda poode
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* Auth nupud */}
          <Nav>
            <Nav.Link as={NavLink} to="/login">
              Logi sisse
            </Nav.Link>
            <Nav.Link as={NavLink} to="/signup">
              Registreeru
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar