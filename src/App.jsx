/* eslint-disable no-unused-vars */
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import './index.css';
import useAppContext, { AppContextProvider } from '@/hooks/useAppContext';
import { searchForLocation } from '@/utils/locationUtils';
import { hashPassword } from '@/utils/miscUtils';
import ReportMap from '@/components/ReportMap'; // Update with the correct path to ReportMap if changed

function App() {
  return (
    <>
      <AppContextProvider>
        {/* Everything that needs context should be inside this */}
        <ExampleComponentThatUsesContext />
        <ReportMap />
      </AppContextProvider>
    </>
  );
}

const ExampleComponentThatUsesContext = () => {
  const { isLoggedIn, addIncident, currentIncidents, loading, login, resolveIncident } = useAppContext();
  console.log('Is the user logged in? ', isLoggedIn);
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