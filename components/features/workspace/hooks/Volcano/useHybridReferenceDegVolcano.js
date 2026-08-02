import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getHybridReferenceDegVolcanoURL } from "@/lib/api/analysis"
import { normalizeVolcanoResult } from "@/components/features/common/Volcano/volcanoUtils"

export const useHybridReferenceDegVolcano = ({
    taskUUID,
    rnaType,
    degScope="all",
}) => {

    const shouldFetch =
        taskUUID &&
        rnaType &&
        degScope;


    const url = shouldFetch
        ? getHybridReferenceDegVolcanoURL({
            taskUUID,
            rnaType,
            degScope,
        })
        : null;


    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(
        url,
        fetcher,
    );


    return normalizeVolcanoResult({
        data,
        error,
        isLoading,
        mutate,

        taskUUID,
        taskType: "HybridReferenceTask",

        rnaType,
        degScope,
    });
};
