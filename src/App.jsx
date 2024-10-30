import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
function App() {
  return (
    <>
      Let&apos;s do this
        <MapContainer style={{height: '100%'}} id='map' center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
          <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'          
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>

        </MapContainer>
    </>
  )
}

export default App
