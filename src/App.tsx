/* eslint-disable no-unused-vars */
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import "./index.css"
import useAppContext, { AppContextProvider } from '@/hooks/useAppContext'
import { searchForLocation } from '@/utils/locationUtils'
import { hashPassword } from '@/utils/miscUtils'
import IncidentList from "@/components/IncidentList";
import AppHeader from "@/components/AppHeader";
import IncidentDetails from "@/components/IncidentDetails";
import ReportMap from '@/components/ReportMap'
import { beginIncidentCreationFn, mapPosition } from '@/types'
import { IncidentReportDialog } from '@/components/IncidentReportDialog'
import { useState } from 'react'

function App() {
  const [newIncidentPosition, setNewIncidentPosition] = useState<mapPosition | null>();
  const [incidentDialogIsOpen, setIncidentDialogIsOpen] = useState(false);
  const startIncidentForm: beginIncidentCreationFn = (lat, lon) => {
    setIncidentDialogIsOpen(true);
  }
  return (
    <>
      <AppContextProvider> {/* Everything that needs context should be inside this */}
        <div className="flex flex-col h-full">
          <AppHeader/>

          <MainLayoutContainer>
            <MapLayoutContainer>
              <ReportMap
                {...{
                  startIncidentForm,
                  newIncidentPosition,
                  setNewIncidentPosition
                }}
              />
            </MapLayoutContainer>

            <div className="flex flex-col gap-4">
              <IncidentDetails />

              <IncidentList/>
            </div>
          </MainLayoutContainer>
        </div>

        <IncidentReportDialog
          incidentPosition={newIncidentPosition}
          dialogID='incident-form-dialog'
          formID='incident-form'
          incidentDetails={null}
          isOpen={incidentDialogIsOpen}
          setIsOpen={setIncidentDialogIsOpen}
        />
      </AppContextProvider>
    </>
  );
}

const MainLayoutContainer = ({children}) => (
  <main className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] xl:h-full gap-4 p-4 box-border flex-grow">
    {children}
  </main>
)

const MapLayoutContainer = ({children}) => (
  <section className="card bg-base-300 shadow-xl h-[50vh] xl:h-full">
    {children}
  </section>
)

const ExampleMap = () => (
    <MapContainer style={{height: '100%', borderRadius: '1.2rem'}} id='map' center={[51.505, -0.09]} zoom={13}
                  scrollWheelZoom={false}>
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
)

// This shows how to get the methods and state variables from the context provider. This is how you access our app's global state
const ExampleComponentThatUsesContext = () => {
  const { addIncident, currentIncidents, loading, resolveIncident } = useAppContext();
  console.log('Is the app still loading the currentIncidents list from localstorage?', loading);
  console.log('This is the currentIncidents list', currentIncidents);

  function testSearchForLocation() {
    searchForLocation({ query: 'coquitlam' }).then((data) => {
      console.log("location query result for query 'coquitlam'", data);
    });
  }

  function testPasswordHash() {
    const hashed = hashPassword('randomPassword');
    console.log("Hash for string 'randomPassword'", hashed);
  }
  return (
    <div className="w-full my-4 text-center">
      <p>Here are some buttons that test some of the util functions</p>
      <p className="text-gray-400">(Check the browser&apos;s console)</p>
      <div className="flex justify-center gap-2">
        <button onClick={testSearchForLocation} className="btn btn-lg btn-primary">
          Run test location query
        </button>
        <button onClick={testPasswordHash} className="btn btn-lg btn-secondary">
          Test password hash
        </button>
      </div>
    </div>
  );
};

export default App;