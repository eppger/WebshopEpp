import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import logoLight from '../assets/Haapsalu light.svg'

function NavigationBar() {
  const { totalItems } = useCart()
  const [adminOpen, setAdminOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const closeAll = () => {
    setMenuOpen(false)
    setAdminOpen(false)
  }

  return (
    <nav className="navbar-custom">

      {/* Brand */}
      <NavLink to="/" className="navbar-brand-custom" onClick={closeAll}>
        <img src={logoLight} alt="WebShop" height={36} />
      </NavLink>

      {/* Hamburger nupp — nähtav ainult mobiilis */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Lingid */}
      <div className={`navbar-links${menuOpen ? ' navbar-links--open' : ''}`}>
        <NavLink to="/" className="nav-link-custom" end onClick={closeAll}>
          Home
        </NavLink>
        <NavLink to="/shops" className="nav-link-custom" onClick={closeAll}>
          Shops
        </NavLink>
        <NavLink to="/cart" className="nav-link-custom" onClick={closeAll}>
          Cart 
          { totalItems  > 0  &&  <span className="nav-badge"> { totalItems }  </span>}
        </NavLink>
        <NavLink to="/contact" className="nav-link-custom" onClick={closeAll}>
          Contact
        </NavLink>

        {/* Admin dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="nav-dropdown-btn"
            onClick={() => setAdminOpen(!adminOpen)}
            onBlur={() => setTimeout(() => setAdminOpen(false), 150)}
          >
            Admin {adminOpen ? '▲' : '▼'}
          </button>
          {adminOpen && (
            <div className="nav-dropdown-menu">
              <NavLink to="/admin" className="nav-dropdown-item" onClick={closeAll}>Admin Home</NavLink>
              <NavLink to="/admin/add-product" className="nav-dropdown-item" onClick={closeAll}>Add Product</NavLink>
              <NavLink to="/admin/maintain-products" className="nav-dropdown-item" onClick={closeAll}>Manage Products</NavLink>
              <NavLink to="/admin/maintain-categories" className="nav-dropdown-item" onClick={closeAll}>Manage Categories</NavLink>
              <NavLink to="/admin/maintain-shops" className="nav-dropdown-item" onClick={closeAll}>Manage Shops</NavLink>
            </div>
          )}
        </div>

        <div className="nav-divider" />

        <NavLink to="/login" className="nav-link-custom" onClick={closeAll}>
          Login
        </NavLink>
        <NavLink to="/signup" className="nav-btn-register" onClick={closeAll}>
          Register
        </NavLink>
      </div>
    </nav>
  )
}

export default NavigationBar