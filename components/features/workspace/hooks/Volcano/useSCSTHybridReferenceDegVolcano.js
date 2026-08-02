import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { getSCSTHybridReferenceDegVolcanoURL } from "@/lib/api/analysis"
import { normalizeVolcanoResult } from "@/components/features/common/Volcano/volcanoUtils"

export const useSCSTHybridReferenceDegVolcano = ({
    taskUUID,
    groupValue,
    rnaType,
    degScope="all",
}) => {
    const shouldFetch =
        Boolean(
            taskUUID &&
            groupValue &&
            rnaType &&
            degScope
        );

    const url = shouldFetch
        ? getSCSTHybridReferenceDegVolcanoURL({
            taskUUID,
            groupValue,
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
        taskType: "SCSTHybridReferenceTask",

        rnaType,
        degScope,
    });
};
