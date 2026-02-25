import { Link } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import whiteLady from '../../assets/Haapsalu.png'
import './NotFound.css'

function NotFound() {
  return (
    <div className="notfound-wrapper">

      <Container className="notfound-container text-center text-white">

        <div className="notfound-image-wrapper">
          <img src={whiteLady} alt="Haapsalu Valge Daam" className="notfound-image" />
        </div>

        <h1 className="notfound-404">404</h1>

        <h2 className="notfound-title">
          Valge Daam ei leidnud seda lehte
        </h2>

        <p className="notfound-description">
          Nagu Haapsalu lossi salapärane Valge Daam, on see leht kadunud udusse... <br />
          Ehk otsid hoopis meie toodete seast midagi ilusat? 🏰
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/">
            <Button className="notfound-btn-primary">
              🏠 Tagasi avalehele
            </Button>
          </Link>
          <Link to="/shops">
            <Button className="notfound-btn-outline">
              🛍️ Vaata poode
            </Button>
          </Link>
        </div>


      </Container>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>

    </div>
  )
}

export default NotFound