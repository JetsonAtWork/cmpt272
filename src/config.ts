import { LatLngExpression } from "leaflet"

const config = {
    MarkerZoomAmount: 16,
    OSMBaseUrl: import.meta.env.VITE_OSM_BASE_URL,
    defaultCoordinates: [49.250025, -122.989051] as LatLngExpression

}

export default config