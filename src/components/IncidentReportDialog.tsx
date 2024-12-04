import { DialogStepper } from '@/components/DialogStepper';
import { ReportFormAddress, ReportFormAddressActions } from '@/components/ReportFormAddress';
import useAppContext from '@/hooks/useAppContext';
import SubmitReportForm, { SubmitReportFormActions } from '@/reportForm';
import { Incident, mapPosition, submitEmergencyFormFn } from '@/types';
import { searchForLocation } from '@/utils/locationUtils';
import { validatePhoneNumber } from '@/utils/miscUtils';
import { LatLng, latLng } from 'leaflet';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type IncidentReportDialogProps = {
    dialogID: string,
    formID: string,
    onIncidentFormSubmit: submitEmergencyFormFn,
}
const initialFormValues: Incident = {
    id: "",
    date: new Date(),
    status: "open",
    person: {
        name:"",
        phoneNumber:"",
    },
    emergencyDesc: "",
    location: {
        address: "",
        latlng: null,
        radiusMeters:0,
    },
    pictureLink: "",
    comments: "",
}
const FORM_STEP = {
    ONE: 1,
    TWO: 2
}
export const IncidentReportDialog = ({
    dialogID,
    formID,
}: IncidentReportDialogProps) => {
    const [formStep, setFormStep] = useState(FORM_STEP.ONE)
    const [formErrors, setFormErrors] = useState({})
    const [formValues, setFormValues] = useState<Incident>(initialFormValues);
    const [addressConfirmed, setAddressConfirmed] = useState(false)

    const { addIncident, setSelectedIncident } = useAppContext()

    function prepareFormSubmit() {
        //first create and add uuid 
        const newUuid = uuidv4();
        const finalValues: Incident = {
            ...formValues,
            id: newUuid,
            status: 'open',
            location: {
                ...formValues.location,
            }
        };
        addIncident(finalValues)
        setSelectedIncident(newUuid)
        closeDialog()
    }

    function validateForm() {
        const errors: {[key: string]: any} = {}
        let formIsValid = true
        // Ensure all required fields are included
        if (formValues.person.name.length < 1) errors.name = 'Required'
        if (formValues.person.phoneNumber.length < 1) errors.phoneNumber = 'Required'
        if (formValues.emergencyDesc.length < 1) errors.emergencyDesc = 'Required'
        if (formValues.location.address.length < 1) errors.address = 'Required'
        if (!addressConfirmed) errors.addressConfirmed = 'Please confirm the incident\'s address'
        if (!formValues.location.latlng) errors.latlng = 'Please specify the exact location of the incident on the map'
        formIsValid = Object.keys(errors).length === 0

        // Validate inputs
        if (formIsValid) {
            const phoneHasError = !validatePhoneNumber(formValues.person.phoneNumber)
            if (phoneHasError) errors.phoneNumber = 'Invalid Phone Number'
            formIsValid = Object.keys(errors).length === 0
        }

        setFormErrors(errors)
        if (formIsValid) prepareFormSubmit()
        
    }

    function closeDialog() {
        const dialog = document.getElementById(dialogID) as HTMLDialogElement
        setFormValues(initialFormValues)
        setFormErrors({})
        dialog.close()
    }

    function handleDialogClosed() {
        setAddressConfirmed(false)
        setFormValues(initialFormValues)
        setFormStep(1)
    }

    function changeIncidentLocation(update) {
      if (update instanceof Function) {
        // Updater function was passed
        setFormValues((prev) => ({
          ...prev,
          location: (update(prev.location))
        }))
      } else {
        // Replacement value was passed
        setFormValues((prev) => ({
          ...prev,
          location: update
        }))
      }
    }
    return (
        <dialog id={dialogID} className="modal" onClose={handleDialogClosed}>
            <div className="modal-box flex flex-col h-[40rem] !max-h-none">
              <div className="flex flex-col w-full items-center">
                <h3 className="font-bold text-lg">Witness Report Form</h3>
                <DialogStepper
                  onStepClicked={setFormStep}
                  currentStep={formStep}
                  stepNames={['Location', 'Incident details']}
                />

              </div>
                {/* <div className='place-self-center'>
                </div> */}
                {{
                    [FORM_STEP.ONE]: (
                        <>
                            <ReportFormAddress
                              formErrors={formErrors} 
                              location={formValues.location}
                              addressConfirmed={addressConfirmed}
                              setAddressConfirmed={setAddressConfirmed}
                              changeAddress={changeIncidentLocation}
                            />
                            <ReportFormAddressActions 
                                onCancelClicked={closeDialog}
                                sectionComplete={addressConfirmed}
                                advanceFormStep={() => setFormStep(FORM_STEP.TWO)}
                            />
                        </>
                    ),
                    [FORM_STEP.TWO]: (
                      <>
                        <SubmitReportForm 
                            id={formID}
                            values={formValues}
                            errors={formErrors}
                            setValues={setFormValues}
                            addressConfirmed={addressConfirmed}
                            setAddressConfirmed={setAddressConfirmed}
                        />
                        <SubmitReportFormActions 
                          onCancelClicked={closeDialog}
                          onSubmitClicked={validateForm}
                        />
                      </>
                    ),
                }[formStep]}
            </div>
        </dialog>
    );
};
