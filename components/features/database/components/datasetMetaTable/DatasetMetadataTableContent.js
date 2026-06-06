import { useEffect, useMemo, useState } from "react"
import Fuse from "fuse.js"
import { Stack } from "@mui/system"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import DatasetMetadataTable from "./DatasetMetadataTable"
import DatasetMetadataFilterCollapse from "./DatasetMetadataFilterCollapse"
import DatasetMetadataTableOperations from "./DatasetMetadataTableOperations"
import {
    DATASET_METADATA_FUSE_OPTIONS,
    FILTER_FIELDS,
    MULTI_VALUE_FIELDS,
} from "./datasetMetadataConfig"
import useDatasetMetadataList from "@/components/features/database/hooks/datasetMetaTable/useDatasetMetadataList"

const DatasetMetadataTableContent = ({ geneBioType }) => {
    const { datasets, count, isLoading, isError } = useDatasetMetadataList(geneBioType)

    const [isShowLeft, setIsShowLeft] = useState(true)
    const [filters, setFilters] = useState({})
    const [searchText, setSearchText] = useState("")

    useEffect(() => {
        setFilters({})
        setSearchText("")
    }, [geneBioType])

    const availableFilters = useMemo(() => {
        return buildFilters(datasets)
    }, [datasets])

    const filteredData = useMemo(() => {
        let result = datasets

        for (const key in filters) {
            const selected = Array.isArray(filters[key]) ? filters[key] : []

            if (selected.length === 0) continue

            const wanted = new Set(selected.map(v => String(v).trim()))

            if (MULTI_VALUE_FIELDS.has(key)) {
                result = result.filter(item => {
                    const tokens = tokenize(item[key])
                    const hitTokens = tokens.some(token => wanted.has(token))
                    const hitEmpty = wanted.has("") && tokens.length === 0

                    return hitTokens || hitEmpty
                })
            } else {
                result = result.filter(item => {
                    const raw = item[key]

                    if (wanted.has("") && isBlank(raw)) return true
                    if (isBlank(raw)) return false

                    return wanted.has(String(raw).trim())
                })
            }
        }

        return result
    }, [datasets, filters])

    const searchedData = useMemo(() => {
        const q = searchText.trim()

        if (!q) return filteredData

        const fuse = new Fuse(filteredData, DATASET_METADATA_FUSE_OPTIONS)
        return fuse.search(q).map(r => r.item)
    }, [filteredData, searchText])

    if (isLoading) {
        return <LoadingView containerSx={{ height: "70vh", marginTop: "40px" }} />
    }

    if (isError) {
        return <ErrorView containerSx={{ height: "70vh", marginTop: "40px" }} />
    }

    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanel={
                <DatasetMetadataFilterCollapse
                    filters={filters}
                    setFilters={setFilters}
                    availableFilters={availableFilters}
                    clearFilters={() => setFilters({})}
                />
            }
            rightPanel={
                <Stack spacing={3} sx={{ pt: "8px" }}>
                    <DatasetMetadataTableOperations
                        geneBioType={geneBioType}
                        totalNum={count}
                        shownNum={searchedData.length}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={() => setIsShowLeft(prev => !prev)}
                        searchText={searchText}
                        handleSearchTextChange={setSearchText}
                    />

                    <DatasetMetadataTable
                        data={searchedData}
                        geneBioType={geneBioType}
                    />
                </Stack>
            }
        />
    )
}

const buildFilters = (datasets) => {
    return FILTER_FIELDS.reduce((acc, field) => {
        acc[field] = getUniqueValues(datasets, field)
        return acc
    }, {})
}

const getUniqueValues = (datasets, key) => {
    const values = datasets.flatMap(item => {
        const tokens = tokenize(item[key])
        return tokens.length > 0 ? tokens : [""]
    })

    return [...new Set(values)].sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { sensitivity: "base" })
    )
}

const tokenize = (raw) => {
    if (!raw) return []

    return String(raw)
        .split(/[,/;]/)
        .map(v => v.trim())
        .filter(Boolean)
}

const isBlank = (raw) => {
    return raw == null || String(raw).trim() === ""
}

export default DatasetMetadataTableContent
