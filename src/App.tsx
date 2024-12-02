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
import { beginIncidentCreationFn, mapPosition, submitEmergencyFormFn } from '@/types'
import { IncidentReportDialog } from '@/components/IncidentReportDialog'
import { useState } from 'react'

function App() {
  const [newIncidentPosition, setNewIncidentPosition] = useState<mapPosition | null>()
  const startIncidentForm: beginIncidentCreationFn = (lat, lon) => {
    const incidentDialog = document.getElementById('incident-form-dialog') as HTMLDialogElement
    if (incidentDialog) {
      incidentDialog.showModal()
    } else {
      console.error('could not find incident dialog element')
    }
  }
  const handleIncidentFormSubmission: submitEmergencyFormFn = (submission) => {
    
  }
  function handleIncidentFormCancelled() {
    
  }
  function handleDialogFinished() {
    setNewIncidentPosition(null)
  }
  return (
    <>
      <AppContextProvider> {/* Everything that needs context should be inside this */}
        <div className="flex flex-col h-full">
          <AppHeader/>
          <main className="grid grid-cols-[3fr_2fr] h-full gap-4 p-4 box-border flex-grow">
            <div className="card bg-base-300 shadow-xl">
              {/* <ExampleMap/> */}
              <ReportMap 
                  {...{
                    startIncidentForm, 
                    newIncidentPosition, 
                    setNewIncidentPosition
                  }}
                />
            </div>
            <div className="flex flex-col gap-4">
              <IncidentDetails />
              <div className="w-full card bg-base-300 shadow-xl flex-grow p-4">
                <div className="flex justify-between">
                  <h3 className="text-primary text-lg">Incidents</h3>
                  <small className="text-base-content opacity-50 text-xs flex flex-row items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="18px"
                         fill="currentColor">
                      <path
                          d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                    </svg>
                    Select an incident by clicking on its row in the list or on its marker in the map
                  </small>
                </div>
                <IncidentList/>
              </div>
            </div>
          </main>
        </div>
        <IncidentReportDialog 
          incidentPosition={newIncidentPosition}
          dialogID='incident-form-dialog'
          formID='incident-form'
          onIncidentFormSubmit={handleIncidentFormSubmission}
          onIncidentFormCancel={handleIncidentFormCancelled}
        />
        {/*<ExampleComponentThatUsesContext/>*/}
        {/*<ExampleMap/>*/}
      </AppContextProvider>
    </>
  );
}

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