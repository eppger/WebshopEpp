import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom])
  return null
}

export default ChangeView