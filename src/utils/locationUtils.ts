import config from "@/config"
import { OSMQueryResult } from "@/types"
import api from "@/utils/api"

type SearchForLocationProps = {
    query: string,
    maxResults?: number
}
function searchForLocation(props: SearchForLocationProps): Promise<OSMQueryResult[]> {
    const { 
        query, 
        maxResults=5 
    } = props
    return new Promise(((r) => {
        api.get(
            config.OSMBaseUrl + '/search',
            {
                params: {
                    q: query,
                    format: 'json',
                    limit: maxResults
                }
            }
        ).then((config) => {
            const data = config.data
            // Transform lat and lon fields to numbers
            const ret = data.map((entry: OSMQueryResult) => ({
                ...entry,
                lat: Number(entry.lat),
                lon: Number(entry.lon)
            }))
            r(ret)
        })
    })) 
}
export {
    searchForLocation
}