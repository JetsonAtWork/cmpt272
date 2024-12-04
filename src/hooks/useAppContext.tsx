import { Incident } from "@/types";
import { loadIncidentsFromLocalStorage } from "@/utils/localStorageUtils";
import { createContext, useContext, useEffect, useState } from "react";

type Context = {
    loading: boolean;
    currentIncidents: Incident[] | undefined;
    addIncident: (newIncident: Incident) => void;
    resolveIncident: (incidentIDToResolve: string) => void;
    reopenIncident: (incidentIDToResolve: string) => void;
    visibleIncidents: Incident[] | undefined;
    setVisibleIncidents: (newVisibleIncidents: Incident[]) => void;
    deleteIncident: (incidentIDToDelete: string) => void;
    isMacOS: boolean;
    selectedIncident: string;
    setSelectedIncident: (incidentID: string) => void;
};
const initialState: Partial<Context> = {
    loading: true,
    currentIncidents: undefined,
    selectedIncident: null,
    visibleIncidents: undefined,
    isMacOS: false,
};
const AppContext = createContext<Partial<Context>>(initialState);

export const AppContextProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentIncidents, setCurrentIncidents] = useState<Incident[]>()
    const [selectedIncident, setSelectedIncident] = useState<string | null>();
    const [visibleIncidents, setVisibleIncidents] = useState<Incident[]>();
    const [isMacOS, setIsMacOS] = useState(false);

    // This will run once at the start of the app, initializing the list of current incidents from localstorage
    useEffect(() => init(), []);

    function init() {
        const loadedIncidents = loadIncidentsFromLocalStorage();
        setCurrentIncidents(loadedIncidents);
        console.log('loaded incidents:', loadedIncidents);
    }

    function addIncident(newIncident: Incident) {
        // 1 add new incident to app state
        setCurrentIncidents((prev) =>
            prev ? [...prev, newIncident] : [newIncident]
        );
        // 2 write new incident to localstorage
        const previousList = loadIncidentsFromLocalStorage();
        const newList = [...previousList, newIncident];
        localStorage.setItem("incidents", JSON.stringify(newList));
    }

    function resolveIncident(incidentIDToResolve: string) {
        // 1 modify incident in app state
        const newIncidentArray: Incident[] = currentIncidents.map((incident) =>
            incident.id === incidentIDToResolve
                ? { ...incident, status: "resolved" }
                : incident
        );
        setCurrentIncidents(newIncidentArray);
        // 2 write modified incident to localstorage
        const previousList = loadIncidentsFromLocalStorage();
        const newList = previousList.map((incident) =>
            incident.id === incidentIDToResolve
                ? { ...incident, status: "resolved" }
                : incident
        );
    }
    function reopenIncident(incidentIDToResolve: string) {
        // 1 modify incident in app state
        const newIncidentArray: Incident[] = currentIncidents.map((incident) =>
            incident.id === incidentIDToResolve
                ? { ...incident, status: "open" }
                : incident
        );
        setCurrentIncidents(newIncidentArray);
        // 2 write modified incident to localstorage
        const previousList = loadIncidentsFromLocalStorage();
        const newList = previousList.map((incident) =>
            incident.id === incidentIDToResolve
                ? { ...incident, status: "open" }
                : incident
        );
    }

    function deleteIncident(incidentIDToDelete: string) {
        // 1 delete incident in app state
        setCurrentIncidents((prev)=>
            prev ? prev.filter((incident) => incident.id !== incidentIDToDelete) : []
        )
        
        setSelectedIncident(null); //because we are deleting the selected incident
        
        // 2 write modified incident to localstorage
        const previousList = loadIncidentsFromLocalStorage()
        const newList = previousList.filter((incident) => incident.id !== incidentIDToDelete)
        localStorage.setItem("incidents", JSON.stringify(newList))
    }

    const value = {
        currentIncidents,
        selectedIncident,
        setSelectedIncident,
        visibleIncidents,
        setVisibleIncidents,
        addIncident,
        resolveIncident,
        reopenIncident,
        deleteIncident,
        isMacOS,
        loading: currentIncidents == null
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
const useAppContext = () => useContext(AppContext);
export default useAppContext;
