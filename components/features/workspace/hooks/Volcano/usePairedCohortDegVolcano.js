import { getPairedCohortDegVolcanoURL } from "@/lib/api/analysis"
import useSWR from "swr"
import { fetcher } from "@/lib/api/fetcher"
import { normalizeVolcanoResult } from "@/components/features/common/Volcano/volcanoUtils"

export const usePairedCohortDegVolcano = ({
    taskUUID,
    rnaType,
    degScope="all",
}) => {
    const shouldFetch =
        taskUUID &&
        rnaType &&
        degScope;

    const url = shouldFetch
        ? getPairedCohortDegVolcanoURL({
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
        taskType: "PairedCohortTask",

        rnaType,
        degScope,
    });
};
