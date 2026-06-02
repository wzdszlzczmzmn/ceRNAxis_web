import { fetcher } from "@/lib/api/fetcher"
import { getCeRNAAxisTableFilterOptionsURL } from "@/lib/api/database/ceRNAAxisDatabase"
import useSWR from "swr"


const useCeRNAAxisFilterOptions = () => {
    const { data, error, isLoading, mutate } = useSWR(
        getCeRNAAxisTableFilterOptionsURL(),
        fetcher
    )

    return {
        filterOptions: data,
        isFilterOptionsLoading: isLoading,
        isFilterOptionsError: error,
        mutate
    }
}

export default useCeRNAAxisFilterOptions
