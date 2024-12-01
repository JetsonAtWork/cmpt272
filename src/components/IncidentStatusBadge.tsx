import {IncidentStatus} from "@/types";

interface IncidentStatusBadgeProps {
    status: IncidentStatus
}

function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
    const badgeColor = status === "open" ? "badge-warning" : "badge-success";

    return (
        <div className={`badge badge-outline !w-24 ${badgeColor}`}>
            {status.toUpperCase()}
        </div>
    );
}

export default IncidentStatusBadge;
