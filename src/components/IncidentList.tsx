import useAppContext from "@/hooks/useAppContext";
import IncidentStatusBadge from "@/components/IncidentStatusBadge";
import {useEffect, useMemo, useState} from "react";
import Fuse from "fuse.js";
import {Incident} from "@/types";

interface SortState {
    column: string,
    direction: "ascending" | "descending"
}

function IncidentList() {
    const { currentIncidents, selectedIncident, setSelectedIncident, visibleIncidents } = useAppContext();
    const [filter, setFilter] = useState("");
    const [showAllIncidents, setShowAllIncidents] = useState(false);
    const [sortState, setSortState] = useState<SortState>({ column: "Time Reported", direction: "descending" });

    const incidentsToShow = showAllIncidents ? currentIncidents : visibleIncidents;

    const fuse = new Fuse(incidentsToShow ?? [], {
        keys: ["emergencyDesc", "location.address", "location.name", "status"],
        threshold: 0.35,
        shouldSort: false
    });
    useEffect(() => {
        fuse.setCollection(incidentsToShow ?? []);
    }, [incidentsToShow]);

    const sortedAndFilteredIncidents = useMemo(() => {
        const filteredIncidents = filter === "" ? incidentsToShow : fuse.search(filter).map(result => result.item);
        return filteredIncidents?.sort(sortIncidents);
    }, [incidentsToShow, fuse, filter, sortState]);

    function clearAllFilters() {
        setFilter("");
        setShowAllIncidents(false);
        setSortState({ column: "Time Reported", direction: "descending" });
    }

    function sortIncidents(a: Incident, b: Incident): number {
        let sortResult = 0;

        if (sortState.column === "Type") {
            sortResult = a.emergencyDesc.localeCompare(b.emergencyDesc);
        } else if (sortState.column === "Location") {
            sortResult = (a.location.name ?? a.location.address).localeCompare(b.location.name ?? b.location.address);
        } else if (sortState.column === "Time Reported") {
            sortResult = a.date.getTime() - b.date.getTime();
        } else if (sortState.column === "Status") {
            sortResult = a.status.localeCompare(b.status);
        }

        return sortState.direction === "ascending" ? sortResult : sortResult * -1;
    }

    return (
        <section className="w-full card bg-base-300 shadow-xl flex-grow p-4" id="incidents">
            <div className="flex justify-between gap-8">
                <h3 className="text-primary text-lg">Incidents</h3>

                <div className="flex gap-4 items-center">
                    <div className="flex items-center" title="Show all incidents, including those outside the bounds of the current map view">
                        <label htmlFor="showAll" className="text-xs text-base-content opacity-50 w-28 select-none">Show All Incidents</label>
                        <input type="checkbox" className="checkbox" id="showAll"
                            checked={showAllIncidents} onChange={_e => setShowAllIncidents(!showAllIncidents)}/>
                    </div>
                    <input type="text" placeholder="Type to filter..." className="input input-bordered input-sm w-full max-w-xs" value={filter} onChange={e => setFilter(e.target.value)} />

                    <button className="btn btn-neutral btn-square btn-sm" title="Clear all filters" onClick={clearAllFilters}>
                        {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (close)*/}
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex h-full flex-col justify-between gap-4">
                <IncidentListTable incidents={sortedAndFilteredIncidents} selectedIncident={selectedIncident} setSelectedIncident={setSelectedIncident} sortState={sortState} setSortState={setSortState} />

                <small className="text-base-content opacity-50 text-xs flex flex-row items-center gap-1">
                    {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (info)*/}
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                    Select an incident by clicking on its row in the list or on its marker in the map
                </small>
            </div>
        </section>
    );
}

interface IncidentListTableProps {
    incidents: Incident[],
    selectedIncident: string,
    setSelectedIncident: (incidentId: string) => void,
    sortState: SortState,
    setSortState: (sortState: SortState) => void,
}

function IncidentListTable({ incidents, selectedIncident, setSelectedIncident, sortState, setSortState }: IncidentListTableProps) {
    function updateSortState(column: string) {
        if (sortState?.column === column) {
            if (sortState.direction === "ascending") {
                setSortState({ column: sortState.column, direction: "descending" });
            } else if (sortState.direction === "descending") {
                setSortState({ column: sortState.column, direction: "ascending" });
            }

        } else {
            setSortState({ column, direction: "ascending" });
        }
    }

    if (!incidents?.length) {
        return <div className="flex justify-center items-center text-base-content h-full min-h-48">No Incidents. Make sure you don't have any filters.</div>;
    } else {
        return (
            <table className="table">
                <thead>
                    <tr className="!border-b-neutral">
                        <TableColumnSort columnName="Type" sortState={sortState} updateSortState={updateSortState} />
                        <TableColumnSort columnName="Location" sortState={sortState} updateSortState={updateSortState} />
                        <TableColumnSort columnName="Time Reported" sortState={sortState} updateSortState={updateSortState} />
                        <TableColumnSort columnName="Status" sortState={sortState} updateSortState={updateSortState} />
                    </tr>
                </thead>

                <tbody>
                {
                    incidents?.map((incident) =>
                        <tr key={incident.id.toString()} className={`!border-b-neutral ${selectedIncident === incident.id ? "bg-primary bg-opacity-30" : "hover cursor-pointer"}`} onClick={() => setSelectedIncident(incident.id)}>
                            <td>{incident.emergencyDesc}</td>
                            <td>{incident.location.name ?? incident.location.address}</td>
                            <td>{incident.date.toString()}</td>
                            <td><IncidentStatusBadge status={incident.status}/></td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        );
    }
}

interface TableColumnSortProps {
    columnName: string,
    sortState: SortState,
    updateSortState: (column: string) => void,
}

function TableColumnSort({ columnName, sortState, updateSortState }: TableColumnSortProps) {
    return (
        <th onClick={() => updateSortState(columnName)}>
            <div className="flex items-center gap-1 cursor-pointer select-none">
                {columnName}

                <div>
                    {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (arrow_drop_up)*/}
                    <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960" width="12px" fill="currentColor"
                         className={`scale-150 -mb-1.5 ${sortState?.column === columnName && sortState?.direction === "ascending" ? "text-primary" : ""}`}>
                        <path d="m280-400 200-200 200 200H280Z"/>
                    </svg>

                    {/*This icon is from Google Material Icons (https://fonts.google.com/icons) (arrow_drop_down)*/}
                    <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 -960 960 960" width="12px" fill="currentColor"
                         className={`scale-150 ${sortState?.column === columnName && sortState?.direction === "descending" ? "text-primary" : ""}`}>
                        <path d="M480-360 280-560h400L480-360Z"/>
                    </svg>
                </div>
            </div>
        </th>
    );
}

export default IncidentList;
