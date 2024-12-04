import { useState, useRef, useEffect, LegacyRef, FormEvent, MouseEvent } from 'react';
import { Circle, LayerGroup, LayersControl, MapContainer, Popup as PopupElement, TileLayer, useMapEvents, ZoomControl } from 'react-leaflet';
import { searchForLocation } from '@/utils/locationUtils';
import { DragEndEvent, LatLng, LeafletMouseEvent, Map, Marker, Popup,  } from 'leaflet';
import { Marker as MarkerElement } from 'react-leaflet'
import config from '@/config';
import useAppContext from '@/hooks/useAppContext';
import { beginIncidentCreationFn, Incident, mapPosition } from '@/types';
import { condStr, curry, getMapIcon, latLngsEqual } from '@/utils/miscUtils';

type FormMapProps = {
  markerLatLng: LatLng
  setMarkerLatLng: (newPosition: LatLng) => void
  addressConfirmed: boolean
  handleMarkerConfirmed: () => void
  handleMarkerDenied: () => void
  loading: boolean
}
const FormMap = ({ 
  loading,
  markerLatLng,
  setMarkerLatLng,
  handleMarkerConfirmed,
  handleMarkerDenied,
  addressConfirmed
}: FormMapProps) => {
  const [map, setMap] = useState<Map>()
  const inputRef = useRef<HTMLInputElement>()
  const markerInCreationPopupRef = useRef()
  
  useEffect(() => {
    if (!markerLatLng || !markerInCreationPopupRef.current) return
    const sameAsCurrent = latLngsEqual(
      markerInCreationPopupRef?.current?.getLatLng(),
      markerLatLng
    )
    if (sameAsCurrent) {
      return
    }
    panMapToLatLng(markerLatLng)
  },[markerLatLng])

  const MapEvents = () => {
    useMapEvents({
      click: handleMapClicked
      
    });
    return null;
  };
  function handleMapClicked(e: LeafletMouseEvent) {
    // placeCandidateMarker(e.latlng)
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

  function placeCandidateMarker(latLng: LatLng) {
    setMarkerLatLng(latLng)
    panMapToLatLng(latLng) // Pan map to new marker
  }
  
  function handleMapReady(mapCreationEvent) {
    const newMap = mapCreationEvent.target
    setMap(newMap)
  }

  return (
    <div className={`w-full h-[21rem] rounded-2xl flex flex-col overflow-hidden relative mt-4 ${condStr(loading,'disabled pointer-events-none ')}`}>
        <div className={`absolute w-full h-full  flex justify-center items-center top-0 left-0 bg-black transition-opacity bg-opacity-60 z-[20000] ${loading ? 'opacity-100 pointer-events-auto' : 'opacity-0  pointer-events-none '}`}>
          <div className="loading loading-lg loading-spinner"></div>
        </div>
      {/* Bar to enter address */}
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
        { markerLatLng && (
          <MarkerCandidate
            needsConfirmation={!addressConfirmed}
            map={map}
            popupRef={markerInCreationPopupRef}
            candidate={markerLatLng}
            setCandidate={setMarkerLatLng}
            onLocationConfirm={handleMarkerConfirmed}
            onLocationDeny={handleMarkerDenied}
          />
        )}
        <MapEvents />
      </MapContainer>
      {/* <MarkersList {...{markers, visibleMarkers, handleDeleteMarker}}/> */}
    </div>
  );
};

const MarkerCandidate = ({ map, popupRef, candidate, setCandidate, needsConfirmation, onLocationConfirm, onLocationDeny }) => {
  const [popupReady, setPopupReady] = useState(false)
  const markerRef = useRef<Marker>()

  useEffect(() => {
    forcePopupOpen()
  },[candidate, popupReady])
  
  function forcePopupOpen() {
    if (popupReady && needsConfirmation) {
      popupRef.current.openOn(map)
    }
  }

  function handlePopupReady(newRef) {
    setPopupReady(true)
    popupRef.current = newRef
  }

  function handleConfirmedClicked(e: MouseEvent) {
    e.stopPropagation()
    popupRef.current._closeButton.click()
    onLocationConfirm()
    return false
  }

  function handleCancelClicked(e: MouseEvent) {
    e.stopPropagation()
    
    onLocationDeny()
    return false
  }

  function handleMarkerDragEnd(e: DragEndEvent) {
    const newMarkerPosition = markerRef.current.getLatLng()
    setCandidate(newMarkerPosition)
    forcePopupOpen()
  }

  return (
    <MarkerElement 
      ref={markerRef}
      eventHandlers={{ dragend: handleMarkerDragEnd,   }}
      position={[candidate.lat,candidate.lng]}
      draggable
      icon={getMapIcon(`stroke-[20px] stroke-black ${needsConfirmation ? 'text-cyan-500' : 'text-emerald-500'}`)}
      >
      { needsConfirmation && (
        <PopupElement
          // eventHandlers={{}}
          autoPan={false}
          keepInView={false}
          closeOnClick={false}
          autoClose={false}
          ref={handlePopupReady}
          className='custom-popup text-emerald-800 from-slate-200'
        >
          <div className="leaflet-fade-anim card card-compact pointer-events-auto w-[10rem] bg-base-300 text-center">
            <div className="p-4 flex gap-4 items-center">
              <button onClick={handleConfirmedClicked} className='btn btn-sm flex-1 btn-success'>
                <CheckIcon/>
              </button>
              <button onClick={handleCancelClicked} className='btn btn-sm  flex-1 btn-error'>
                <XIcon/>
              </button>
            </div>
          </div>
        </PopupElement>
      )}
  </MarkerElement>
  )
}

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)
const CheckIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="m6 10l-2 2l6 6L20 8l-2-2l-8 8z"/></svg>
)


export default FormMap;