import { useState } from 'react';
import { IncidentLocation, Witness, EmergencyReportFormData, Incident, formSection } from "./types";
import React from "react";
import { fileToBase64 } from './utils/miscUtils';
import { loadIncidentsFromLocalStorage } from './utils/localStorageUtils';
import { v4 as uuidv4 } from 'uuid';
import { latLng } from 'leaflet';


const SubmitReportForm = () => {
const [reportState, setForm] = useState<Incident>({
    id: 0,
    date: new Date(),
    status: "open",
    person: {
        name:"",
        phoneNumber:"",
    },

    emergencyDesc: "",
    location: {
        address: "",
        latlng: latLng(0, 0),
        radiusMeters:0,
    },
    pictureLink: "",
    comments: "",
});


const formUpdated = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, section: formSection, field: string) => {
    setForm(otherFormData => ({
        ...otherFormData,
        [section]: {
            ...otherFormData[section],
            [field]: event.target.value
        }
    }));
};

const formUpdatednotEnclosved = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, section: string, field: string) => {
    setForm((prevFormData) => ({
        ...prevFormData,
        [section]: event.target.value
    }));
};

const fileUploaded = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if(file){
        try {
            const base64String = await fileToBase64(file);
            setForm((prevFormData) => ({
                ...prevFormData,
                pictureLink: base64String,
            }));
        } catch(error) {
            console.log("error: ", error)
        }
    }
};


const formFinished = (event: React.FormEvent) => {
    //first create and add uuid 
    const newUuid = uuidv4();
    const setUuid = {
        ...reportState,
        id: newUuid,
    };
    //logs everything together
    event.preventDefault();
    const previousList = loadIncidentsFromLocalStorage();
    const newList = [...previousList, setUuid];
    localStorage.setItem("incidents", JSON.stringify(newList));

    //you can delete this, this just makes sure everything is sent to localstorage
    const current = loadIncidentsFromLocalStorage();
    console.log("incidents array list", current);
}

return (
    //return form
    <form onSubmit = {formFinished} className ="bg-primary shadow-md max-w-800px pt-20 pr-20 pb-20 pl-20 mx-auto">
        <h1 className="mb-10 text-lg">Witness Report Form</h1>
        <section>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='name'>Name of Witness</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-black mb-5" type = "text" id="name" name = "name" value = {reportState.person.name} onChange={(e) => formUpdated(e, "person", "name")}></input>
        </section>

        <section>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='phoneNumber'>Witness Phone Number</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-black mb-5" type = "text" id="phoneNumber" name = "phoneNumber" value = {reportState.person.phoneNumber} onChange={(e) => formUpdated(e, "person", "phoneNumber")}></input>
        </section>

        <section>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='emergencyDesc'>Type of Emergency (Fire, Medical, Robbery, etc)</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-black mb-5" type = "text" id="emergencyDesc" name = "emergencyDesc" value = {reportState.emergencyDesc} onChange={(e) => formUpdatednotEnclosved(e, "emergencyDesc", "emergencyDesc")}></input>
        </section>

        <section>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='location'>Address of Incident</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-black mb-5" type = "text" id="locationAddress" name = "address" value = {reportState.location.address} onChange={(e) => formUpdated(e, "location", "address")}></input>
        </section>

        <section>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='pictureLink'>If you have a photo, please upload</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-grey mb-5" type = "file" id="pictureLink" name = "pictureLink" onChange={fileUploaded}></input>
        </section>

        <section>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='comments'>Any additional comments</label>
            <textarea className = "w-full h-40 pr-5 pl-5 pt-5 pb-5 text-black mb-5" id="comments" name = "comments" value = {reportState.comments} onChange={(e) => formUpdatednotEnclosved(e, "comments", "comments")}></textarea>
        </section>

        <section hidden>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='timeanddate'>Date and Time of incident</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-black mb-5" type = "text" id="timeanddate" name = "timeanddate" value = {reportState.date.toLocaleString()} disabled></input>
        </section>

        <section hidden>
            <label className = "block text-sm font-bold mb-2 text-neutral-500" htmlFor='status'>Status</label>
            <input className = "pr-1 pl-1 pt-1 pb-1 text-black mb-5" type = "text" id="status" name = "status" value = {reportState.status} disabled></input>
        </section>

        <button className="bg-neutral text-black pt-1 pr-1 pb-1 pl-1" type ="submit">Submit Report</button>
    </form>
);
};

export default SubmitReportForm;