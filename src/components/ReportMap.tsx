import { useState, useRef, useEffect, LegacyRef, FormEvent, MouseEvent } from 'react';
import { Circle, LayerGroup, LayersControl, MapContainer, Popup as PopupElement, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { searchForLocation } from '@/utils/locationUtils';
import { DragEndEvent, LatLng, LeafletMouseEvent, Map, Marker, Popup,  } from 'leaflet';
import { Marker as MarkerElement } from 'react-leaflet'
import config from '@/config';
import useAppContext from '@/hooks/useAppContext';
import { beginIncidentCreationFn, Incident, mapPosition } from '@/types';
import { curry, getMapIcon } from '@/utils/miscUtils';

const ReportMap = () => {
  const [address, setAddress] = useState('');
  const [map, setMap] = useState<Map>()
  const inputRef = useRef<HTMLInputElement>()
  const { 
    isMacOS,
    selectedIncident,
    currentIncidents,
    setVisibleIncidents,
    loading,
    setSelectedIncident
   } = useAppContext()
  
  const handleSearch = async () => {
    try {
      const results = await searchForLocation({ query: address });
      if (results.length > 0) {
        const { lat, lon, display_name } = results[0]; // Extract name and coordinates
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

  const getBounds = () => {
    const bounds = map.getBounds();
    return bounds.extend([bounds.getSouth() - (0.035 * (bounds.getNorth() - bounds.getSouth())), bounds.getEast()]);
  }

  const MapEvents = () => {
    useMapEvents({
      moveend: () => {
        if (map) {
          const bounds = getBounds(); // Get current map bounds
          const visible = currentIncidents.filter((incident) =>
            bounds.contains(incident.location.latlng)
          ); // Filter markers within bounds
          setVisibleIncidents(visible);
        } else {}
      }
    });
    return null;
  };
  // console.log(markers);
// Updates list of visible markers whenever the markers array changes.
// It checks current map bounds using the map reference and filters markers that are within those bounds, then updates visibleMarkers state.
  useEffect(() => {
    if (map) {
      const bounds = getBounds(); // Get current map bounds
      const visible = currentIncidents.filter((incident) =>
        bounds.contains(incident.location.latlng)
      );
      setVisibleIncidents(visible);
    }
  }, [currentIncidents]);

  useEffect(() => {
    if (!loading && map) {
      const currentIncident = currentIncidents.find((incident) => incident.id === selectedIncident)
      if (!currentIncident) return
      panMapToLatLng(currentIncident.location.latlng)
    }
  },[selectedIncident])

  // Listen for keypresses to focus input
  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => window.removeEventListener('keydown', onKeyPress)
  },[])

  function onKeyPress(e: KeyboardEvent) {
    const acceptableModifierActive = e.ctrlKey || e.metaKey
    if (e.key === 'k' && acceptableModifierActive) {
      inputRef.current?.focus?.()
    }
  }

  function handleMarkerClicked(incident: Incident, e: LeafletMouseEvent) {
    setSelectedIncident(incident.id)
  }

  function panMapToLatLng(latLng: LatLng, zoomAmount?: number) {
    if (!map) {
      return
    }
    map.setView(
      latLng, 
      zoomAmount || map.getZoom() || config.MarkerZoomAmount, 
      { animate: true,   }
    )
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    handleSearch()
  }

  function handleMapReady(mapCreationEvent) {
    const newMap = mapCreationEvent.target
    setMap(newMap)
  }

  return (
    <div className='h-full rounded-2xl flex flex-col overflow-hidden relative'>
      {/* Bar to enter address */}
      <form onSubmit={handleSubmit} className="search-bar join flex absolute top-2 left-2 z-[500]">
        <label className='input input-bordered flex items-center !rounded-r-none' htmlFor="search">
          <input
            id='search'
            ref={inputRef}
            type="text"
            placeholder="Search Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="join-item max-w-xs !text-sm !w-64 bg-white !rounded-r-none"
          />
          <kbd className='kbd kbd-sm opacity-80 mr-1'>
            { isMacOS 
              ? '⌘' 
              : <CtrlIcon className='w-4 h-4'/> 
            }
          </kbd>
          <kbd className='kbd kbd-sm opacity-80'>
            k
          </kbd>
        </label>
        <button onClick={handleSearch} className="join-item btn !py-2 !px-2 btn-primary !rounded-l-none">
          <SearchIcon className='w-8 h-8'/>
        </button>
      </form>
      {/* Map */}
      <MapContainer
        whenReady={handleMapReady}
        style={{ height: '100%', width: '100%' }}
        center={config.defaultCoordinates}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <ZoomControl position='bottomright'/>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentIncidents?.map((incident, index) => (
          <IncidentMarker 
            key={incident.id} 
            incident={incident}
            selectedIncident={selectedIncident}
            onClick={curry(handleMarkerClicked, incident)}
            />
        ))}
        <MapEvents />
      </MapContainer>
    </div>
  );
};

const MarkerCandidate = ({ map, popupRef, candidate, setCandidate, onLocationConfirm, onLocationDeny }) => {
  const [popupReady, setPopupReady] = useState(false)
  const markerRef = useRef<Marker>()
  
  useEffect(() => {
    forcePopupOpen()
  },[popupReady])

  useEffect(() => {
    forcePopupOpen()
  },[candidate])
  
  function forcePopupOpen() {
    if (popupReady) {
      popupRef.openOn(map)
    }
  }

  function handlePopupReady(newRef) {
    setPopupReady(true)
    popupRef = newRef
  }

  function handleCancelClicked(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setCandidate(null)
  }

  function handleConfirmClicked() {
    popupRef._closeButton.click()
    onLocationConfirm()
  }

  function handleMarkerDragEnd(e: DragEndEvent) {
    const newMarkerPosition = markerRef.current.getLatLng()
    setCandidate((prev) => ({
      ...prev,
      lat: newMarkerPosition.lat,
      lon: newMarkerPosition.lng
    }))
    forcePopupOpen()
  }

  return (
    <MarkerElement 
      ref={markerRef}
      eventHandlers={{ dragend: handleMarkerDragEnd,   }}
      position={[candidate.lat, candidate.lon]}
      draggable
      >
      <PopupElement closeOnClick={false} autoClose={false} ref={handlePopupReady} className='custom-popup'>
        <div className="leaflet-fade-anim card card-compact pointer-events-auto min-w-[19rem] bg-base-300 text-center">
          <div className="card-body items-center">
            <div className="card-title w-fit text-primary">
              Confirm Incident Location
            </div>
            <p className='text-base-content tracking-wide font-medium !m-0'>Click and drag the marker if <br /> necessary</p>
            <div className="card-actions pt-2">
              <button onClick={handleConfirmClicked} className='btn btn-sm flex-1 btn-success'>
                <CheckIcon/>
              </button>
              <button onClick={handleCancelClicked} className='btn btn-sm  flex-1 btn-error'>
                <XIcon/>
              </button>
            </div>
          </div>
        </div>
      </PopupElement>
  </MarkerElement>
  )
}

type IncidentMarkerProps = {
  incident: Incident,
  selectedIncident: string
  onClick: (e: LeafletMouseEvent) => void
}
const IncidentMarker = ({ 
  incident,
  selectedIncident,
  onClick
}: IncidentMarkerProps) => {
  const [popupReady, setPopupReady] = useState(false)
  const popupRef = useRef<Popup>()
  const markerRef = useRef<Marker>()

  useEffect(() => {
    if (popupReady && selectedIncident === incident.id) {
      markerRef.current.openPopup()
    }
  },[selectedIncident, popupReady])

  function handlePopupReady(newRef) {
    setPopupReady(true)
    popupRef.current = newRef
  }
  return (
    <MarkerElement 
      position={incident.location.latlng}
      eventHandlers={{click: onClick}}
      icon={getMapIcon(`stroke-[20px] stroke-black ${selectedIncident === incident?.id ? 'text-secondary' : 'text-primary'}`)}
      ref={markerRef}
      >
      <PopupElement
        autoPan={false}
        keepInView={false}
        ref={handlePopupReady}
        className='custom-popup'
      > 
        <div className="leaflet-fade-anim rounded-2xl pointer-events-auto py-4 px-4 w-fit bg-base-300 text-center">
          <p className='text-primary text-2xl font-medium !m-0 whitespace-nowrap'>{incident.emergencyDesc}</p>
          <p className='whitespace-nowrap text-base-content !m-0'>{incident.location.address}</p>
        </div>
      </PopupElement>
  </MarkerElement>
  )
}

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)
const CheckIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"/></svg>
)
const SearchIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"/></g></svg>
)
const CtrlIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/></svg>
)

export default ReportMap;