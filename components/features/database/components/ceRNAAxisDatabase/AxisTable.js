import useCeRNAAxisFilterOptions from "@/components/features/database/hooks/ceRNAAxisDatabase/useCeRNAAxisFilterOptions"
import { useCallback, useEffect, useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import AxisFilterCollapse from "@/components/features/database/components/ceRNAAxisDatabase/AxisFilterCollapse"
import LoadingView from "@/components/common/status/LoadingView"
import ErrorView from "@/components/common/status/ErrorView"
import { Stack } from "@mui/system"
import AxisTableOperations from "@/components/features/database/components/ceRNAAxisDatabase/AxisTableOperations"
import { StyledTable } from "@/components/ui/table/StyledTable"
import api from "@/lib/api/axios"
import { getCeRNAAxisTableRecordsURL } from "@/lib/api/database/ceRNAAxisDatabase"
import BasicChip from "@/components/ui/chips/BasicChip"
import { Space } from "antd"

const columns = [
    {
        title: 'miRNA',
        dataIndex: 'miRNA',
        key: 'miRNA',
        align: 'center',
        fixed: 'left',
        sorter: true,
        render: value => (
            <BasicChip value={value} color='purple'/>
        )
    },
    {
        title: 'ceRNA',
        dataIndex: 'ceRNA',
        key: 'ceRNA',
        align: 'center',
        fixed: 'left',
        sorter: true,
        render: value => (
            <BasicChip value={value} color='volcano'/>
        )
    },
    {
        title: 'Species',
        dataIndex: 'species',
        key: 'species',
        align: 'center',
        sorter: true
    },
    {
        title: 'Database',
        dataIndex: 'databases',
        key: 'databases',
        align: 'center',
        render: valueList => (
            <Space wrap size={2}>
                {
                    valueList.map(value => (
                        <BasicChip value={value} color='gold' key={value}/>
                    ))
                }
            </Space>
        )
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        align: 'center',
        sorter: true
    }
]

const AxisTableWrapper = ({}) => {
    const { filterOptions, isLoading, isError } = useCeRNAAxisFilterOptions()

    if (isLoading) return <LoadingView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    if (isError) return <ErrorView containerSx={{ height: '80vh', marginTop: '40px' }}/>

    return (
        <AxisTableContent filterOptions={filterOptions} />
    )
}

const AxisTableContent = ({ filterOptions }) => {
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [filters, setFilters] = useState({})
    const [search, setSearch] = useState({
        field: "miRNA",
        value: ""
    })

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    })

    const [sorter, setSorter] = useState({
        field: null,
        order: null,
    })

    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)

    const handleIsShowLeftChange = () => {
        setIsShowLeft(prev => !prev)
    }

    const clearFilters = () => {
        setFilters({})
        setPagination(prev => ({
            ...prev,
            current: 1,
        }))
    }

    const handleSearch = (search) => {
        setSearch(search);
        setPagination(prev => ({
            ...prev,
            current: 1,
        }));
    };

    const fetchTableData = useCallback(async () => {
        setLoading(true);

        try {
            const params = {
                page: pagination.current,
                page_size: pagination.pageSize,

                search_field: search.field,
                search_value: search.value,

                filters,

                sort_field: sorter.field,
                sort_order: sorter.order,
            };

            const res = await api.post(
                getCeRNAAxisTableRecordsURL(),
                params,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = res.data;

            setTableData(data.results || []);
            setPagination(prev => ({
                ...prev,
                total: data.count || 0,
            }));
        } finally {
            setLoading(false);
        }
    }, [
        pagination.current,
        pagination.pageSize,
        search,
        filters,
        sorter,
    ]);

    useEffect(() => {
        fetchTableData();
    }, [fetchTableData]);

    const handleTableChange = (newPagination, tableFilters, tableSorter) => {
        setPagination(prev => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        }));

        setSorter({
            field: tableSorter.field || null,
            order: tableSorter.order || null,
        });
    };


    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanel={
                <AxisFilterCollapse
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                    clearFilters={clearFilters}
                />
            }
            rightPanel={
                <Stack spacing={3} sx={{ pt: '8px' }}>
                    <AxisTableOperations
                        recordNum={pagination.total}
                        isShowLeft={isShowLeft}
                        handleIsShowLeftChange={handleIsShowLeftChange}
                        handleSearch={handleSearch}
                    />
                    <StyledTable
                        rowKey="id"
                        columns={columns}
                        dataSource={tableData}
                        loading={loading}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true
                        }}
                        onChange={handleTableChange}
                    />
                </Stack>
            }
        />
    )
}

export default AxisTableWrapper
