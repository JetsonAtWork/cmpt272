import { Incident } from "@/types";
import { loadIncidentsFromLocalStorage } from "@/utils/localStorageUtils";
import { createContext, useContext, useEffect, useState } from "react";

type Context = {
    loading: boolean;
    currentIncidents: Incident[] | undefined;
    addIncident: (newIncident: Incident) => void;
    resolveIncident: (incidentIDToResolve: string) => void;
    visibleIncidents: Incident[] | undefined;
    setVisibleIncidents: (newVisibleIncidents: Incident[]) => void;
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

    const value = {
        currentIncidents,
        selectedIncident,
        setSelectedIncident,
        visibleIncidents,
        setVisibleIncidents,
        addIncident,
        resolveIncident,
        isMacOS,
        loading: currentIncidents == null
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
const useAppContext = () => useContext(AppContext);
export default useAppContext;
