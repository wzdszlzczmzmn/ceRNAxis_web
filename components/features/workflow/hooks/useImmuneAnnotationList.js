import useSWR from "swr";
import { getImmuneAnnotationListURL } from "@/lib/api/analysis"
import { fetcher } from "@/lib/api/fetcher"

export const useImmuneAnnotationList = () => {
    const { data, error, isLoading, mutate } = useSWR(
        getImmuneAnnotationListURL(),
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    return {
        immuneMapOptions: data?.results ?? [],
        immuneMapCount: data?.count ?? 0,
        isLoading,
        isError: error,
        mutate,
    };
};
