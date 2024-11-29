import { LatLng } from "leaflet"

type Witness = {
    name: string,
    phoneNumber: string
}
type IncidentLocation = {
    name?: string,
    address?: string,
    latlng?: LatLng, // Should be able to get this from map events
    radiusMeters?: Number // We can remove this one, but if you want to draw a 'radius' on the map, we will need it
}
type EmergencyReportFormData = {
    emergencyDesc: string,
    location: IncidentLocation,
    pictureLink: string, // @Kyaahn this should be a base64 string
    comments: string | string[] // @Kyaahn depending on how you want to do this field in submission, you can make it one large string or multiple
}
type Incident = EmergencyReportFormData & {
    id: number; // Something to uniquely identify incidents. Probably generate a uuid of sufficient length for this
    date: Date;
    status: IncidentStatus
}
type IncidentStatus = 'open' | 'resolved'
type OSMQueryResult = {
    place_id: Number,
    licence: string,
    osm_type: string,
    osm_id: Number,
    place_rank: Number,
    importance: Number,
    lat: number,
    lon: number,
    class: string,
    type: string, // I've seen house, city, administrative
    addresstype: string,
    name: string,
    display_name: string,
    boundingbox: [
        string,
        string,
        string,
        string
    ]
}


export {
    Witness,
    IncidentLocation,
    EmergencyReportFormData,
    Incident,
    IncidentStatus,
    OSMQueryResult
}