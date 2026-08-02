import { DATABASE_API_BASE } from "@/lib/api/config"

export const getAxisRecurrentRecordsURL = () => (
    `${DATABASE_API_BASE}/axis_recurrent_records/`
);

export const getAxisRecurrentMetaURL = () => (
    `${DATABASE_API_BASE}/axis_recurrent_meta/`
);

export const getAxisRecurrentDetailURL = signature => {
    if (!signature) {
        return null;
    }

    return (
        `${DATABASE_API_BASE}/axis_recurrent_detail/` +
        `?signature=${encodeURIComponent(signature)}`
    );
};
