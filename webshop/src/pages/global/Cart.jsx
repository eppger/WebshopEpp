import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { Button, Image, Form, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart()

  const [parcelMachines, setParcelMachines] = useState([])
  const [country, setCountry] = useState('EE')
  const [selectedMachine, setSelectedMachine] = useState('')
  const [loadingMachines, setLoadingMachines] = useState(true)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetch('https://www.omniva.ee/locations.json')
      .then(res => res.json())
      .then(json => {
        setParcelMachines(json)
        setLoadingMachines(false)
      })
      .catch(() => setLoadingMachines(false))
  }, [])

  // ✅ useEffect EEMALDATUD — setCountry käitlejas otse
  const handleCountryChange = (c) => {
    setCountry(c)
    setSelectedMachine('')
  }

  const filteredMachines = parcelMachines.filter(pm => pm.A0_NAME === country)

  const handlePayment = () => {
    if (!selectedMachine) {
      alert('Please select a parcel machine first!')
      return
    }
    setPaying(true)
    const paymentUrl = 'https://igw-demo.every-pay.com/api/v4/payments/oneoff'
    const paymentBody = {
      account_name: 'EUR3D1',
      nonce: '555' + new Date() + Math.random(),
      timestamp: new Date(),
      amount: totalPrice,
      order_reference: 'order-' + Math.random(),
      customer_url: window.location.origin,
      api_username: 'e36eb40f5ec87fa2'
    }
    fetch(paymentUrl, {
      method: 'POST',
      body: JSON.stringify(paymentBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZTM2ZWI0MGY1ZWM4N2ZhMjo3YjkxYTNiOWUxYjc0NTI0YzJlOWZjMjgyZjhhYzhjZA=='
      }
    })
      .then(res => res.json())
      .then(json => { window.location.href = json.payment_link })
      .catch(() => {
        alert('Payment failed. Please try again.')
        setPaying(false)
      })
  }

  if (cart.length === 0) {
    return (
      <div className="page-wrapper text-center" style={{ paddingTop: '80px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛒</div>
        <h4 style={{ color: '#111', fontWeight: '600', marginBottom: '8px' }}>Your cart is empty</h4>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>Add some products to get started.</p>
        <Link to="/"><Button variant="primary">← Back to shop</Button></Link>
      </div>
    )
  }

  return (
    <div className="page-wrapper">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="page-title mb-1">Shopping Cart</h2>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
        <Button variant="outline-danger" size="sm" onClick={clearCart}>🗑️ Clear cart</Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ===== TOOTED ===== */}
        <div>
          <div className="section-card p-0" style={{ overflow: 'hidden' }}>

            {/* Päis — ainult suurel ekraanil */}
            <div className="d-none d-md-grid" style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              padding: '12px 16px',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {/* Tooted */}
            {cart.map((item, idx) => (
              <div key={item.id} style={{
                borderBottom: idx < cart.length - 1 ? '1px solid #f3f4f6' : 'none',
                padding: '14px 16px'
              }}>
                {/* Mobiil: kaart */}
                <div className="d-flex d-md-none gap-3 align-items-start">
                  <Image
                    src={item.image}
                    width={60}
                    height={60}
                    style={{ objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '4px', background: '#fff', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#111', marginBottom: '6px' }}>
                      {item.name || item.title}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '8px' }}>
                      {item.price.toFixed(2)} € / tk
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-2">
                        <Button size="sm" variant="outline-secondary"
                          style={{ width: '28px', height: '28px', padding: 0, lineHeight: 1 }}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</Button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                        <Button size="sm" variant="outline-secondary"
                          style={{ width: '28px', height: '28px', padding: 0, lineHeight: 1 }}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        <span style={{ fontWeight: '700', color: '#111' }}>
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                        <Button size="sm" variant="outline-danger"
                          style={{ width: '28px', height: '28px', padding: 0, lineHeight: 1 }}
                          onClick={() => removeFromCart(item.id)}>×</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop: rida */}
                <div className="d-none d-md-grid align-items-center" style={{
                  gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '8px'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <Image src={item.image} width={52} height={52}
                      style={{ objectFit: 'contain', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '4px', background: '#fff' }} />
                    <span style={{ fontWeight: '500', color: '#111', fontSize: '0.9rem' }}>{item.name || item.title}</span>
                  </div>
                  <span style={{ color: '#6b7280' }}>{item.price.toFixed(2)} €</span>
                  <div className="d-flex align-items-center gap-2">
                    <Button size="sm" variant="outline-secondary"
                      style={{ width: '28px', height: '28px', padding: 0, lineHeight: 1 }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</Button>
                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                    <Button size="sm" variant="outline-secondary"
                      style={{ width: '28px', height: '28px', padding: 0, lineHeight: 1 }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  </div>
                  <span style={{ fontWeight: '600', color: '#111' }}>{(item.price * item.quantity).toFixed(2)} €</span>
                  <Button size="sm" variant="outline-danger"
                    style={{ width: '28px', height: '28px', padding: 0, lineHeight: 1 }}
                    onClick={() => removeFromCart(item.id)}>×</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Link to="/"><Button variant="outline-secondary" size="sm">← Continue shopping</Button></Link>
          </div>
        </div>

        {/* ===== DELIVERY + ORDER SUMMARY ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '480px' }}>

          {/* Pakiautomaat */}
          <div className="section-card">
            <h6 style={{ fontWeight: '700', marginBottom: '14px', color: '#111' }}>📦 Delivery</h6>
            <div className="d-flex gap-2 mb-3">
              {['EE', 'LV', 'LT'].map(c => (
                <button key={c} onClick={() => handleCountryChange(c)} style={{
                  flex: 1, padding: '6px', borderRadius: '7px', border: '1px solid',
                  borderColor: country === c ? '#2563eb' : '#d1d5db',
                  backgroundColor: country === c ? '#2563eb' : '#fff',
                  color: country === c ? '#fff' : '#374151',
                  fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  {c === 'EE' ? 'Estonia' : c === 'LV' ? 'Latvia' : 'Lithuania'}
                </button>
              ))}
            </div>
            {loadingMachines ? (
              <div className="text-center py-2">
                <Spinner animation="border" size="sm" style={{ color: '#2563eb' }} />
                <span style={{ color: '#6b7280', fontSize: '0.85rem', marginLeft: '8px' }}>Loading...</span>
              </div>
            ) : (
              <Form.Select value={selectedMachine} onChange={e => setSelectedMachine(e.target.value)}>
                <option value="">Select parcel machine...</option>
                {filteredMachines.map(pm => (
                  <option key={pm.NAME} value={pm.NAME}>{pm.NAME}</option>
                ))}
              </Form.Select>
            )}
            {selectedMachine && (
              <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#eff6ff', borderRadius: '7px', fontSize: '0.82rem', color: '#2563eb' }}>
                ✅ {selectedMachine}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="section-card">
            <h6 style={{ fontWeight: '700', marginBottom: '16px', color: '#111' }}>Order Summary</h6>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              <span>Subtotal ({totalItems} items)</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              <span>Delivery</span>
              <span style={{ color: '#16a34a' }}>Free</span>
            </div>
            <hr style={{ borderColor: '#e5e7eb', margin: '14px 0' }} />
            <div className="d-flex justify-content-between mb-4" style={{ fontWeight: '700', fontSize: '1.05rem', color: '#111' }}>
              <span>Total</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </div>
            <Button variant="primary" size="lg" className="w-100" onClick={handlePayment} disabled={paying || !selectedMachine}>
              {paying ? <><Spinner animation="border" size="sm" className="me-2" />Processing...</> : 'Pay now'}
            </Button>
            {!selectedMachine && (
              <p style={{ fontSize: '0.8rem', color: '#f59e0b', textAlign: 'center', marginTop: '12px' }}>
                ⚠️ Select a parcel machine to continue
              </p>
            )}
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
              🔒 Secure payment via EveryPay
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart