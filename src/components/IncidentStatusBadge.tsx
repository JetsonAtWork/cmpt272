import {IncidentStatus} from "@/types";

interface IncidentStatusBadgeProps {
    status: IncidentStatus
}

function IncidentStatusBadge({ status }: IncidentStatusBadgeProps) {
    const badgeColor = status === "open" ? "badge-warning" : "badge-success";

    return (
        <div className={`badge badge-outline ${badgeColor}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
    );
}

export default IncidentStatusBadge;
