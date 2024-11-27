import { useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { searchForLocation } from '@/utils/locationUtils';

const ReportMap = () => {
  const [markers, setMarkers] = useState([]); // All markers
  const [visibleMarkers, setVisibleMarkers] = useState([]); // Markers currently visible in the map bounds
  const [address, setAddress] = useState('');
  const mapRef = useRef(null); // Ref to access the map instance

  const handleSearch = async () => {
    try {
      const results = await searchForLocation({ query: address });
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0]; // Extract name and coordinates
        setMarkers((prevMarkers) => [
          ...prevMarkers,
          { lat, lon, name: display_name },
        ]); // Add the new marker with its name, other info needs to be added here
      } else {
        alert('Address not found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('There was an error searching for the location.');
    } finally {
      setAddress(''); // Clear the address bar after clicking send report button
    }
  };

  const handleDeleteMarker = (indexToRemove) => {
    setMarkers((prevMarkers) => prevMarkers.filter((_, index) => index !== indexToRemove)); // Remove marker from the list
  };

  const MapEvents = () => {
    useMapEvents({
      moveend: () => {
        const map = mapRef.current;
        if (map) {
          const bounds = map.getBounds(); // Get current map bounds
          const visible = markers.filter((marker) =>
            bounds.contains([marker.lat, marker.lon])
          ); // Filter markers within bounds
          setVisibleMarkers(visible);
        }
      },
    });
    return null;
  };

// Updates list of visible markers whenever the markers array changes.
// It checks current map bounds using the map reference and filters markers that are within those bounds, then updates visibleMarkers state.
  useEffect(() => {
    if (mapRef.current) {
      const bounds = mapRef.current.getBounds();
      const visible = markers.filter((marker) =>
        bounds.contains([marker.lat, marker.lon])
      );
      setVisibleMarkers(visible);
    }
  }, [markers]);

  return (
    <div>
      {/* Bar to enter address */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input input-bordered w-full max-w-xs text-black bg-white"
        />
        <button onClick={handleSearch} className="btn btn-primary ml-2">
          Send Report
        </button>
      </div>
      {/* Map */}
      <MapContainer
        ref={mapRef}
        style={{ height: '800px', width: '100%' }}
        center={[49.250025, -122.989051]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lon]}>
            <Popup>
              <strong>{marker.name}</strong>
              <br />
              Coordinates: {marker.lat}, {marker.lon}
            </Popup>
          </Marker>
        ))}
        <MapEvents />
      </MapContainer>
      {/* List of visible markers */}
		<div className="marker-list mt-4">
		  <h3 className="text-lg font-bold">Visible Markers</h3>
		  <ul className="list-none pl-0">
			{visibleMarkers.map((marker, index) => (
			  <li key={index} className="flex items-center space-x-2">
				{/* Delete button on the left */}
				<button
				  onClick={() => handleDeleteMarker(markers.indexOf(marker))}
				  className="btn btn-sm btn-error"
				>
				  X
				</button>
				{/* Marker details to the right of X button */}
				<span>
				  {marker.name} ({marker.lat.toFixed(5)}, {marker.lon.toFixed(5)})
				</span>
			  </li>
			))}
		  </ul>
		</div>
    </div>
  );
};

export default ReportMap;