import config from "@/config";
import { hashPassword } from "@/utils/miscUtils";
import { createContext, useContext, useEffect, useState } from "react";
import { Incident } from "@/types";
import { loadIncidentsFromLocalStorage } from "@/utils/localStorageUtils";

type Context = {
    isLoggedIn: boolean,
    loading: boolean,
    login: (password: string) => void,
    currentIncidents: Incident[] | undefined,
    addIncident: (newIncident: Incident) => void,
    resolveIncident: (incidentIDToResolve: Number) => void
}
const initialState: Context = {
    isLoggedIn: false,
    loading: true,
    login: () => {},
    currentIncidents: undefined,
    addIncident: () => {},
    resolveIncident: () => {}
}
const AppContext = createContext<Context>(initialState)

export const AppContextProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentIncidents, setCurrentIncidents] = useState<Incident[]>()

    // This will run once at the start of the app, initializing the list of current incidents from localstorage
    useEffect(() => init(),[])

    function init() {
        const loadedIncidents = loadIncidentsFromLocalStorage()
        setCurrentIncidents(loadedIncidents)
        console.log('loaded incidents:', loadedIncidents);
    }
    
    function login(password: string) {
        const hashedPassword = hashPassword(password)
        if (hashedPassword === config.hashedPassword) {
            setIsLoggedIn(true)
            console.log('LOGIN SUCCESS');
        } else {
            console.log('LOGIN FAIL: password hash did not match');
        }
    }

    function addIncident(newIncident: Incident) {
        // 1 add new incident to app state
        setCurrentIncidents((prev) => [...prev, newIncident])
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
        isLoggedIn,
        login,
        currentIncidents,
        addIncident,
        resolveIncident,
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