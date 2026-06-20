import { getImmuneAnnotationDataURL } from "@/lib/api/analysis"
import { fetcher } from "@/lib/api/fetcher"
import useSWR from "swr"

export const useImmuneAnnotationData = (mapInfo) => {
    const { data, error, isLoading, mutate } = useSWR(
        mapInfo ? getImmuneAnnotationDataURL(mapInfo) : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        annotationData: data,
        annotationRows: data?.results ?? [],
        annotationColumns: data?.columns ?? [],
        annotationCount: data?.count ?? 0,
        isLoading,
        isError: error,
        mutate,
    };
};
