import useSWR from "swr";

import { fetcher } from "@/lib/api/fetcher";
import { getDatasetAnnotationNetworkURL }
    from "@/lib/api/database/datasetAnnotation";

export const useDatasetAnnotationNetworkResult = ({
    source,
    datasetName,
    groupBy = null,
    groupType = null,
}) => {
    const isTIMEDB = source === "TIMEDB";

    const shouldFetch = Boolean(
        source
        && datasetName
        && (!isTIMEDB || (groupBy && groupType))
    );

    const url = shouldFetch
        ? getDatasetAnnotationNetworkURL({
            source,
            datasetName,
            groupBy,
            groupType,
        })
        : null;

    const {
        data,
        error,
        isLoading,
        mutate,
    } = useSWR(url, fetcher);

    return {
        networkData: data ?? null,

        source: data?.source ?? source ?? null,
        datasetName: data?.dataset_name ?? datasetName ?? null,
        annotationDirName: data?.annotation_dir_name ?? null,
        annotationFilePrefix: data?.annotation_file_prefix ?? null,
        networkSourceTaskType: data?.network_source_task_type ?? null,

        isNetworkLoading: isLoading,
        isNetworkError: !!error,
        error,
        mutateNetwork: mutate,
    };
};
