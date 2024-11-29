/* eslint-disable no-unused-vars */
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet'
import "./index.css"
import useAppContext, { AppContextProvider } from '@/hooks/useAppContext'
import { searchForLocation } from '@/utils/locationUtils'
import { hashPassword } from '@/utils/miscUtils'
import IncidentList from "@/components/IncidentList";
import AppHeader from "@/components/AppHeader";

function App() {
  return (
    <>
      <AppContextProvider> {/* Everything that needs context should be inside this */}
        <div className="flex flex-col h-full">
          <AppHeader/>

          <main className="grid grid-cols-[3fr_2fr] h-full gap-4 p-4 box-border flex-grow">
            <div className="card bg-base-300 shadow-xl">
              <ExampleMap/>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full card bg-base-300 shadow-xl h-56 p-4">
                <h3 className="text-primary text-lg">Details</h3>
                <div className="flex items-center justify-center h-full text-base-content">
                  Select an incident to view details
                </div>
              </div>
              <div className="w-full card bg-base-300 shadow-xl flex-grow p-4">
                <h3 className="text-primary text-lg">Incidents</h3>
                <IncidentList />
              </div>
            </div>
          </main>
        </div>
        {/*<ExampleComponentThatUsesContext/>*/}
        {/*<ExampleMap/>*/}
      </AppContextProvider>
    </>
  )
}

const ExampleMap = () => (
    <MapContainer style={{height: '100%', borderRadius: '1.2rem'}} id='map' center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
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
  const {
    isLoggedIn,
    addIncident,
    currentIncidents,
    loading,
    login,
    resolveIncident
  } = useAppContext()
  console.log('Is the user logged in? ', isLoggedIn);
  console.log('Is the app still loading the currentIncidents list from localstorage?', loading);
  console.log('This is the currentIncidents list', currentIncidents);

  function testSearchForLocation() {
    searchForLocation({query: 'coquitlam'}).then((data) => {
      console.log("location query result for query 'coquitlam'", data);
    })
  }

  function testPasswordHash() {
    const hashed = hashPassword('randomPassword')
    console.log("Hash for string 'randomPassword'", hashed);
  }
  return (
    <div className="w-full my-4 text-center">
      <p>here are some buttons that test some of the util functions</p>
      <p className='text-gray-400'>(Check the browser&apos;s console)</p>
      <div className='flex justify-center gap-2'>
        <button onClick={testSearchForLocation} className='btn btn-lg btn-primary'>run test location query</button>
        <button onClick={testPasswordHash} className='btn btn-lg btn-secondary'>test password hash</button>

      </div>
    </div>
  )
}
export default App

