import { useState } from 'react';
import { IncidentLocation, Witness, EmergencyReportFormData, Incident, formSection } from "./types";
import React from "react";
import {condStr, DATE_FORMAT, fileToBase64} from './utils/miscUtils';
import { loadIncidentsFromLocalStorage } from './utils/localStorageUtils';
import useAppContext from "@/hooks/useAppContext"; 
import { AppContextProvider } from './hooks/useAppContext'; 
import { v4 as uuidv4 } from 'uuid';
import { latLng } from 'leaflet';

type SubmitReportFormProps = {
    initialValues?: Incident,
    id: string,
    values: any,
    setValues: any,
    errors: any
}
const SubmitReportForm = ({
    id,
    values,
    setValues,
    errors
}: SubmitReportFormProps) => {

const formUpdated = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, element: formSection, value: string) => {
    let newVal = event.target.value
    if (value === 'phoneNumber') {
        newVal = newVal.replace(/[^0-9.]/g, '')
    }
    setValues(savedData => ({
        ...savedData,
        [element]: {
            ...savedData[element],
            [value]: newVal
        }
    }));
};

const formUpdatednotEnclosved = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, element: string, value: string) => {
    setValues((savedData) => ({
        ...savedData,
        [element]: event.target.value
    }));
};

const fileUploaded = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files?.[0]){
        try {
            const pic = await fileToBase64(event.target.files?.[0]);
            setValues((savedData) => ({
                ...savedData,
                pictureLink: pic,
            }));
        } catch(error) {
            console.log("picture error: ", error)
        }
    }
};

return (
    //return form
    <form id={id} className ="max-w-800px mx-auto">
            <div className="label">
                <label className="label-text">Name of Witness*</label>
                { errors.name && (
                    <label className="label-text-alt !text-error">{errors.name}</label>
                )}
            </div>
            <input className = {`input input-sm input-bordered !bg-base-300 w-full mb-2 ${condStr(errors.name, '!input-error')}`} type = "text" id="name" name = "name" value = {values.person.name} onChange={(e) => formUpdated(e, "person", "name")}></input>
            <div className="label !pb-1">
                <label className="label-text">Witness Phone Number*</label>
                { errors.phoneNumber && (
                    <label className="label-text-alt !text-error">{errors.phoneNumber}</label>
                )}
            </div>
            <input className = {`input-sm input input-bordered !bg-base-300 w-full mb-2 ${condStr(errors.phoneNumber, '!input-error')}`} type="tel" id="phoneNumber" name = "phoneNumber" value = {values.person.phoneNumber} onChange={(e) => formUpdated(e, "person", "phoneNumber")}></input>
            <div className="label !pb-1">
                <label className="label-text">Type of Emergency (Fire, Medical, Robbery, etc)*</label>
                { errors.emergencyDesc && (
                    <label className="label-text-alt !text-error">{errors.emergencyDesc}</label>
                )}
            </div>
            <input className = {`input input-sm input-bordered !bg-base-300 w-full mb-2 ${condStr(errors.emergencyDesc, '!input-error')}`} type = "text" id="emergencyDesc" name = "emergencyDesc" value = {values.emergencyDesc} onChange={(e) => formUpdatednotEnclosved(e, "emergencyDesc", "emergencyDesc")}></input>
            <div className="label !pb-1">
                <label className="label-text">Address of Incident*</label>
                { errors.address && (
                    <label className="label-text-alt !text-error">{errors.address}</label>
                )}
            </div>
            <input className = {`input input-sm input-bordered !bg-base-300 w-full mb-2 ${condStr(errors.address, '!input-error')}`} type = "text" id="locationAddress" name = "address" value = {values.location.address} onChange={(e) => formUpdated(e, "location", "address")}></input>
            <div className="label !pb-1">
                <label className="label-text">If you have a photo, please upload</label>
            </div>
            <input className = "file-input file-input-sm file-input-bordered !bg-base-300 w-full file-input-primary mb-2" type = "file" id="pictureLink" name = "pictureLink" onChange={fileUploaded}></input>

            <div className="label">
                <label className="label-text">Any additional comments*</label>
            </div>
            <textarea className = "textarea textarea-bordered !bg-base-300 w-full   mb-2" id="comments" name = "comments" value = {values.comments} onChange={(e) => formUpdatednotEnclosved(e, "comments", "comments")}></textarea>
            <div className="label !pb-1">
                <label className="label-text">Date and Time of incident</label>
            </div>
            <input className = "input input-sm input-bordered !bg-base-300 w-full mb-2" type = "text" id="timeanddate" name = "timeanddate" value = {DATE_FORMAT.format(values.date)} disabled></input>
    </form>
);
};

export default SubmitReportForm;