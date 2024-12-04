import FormMap from '@/components/FormMap';
import ReportMap from '@/components/ReportMap';
import { mapPosition } from '@/types';
import { searchForLocation } from '@/utils/locationUtils';
import { condStr } from '@/utils/miscUtils';
import { LatLng } from 'leaflet';
import React, { useEffect, useState } from 'react';

export const ReportFormAddress = ({ setAddressConfirmed, addressConfirmed, changeAddress, location, formErrors }) => {
  const [addressQueryError, setAddressQueryError] = useState(null)
  const [positionChangeWarning, setPositionChangeWarning] = useState(null)
  const [queryLoading, setQueryLoading] = useState(false)

  // Address Changed via marker placement (drag or map click)
  async function changeLocationPosition(newPosition: LatLng) {
    setAddressConfirmed(false)
    if (location.address?.length > 0) {
      setPositionChangeWarning('Location changed. Please confirm that the address entered is still accurate')
    }
    changeAddress((prev) => ({...prev, latlng: newPosition}))
  }

  async function changeLocationAddress(newAddress: string) {
    if (!newAddress) {
      return
    }
      try {
        setPositionChangeWarning(null)
        setQueryLoading(true)
        searchForLocation({ query: newAddress }).then((queryResults) => {
          setQueryLoading(false)
          const firstResult = queryResults?.[0]
          if (firstResult) {
            setAddressQueryError(null)
            setAddressConfirmed(false)
            changeAddress((prev) => ({latlng: new LatLng(firstResult.lat, firstResult.lon), address: newAddress}))
          } else {
              throw new Error();
          }
        })
      } catch (error) {
        setAddressQueryError('There was an issue finding that address on the map. Please enter another address or click the location of the incident on the map')
      }
    }

    function resetAddress() {
      setPositionChangeWarning(null)
      setAddressConfirmed(false)
      changeAddress({
        name: null,
        address: '',
        latlng: null
      })
    }

    function handleSearchBlur(e) {
      if (location.address != e.target.value) {
        changeLocationAddress(e.target.value)
      } 
    }

    return (    
      <>
        <AddressInput
          onBlur={handleSearchBlur}
          initialAddress={location.address}
          onAddressChange={changeLocationAddress}
          addressChangeWarning={positionChangeWarning} 
          error={formErrors.address}
        />
        { addressQueryError && (
          <p className='text-error'>{addressQueryError}</p>
        )}
        <FormMap
          loading={queryLoading}
          addressConfirmed={addressConfirmed}
          markerLatLng={location.latlng}
          setMarkerLatLng={changeLocationPosition}
          handleMarkerConfirmed={() => setAddressConfirmed(true)}
          handleMarkerDenied={resetAddress}
        />
        <small className="text-base-content opacity-50 text-xs flex flex-row items-center gap-1 mt-4">
            {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (info)*/}
            <svg className='w-10' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
            Specify the location of the incident by searching up an address or clicking the map. Once a pin is on the map, click and drag to move it.
        </small>
      </>
    );
}

const AddressInput = ({ onAddressChange, addressChangeWarning, initialAddress, error, onBlur }) => {
  const [addressText, setAddressText] = useState('')
  useEffect(() => {
    if (initialAddress && (initialAddress != addressText)) {
      setAddressText(initialAddress)
    } 
  },[initialAddress])

  function handleAddressTextChangeFinish(e) {
    e.preventDefault()  
    onAddressChange(addressText)
  }

  return (
    <>
      <div className="label">
        <span className="label-text">Address or Coordinates</span>
          { error && (
              <span className="label-text-alt !text-error">{error}</span>
          )}
      </div>
      <form onSubmit={handleAddressTextChangeFinish} className="search-bar flex ">
        <label className={`input input-bordered !join !pr-0 flex items-center w-full !rounded-r-none ${condStr(!!addressChangeWarning, 'input-warning')} ${condStr(!!error, 'text-')}`} htmlFor="search">
          <input
            onBlur={onBlur}
            id='search'
            type="text"
            placeholder="Search Address or Coordinates"
            value={addressText}
            onChange={(e) => setAddressText(e.target.value)}
            className={`join-item w-full !text-sm bg-white !rounded-r-none`}
          />
          <button onClick={handleAddressTextChangeFinish} className="join-item btn m-0 !h-full !min-h-0 btn-primary !rounded-l-none">
            <SearchIcon className='w-8 h-8'/>
          </button>
        </label>
      </form>
      <p className='text-warning text-sm mt-1'>{addressChangeWarning}</p>
    </>
  )
}

const SearchIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"/></g></svg>
)
const CtrlIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/></svg>
)


export const ReportFormAddressActions = ({ sectionComplete, advanceFormStep, onCancelClicked }) => (
    <div className="modal-action mt-2">
        <div className="flex w-full justify-end gap-2">
            <button onClick={advanceFormStep} type="button" className="btn btn-primary bg-neutral" disabled={!sectionComplete}>Continue</button>
            <button onClick={onCancelClicked} type='reset' className='btn btn-neutral'>Cancel</button>
        </div>
    </div>
)
