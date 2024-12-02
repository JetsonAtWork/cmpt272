import useAppContext from "@/hooks/useAppContext";
import IncidentStatusBadge from "@/components/IncidentStatusBadge";
import React, { useState, useRef } from 'react';
import { hashPassword } from '@/utils/miscUtils'


function IncidentDetails() {
    const { selectedIncident } = useAppContext();

    const content = selectedIncident ? <IncidentDetailsContent /> : (<>
        <h3 className="text-primary text-lg">Details</h3>
        <p className="flex items-center justify-center text-base-content h-full">Select an incident to view details</p>
    </>);

    return (
        <section className="w-full card bg-base-300 shadow-xl h-72 p-4">
            {content}
        </section>
    );
}

function IncidentDetailsContent() {
    const {currentIncidents, selectedIncident } = useAppContext();
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
    const [actionType, setActionType] = useState(null)
    const [passwordError, setPasswordError] = useState("")
    const incident = currentIncidents.find(incident => incident.id === selectedIncident);
    const passwordRef = useRef(null)
    const passwordDialogRef= useRef(null)
    const realHashedPassword = "098f6bcd4621d373cade4e832627b4f6"//This is just "test" hashed

    const closePasswordDialog = (action)=>{
        if(passwordDialogRef.current){ 
            passwordDialogRef.current.close()
            setPasswordDialogOpen(false)}
    }
    const openPasswordDialog = (action)=>{
        setActionType(action)
        if(passwordDialogRef.current) {
            passwordDialogRef.current.showModal()
            setPasswordDialogOpen(true)}
    }
    const submitPassword = (event) => {
        event.preventDefault();
        const enteredPassword = passwordRef.current.value
        const enteredHashedPassword = hashPassword(enteredPassword)
        if(enteredHashedPassword == realHashedPassword){
            if(actionType == "modify"){
                //Modify the Incident
            }
            if(actionType == "delete"){
                //delete the Incident
            }
            closePasswordDialog()
        }
        else{
            setPasswordError("Incorrect Password.")
        }
        
    }

    return (
        <>
            <div className="mb-2 flex justify-between">
                <h3 className="text-primary text-lg">Details</h3>

                <div className="flex items-center gap-2">
                    <button id = "modify" className="btn btn-outline btn-sm" onClick={() => openPasswordDialog("modify")}>
                        Update Status
                    </button>

                    <button id = "delete"className="btn btn-outline btn-error btn-sm btn-square" onClick={() => openPasswordDialog("delete")}>
                        {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (delete)*/}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-[2fr_1fr] h-full">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
                    <strong className="incident-details-label">Type</strong>
                    <p>{incident.emergencyDesc}</p>

                    <strong className="incident-details-label">Status</strong>
                    <IncidentStatusBadge status={incident.status}/>

                    <strong className="incident-details-label">Location</strong>
                    <div>
                        <p>{incident.location.name}</p>
                        <p>{incident.location.address}</p>
                    </div>

                    <strong className="incident-details-label">Time Reported</strong>
                    <p>{incident.date.toDateString()}</p>

                    <strong className="incident-details-label">Comments</strong>
                    <p>{incident.comments}</p>
                </div>

                <IncidentDetailsImage pictureLink={incident.pictureLink}/>
            </div>
            
            <dialog ref = {passwordDialogRef} id="passwordDialog" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Enter Your Password</h3>
                  <div className="modal-action">
                    <form onSubmit={submitPassword} className="flex flex-col space-y-4">
                      {/* if there is a button in form, it will close the modal */}
                        <input ref = {passwordRef} type="password" placeholder="Enter Password" className="input w-full max-w-xs" required/>
                    
                        <div className="flex gap-4 mt-4">
                            <button type="submit" className="btn btn-primary">
                                Submit
                            </button>
                            <button type="button"className="btn btn-secondary"onClick={closePasswordDialog}>
                                Close
                            </button>
                        </div>
                    </form>
                  </div>
                  {passwordError &&(
                    <div className="text-error mt-2">
                    <p>{passwordError}</p>
                </div>
                  )}
                </div>
            </dialog>
            
        </>
    );
}

function IncidentDetailsImage({pictureLink}) {
    if (pictureLink) {
        return (
            <a href={pictureLink} target="_blank" className="relative group max-h-full w-full">
                <svg
                    className="absolute right-4 top-4 z-10 group-hover:scale-125 transition duration-200 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                    fill="currentColor">
                    <path d="M120-120v-320h80v184l504-504H520v-80h320v320h-80v-184L256-200h184v80H120Z"/>
                </svg>
                <div
                    className="w-full h-full absolute top-0 right-0 rounded-box group-hover:bg-base-200 opacity-40 transition duration-200 ease-in-out"/>
                <img src={pictureLink} alt="Incident Report Image"
                     className="w-full h-full max-h-full object-cover rounded-box"/>
            </a>
        );
    } else {
        return (
            <p className="flex items-center justify-center border rounded-box border-base-content text-base-content">No picture</p>
        );
    }
}

export default IncidentDetails;
