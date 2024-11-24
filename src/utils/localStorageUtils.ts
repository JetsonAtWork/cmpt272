import { Incident } from "@/types";

// @Kyaahn Could you add the logic for fetching incidents from localstorage in this function? I call it in the context provider to provide the rest of the app with it
function loadIncidentsFromLocalStorage() : Incident[] {
    return []
}

export {
    loadIncidentsFromLocalStorage
}