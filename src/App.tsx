/* eslint-disable no-unused-vars */
import AppHeader from "@/components/AppHeader";
import IncidentDetails from "@/components/IncidentDetails";
import IncidentList from "@/components/IncidentList";
import { IncidentReportDialog } from "@/components/IncidentReportDialog";
import ReportMap from "@/components/ReportMap";
import useAppContext, { AppContextProvider } from "@/hooks/useAppContext";
import { searchForLocation } from "@/utils/locationUtils";
import { hashPassword } from "@/utils/miscUtils";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./index.css";
import { useState } from "react";
import { beginIncidentCreationFn, mapPosition } from "@/types";

function App() {
    const [incidentDialogIsOpen, setIncidentDialogIsOpen] = useState(false);
    const startIncidentForm= () => {
        setIncidentDialogIsOpen(true);
    };
    return (
        <>
            <AppContextProvider>
                {" "}
                {/* Everything that needs context should be inside this */}
                <div className="flex flex-col h-full">
                    <AppHeader startIncidentForm={startIncidentForm} />
                    <MainLayoutContainer>
                        <MapLayoutContainer>
                            <ReportMap />
                        </MapLayoutContainer>

                        <div className="flex flex-col gap-4">
                            <IncidentDetails />

                            <IncidentList />
                        </div>
                    </MainLayoutContainer>
                </div>
                <IncidentReportDialog
                    dialogID="incident-form-dialog"
                    formID="incident-form"
                    incidentDetails={null}
                    isOpen={incidentDialogIsOpen}
                    setIsOpen={setIncidentDialogIsOpen}
                />
            </AppContextProvider>
        </>
    );
}

const MainLayoutContainer = ({ children }) => (
    <main className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] xl:h-full gap-4 p-4 box-border flex-grow">
        {children}
    </main>
);

const MapLayoutContainer = ({ children }) => (
    <section className="card bg-base-300 shadow-xl h-[50vh] xl:h-full">
        {children}
    </section>
);

const ExampleMap = () => (
    <MapContainer
        style={{ height: "100%", borderRadius: "1.2rem" }}
        id="map"
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
    >
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[51.505, -0.09]}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
        </Marker>
    </MapContainer>
);
export default App;
