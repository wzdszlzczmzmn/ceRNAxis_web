import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import {
    getAxisRecurrentMetaURL,
} from "@/lib/api/database/axisRecurrentDatabase";


const useAxisRecurrentMeta = () => {
    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        getAxisRecurrentMetaURL(),
        fetcher,
    );

    const itemFilterFields = (
        data?.fields || []
    ).filter(
        field => field?.field_type === "items"
    );

    return {
        meta: data,
        patternMeta: data?.pattern ?? null,
        filterOptions: {
            table_name: data?.table_name,
            fields: itemFilterFields,
        },

        isLoading,
        isError: Boolean(error),
        error,
        mutate,
    };
};

export default useAxisRecurrentMeta;
