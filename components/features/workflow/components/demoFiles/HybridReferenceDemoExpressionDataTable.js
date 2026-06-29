"use client";

import { useEffect, useMemo, useState } from "react";
import { Box, Stack } from "@mui/system";
import { Button, Card } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";

import LoadingView from "@/components/common/status/LoadingView";
import ErrorView from "@/components/common/status/ErrorView";
import EmptyView from "@/components/common/status/EmptyView";
import BasicChip from "@/components/ui/chips/BasicChip";
import EllipsisText from "@/components/common/text/EllipsisText";
import { StyledTable } from "@/components/ui/table/StyledTable";

import ExpressionGeneInput
    from "@/components/features/database/components/datasetDetail/ExpressionGeneInput";
import AvailableGeneModal
    from "@/components/features/database/components/datasetDetail/AvailableGeneModal";

import { useHybridReferenceDemoExpressionGeneList }
    from "@/components/features/workflow/hooks/useHybridReferenceDemoExpressionGeneList";
import { useHybridReferenceDemoExpressionData }
    from "@/components/features/workflow/hooks/useHybridReferenceDemoExpressionData";

const DEFAULT_SELECTED_GENE_COUNT = 5;

const getDefaultSelectedGenes = (genes) => {
    return genes.slice(0, DEFAULT_SELECTED_GENE_COUNT);
};

const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === "";
};

const numberSorter = (key) => (a, b) => {
    const av = Number(a?.[key]);
    const bv = Number(b?.[key]);

    return (Number.isFinite(av) ? av : -Infinity) -
        (Number.isFinite(bv) ? bv : -Infinity);
};

const stringSorter = (key) => (a, b) => {
    const av = isEmptyValue(a?.[key]) ? "" : String(a[key]);
    const bv = isEmptyValue(b?.[key]) ? "" : String(b[key]);

    return av.localeCompare(bv);
};

const buildExpressionColumns = (columns) => {
    if (!columns || columns.length === 0) return [];

    return columns.map((column, index) => {
        if (index === 0) {
            return {
                title: "Sample ID",
                dataIndex: column,
                fixed: "left",
                align: "center",
                sorter: stringSorter(column),
                render: value => (
                    <BasicChip
                        value={value}
                        color="volcano"
                    />
                ),
            };
        }

        return {
            title: column,
            dataIndex: column,
            align: "center",
            sorter: numberSorter(column),
            render: value => (
                <EllipsisText
                    text={
                        isEmptyValue(value)
                            ? "--"
                            : Number(value).toFixed(4)
                    }
                />
            ),
        };
    });
};

const getExpressionTitle = (rnaType) => {
    return `${rnaType} Expression File`;
};

const HybridReferenceDemoExpressionDataTable = ({
    rnaType = "mRNA",
}) => {
    const [selectedGenes, setSelectedGenes] = useState([]);
    const [isGeneModalOpen, setIsGeneModalOpen] = useState(false);

    const {
        genes,
        count: geneCount,
        isLoading: isGeneLoading,
        isError: isGeneError,
    } = useHybridReferenceDemoExpressionGeneList({
        rnaType,
    });

    useEffect(() => {
        setSelectedGenes([]);
    }, [rnaType]);

    useEffect(() => {
        if (genes.length > 0 && selectedGenes.length === 0) {
            setSelectedGenes(getDefaultSelectedGenes(genes));
        }
    }, [genes, selectedGenes.length]);

    const {
        count,
        columns,
        results,
        isLoading: isExpressionLoading,
        isError: isExpressionError,
    } = useHybridReferenceDemoExpressionData({
        rnaType,
        genes: selectedGenes,
    });

    const tableColumns = useMemo(() => {
        return buildExpressionColumns(columns);
    }, [columns]);

    const renderContent = () => {
        if (isGeneLoading) {
            return <LoadingView containerSx={{ height: "420px" }} />;
        }

        if (isGeneError) {
            return <ErrorView containerSx={{ height: "420px" }} />;
        }

        if (!genes.length) {
            return (
                <EmptyView
                    bordered
                    description={`No ${rnaType} expression gene list found.`}
                    containerSx={{ height: "420px" }}
                />
            );
        }

        return (
            <Stack spacing={3}>
                <AvailableGeneModal
                    open={isGeneModalOpen}
                    onClose={() => setIsGeneModalOpen(false)}
                    genes={genes}
                    expressionType={rnaType}
                />

                <ExpressionGeneInput
                    availableGenes={genes}
                    selectedGenes={selectedGenes}
                    setSelectedGenes={setSelectedGenes}
                    disabled={isExpressionLoading}
                />

                {isExpressionError ? (
                    <ErrorView containerSx={{ height: "30vh" }} />
                ) : (
                    <StyledTable
                        loading={isExpressionLoading}
                        columns={tableColumns}
                        rowKey={(record) => record[columns?.[0]]}
                        dataSource={results}
                        scroll={{ x: "max-content" }}
                        pagination={{
                            total: count,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => (
                                <Box
                                    component="span"
                                    fontSize="14px"
                                    marginRight="16px"
                                >
                                    Total <strong>{total}</strong> samples
                                </Box>
                            ),
                        }}
                    />
                )}
            </Stack>
        );
    };

    return (
        <Card
            title={
                <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                >
                    <Box
                        component="span"
                        sx={{
                            fontSize: "24px",
                            fontWeight: 700,
                        }}
                    >
                        {getExpressionTitle(rnaType)}
                    </Box>

                    <BasicChip
                        value={rnaType}
                        color="blue"
                    />
                </Stack>
            }
            extra={
                !isGeneLoading && !isGeneError && genes.length > 0 ? (
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <BasicChip
                            value={`${geneCount.toLocaleString()} Genes Available`}
                            color="blue"
                            style={{
                                height: "32px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0 12px",
                                fontSize: "13px",
                                fontWeight: 500,
                            }}
                        />

                        <Button
                            type="primary"
                            icon={<DatabaseOutlined />}
                            onClick={() => setIsGeneModalOpen(true)}
                        >
                            Browse Genes
                        </Button>
                    </Stack>
                ) : null
            }
            styles={{
                body: {
                    padding: 16,
                },
            }}
        >
            {renderContent()}
        </Card>
    );
};

export default HybridReferenceDemoExpressionDataTable;
