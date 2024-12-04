import { LatLngExpression } from "leaflet"
import { hashPassword } from "./utils/miscUtils"

const config = {
    MarkerZoomAmount: 16,
    OSMBaseUrl: import.meta.env.VITE_OSM_BASE_URL,
    defaultCoordinates: [49.250025, -122.989051] as LatLngExpression,
    password: hashPassword("test")
}

export default config