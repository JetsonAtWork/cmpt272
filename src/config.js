const config = {
    OSMClientID: import.meta.env.VITE_OSM_CLIENT_ID,
    OSMClientSecret: import.meta.env.VITE_OSM_CLIENT_SECRET,
    passwordHash: 'spWrkadK5wSMC6UjwDUR4w==', // The password i'm using right now is 'verysecret'
    OAuth2ScopesString: "read_prefs write_prefs write_api read_gpx write_gpx write_notes write_diary write_redactions",
    OSMAccessTokenUrl: import.meta.env.VITE_OSM_ACCESS_TOKEN_URL,
    OSMAuthUrl: import.meta.env.VITE_OSM_AUTH_CODE_URL,
    OSMBaseUrl: import.meta.env.VITE_OSM_BASE_URL
}

export default config