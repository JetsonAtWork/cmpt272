import { submitEmergencyFormFn } from '@/types';
import React from 'react';

type IncidentReportDialogProps = {
    dialogID: string,
    formID: string,
    onIncidentFormSubmit: submitEmergencyFormFn,
    onIncidentFormCancel: () => void,
}
export const IncidentReportDialog = ({
    dialogID,
    formID,
    onIncidentFormSubmit,
    onIncidentFormCancel,
}: IncidentReportDialogProps) => {

    function prepareFormSubmit(e) {
        e.preventDefault()
        console.log('formsubmisssion event',e);
        // onIncidentFormSubmit(values)
    }
    return (
        <dialog id={dialogID} className="modal" onClose={onIncidentFormCancel}>
        <div className="modal-box">
            <h3 className="font-bold text-lg">Incident Creation Form</h3>
            <form id={formID} onSubmit={prepareFormSubmit}></form>
            {/* Incident form goes here */}
            <div className="modal-action">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
            </form>
            </div>
        </div>
        </dialog>
    );
};
