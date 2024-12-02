import useAppContext from "@/hooks/useAppContext";
import IncidentStatusBadge from "@/components/IncidentStatusBadge";
import { Incident } from "@/types";
import { useMemo } from "react";

function IncidentList() {
    const { currentIncidents, selectedIncident, setSelectedIncident } = useAppContext();
    const sortedIncidents = 
        useMemo(() => 
            currentIncidents?.sort(compareIncidents),
            [currentIncidents])

    const rows = sortedIncidents?.map((incident) => {
        return (
            <tr key={incident.id.toString()} className={selectedIncident === incident.id ? "bg-primary bg-opacity-30" : "hover cursor-pointer"} onClick={() => setSelectedIncident(incident.id)}>
                <td>{incident.emergencyDesc}</td>
                <td>{incident.location.name ?? incident.location.address}</td>
                <td>{incident.date.toDateString()}</td>
                <td><IncidentStatusBadge status={incident.status}/></td>
                {/*<td className="text-right">*/}
                {/*    <button className="btn btn-outline btn-error btn-sm btn-square">*/}
                {/*        /!*This icon is from Google Material Icons (https://fonts.google.com/icons) (delete)*!/*/}
                {/*        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>*/}
                {/*    </button>*/}
                {/*</td>*/}
            </tr>
        )
    });

    return (
        <>
            <table className="table">
                <thead>
                <tr>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Time Reported</th>
                    <th>Status</th>
                    {/*<th>Actions</th>*/}
                </tr>
                </thead>

                <tbody>
                {rows}
                </tbody>
            </table>
        </>
    )
}

function compareIncidents(a: Incident, b: Incident) {
    if (a.status === 'open' && b.status === 'resolved') return -1
    if (a.status === 'open' && b.status === 'open') return 0
    if (a.status === 'resolved' && b.status === 'open') return 1
    
}

export default IncidentList;
