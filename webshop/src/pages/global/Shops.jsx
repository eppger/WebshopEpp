import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Button, Form, Badge } from 'react-bootstrap'
import ChangeView from '../../components/ChangeView'
import shopsData from '../../data/shops.json'

const CITIES = [
  { key: 'tallinn', label: 'Tallinn', center: [59.436, 24.755], zoom: 12 },
  { key: 'tartu',   label: 'Tartu',   center: [58.370, 26.710], zoom: 13 },
  { key: 'haapsalu',label: 'Haapsalu',center: [58.943, 23.541], zoom: 14 },
]

function Shops() {
  const [activeCity, setActiveCity] = useState('tallinn')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)

  const currentCity = CITIES.find(c => c.key === activeCity)

  const filteredShops = shopsData.filter(shop => {
    const matchCity = shop.city === activeCity
    const matchSearch =
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.address.toLowerCase().includes(search.toLowerCase())
    return matchCity && matchSearch
  })

  return (
    <div className="page-wrapper">
      <h2 className="page-title">Shops</h2>

      {/* Linna valik */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {CITIES.map(city => (
          <button
            key={city.key}
            onClick={() => { setActiveCity(city.key); setSearch(''); setExpandedId(null) }}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: activeCity === city.key ? '#111' : '#d1d5db',
              backgroundColor: activeCity === city.key ? '#252840' : '#fff',
              color: activeCity === city.key ? '#fff' : '#374151',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {city.label}
            <Badge
              style={{
                marginLeft: '8px',
                backgroundColor: activeCity === city.key ? '#fff' : '#e5e7eb',
                color: activeCity === city.key ? '#ffffff' : '#ffffff',
                fontWeight: '600',
                fontSize: '0.72rem'
              }}
            >
              {shopsData.filter(s => s.city === city.key).length}
            </Badge>
          </button>
        ))}
      </div>

      {/* Kaart */}
      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #e5e7eb', marginBottom: '28px' }}>
        <MapContainer
          center={currentCity.center}
          zoom={currentCity.zoom}
          scrollWheelZoom={false}
          style={{ height: '320px', width: '100%' }}
        >
          <ChangeView center={currentCity.center} zoom={currentCity.zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredShops.map(shop => (
            <Marker key={shop.id} position={[shop.lat, shop.lng]}>
              <Popup>
                <strong>{shop.name}</strong><br />
                {shop.address}<br />
                🕐 {shop.hours}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Otsing */}
      <div className="section-card mb-4">
        <Form.Control
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
      </div>

      {/* Poodide nimekiri */}
      {filteredShops.length === 0 ? (
        <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          No shops found.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {filteredShops.map(shop => (
            <div
              key={shop.id}
              className="section-card"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h6 style={{ fontWeight: '700', color: '#111', margin: 0 }}>
                  {shop.name.split('— ')[1] || shop.name}
                </h6>
                <span style={{ color: '#252840', fontSize: '0.8rem', fontWeight: '500' }}>
                  {shop.address.split(',')[0]}
                </span>
              </div>

              <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '0 0 12px' }}>
                📍 {shop.address}
              </p>

              {expandedId === shop.id ? (
                <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '12px' }}>
                  <div className="mb-1">📞 {shop.phone}</div>
                  <div>🕐 {shop.hours}</div>
                </div>
              ) : null}

              <Button
                variant={expandedId === shop.id ? 'outline-secondary' : 'outline-primary'}
                size="sm"
                onClick={() => setExpandedId(expandedId === shop.id ? null : shop.id)}
              >
                {expandedId === shop.id ? 'Hide details' : 'View contact info'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Shops