import { DATABASE_API_BASE } from "@/lib/api/config"

export const getCeRNAAxisTableFilterOptionsURL = () => {
    return `${DATABASE_API_BASE}/ceRNAAxis_table_filter_options/`
}

export const getCeRNAAxisTableRecordsURL = () => {
    return `${DATABASE_API_BASE}/ceRNAAxis_table_records/`
}
