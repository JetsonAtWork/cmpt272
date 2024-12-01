import config from "@/config";
import {hashPassword, seedCurrentIncidents} from "@/utils/miscUtils";
import { createContext, useContext, useEffect, useState } from "react";
import { Incident } from "@/types";
import { loadIncidentsFromLocalStorage } from "@/utils/localStorageUtils";

type Context = {
    loading: boolean,
    currentIncidents: Incident[] | undefined,
    selectedIncident: number | null,
    setSelectedIncident: (newSelectedIncident: number | null) => void,
    addIncident: (newIncident: Incident) => void,
    resolveIncident: (incidentIDToResolve: Number) => void,
    isMacOS: boolean
}
const initialState: Context = {
    loading: true,
    currentIncidents: undefined,
    selectedIncident: null,
    setSelectedIncident: () => {},
    addIncident: () => {},
    resolveIncident: () => {},
    isMacOS: false
}
const AppContext = createContext<Context>(initialState)

export const AppContextProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentIncidents, setCurrentIncidents] = useState<Incident[]>()
    const [selectedIncident, setSelectedIncident] = useState<number | null>();
    const [isMacOS, setIsMacOS] = useState(false)

    // This will run once at the start of the app, initializing the list of current incidents from localstorage
    useEffect(() => init(),[])

    function init() {
        const loadedIncidents = loadIncidentsFromLocalStorage()
        setCurrentIncidents(loadedIncidents);
        setCurrentIncidents(seedCurrentIncidents());
        const isMac = navigator.userAgent.includes('Mac OS X')
        setIsMacOS(isMac)
        console.log('loaded incidents:', loadedIncidents);
    }
    

    function addIncident(newIncident: Incident) {
        // 1 add new incident to app state
        setCurrentIncidents((prev) => prev ? [...prev, newIncident] : [newIncident]);
        // 2 write new incident to localstorage
        // @Kyaahn I'll leave this to your judgement
    }
    
    function resolveIncident(incidentIDToResolve: Number) {
        // 1 modify incident in app state
        const newIncidentArray: Incident[] = currentIncidents.map((incident) => 
            incident.id === incidentIDToResolve
                ? {...incident, status: 'resolved'}
                : incident
        )
        setCurrentIncidents(newIncidentArray)
        // 2 write modified incident to localstorage
        // @Kyaahn I'll leave this to your judgement
    }

    const value = {
        currentIncidents,
        selectedIncident,
        setSelectedIncident,
        addIncident,
        resolveIncident,
        isMacOS,
        loading: currentIncidents == null // Check for this being true to show some kind of loading state or prevent logic where you're operating on currentIncidents
    }

    return (
        <AppContext.Provider value={value}
        >
            {children}
        </AppContext.Provider>

    )
}
const useAppContext = () => useContext(AppContext)
export default useAppContext