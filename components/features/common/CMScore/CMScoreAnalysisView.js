"use client";

import {
    useState,
} from "react";
import { Box, Stack } from "@mui/system";
import {
    Button,
    Splitter,
} from "antd";
import {
    MenuUnfoldOutlined,
} from "@ant-design/icons";

import LoadingView
    from "@/components/common/status/LoadingView";
import ErrorView
    from "@/components/common/status/ErrorView";
import EmptyView
    from "@/components/common/status/EmptyView";

import CMScoreControlPanel
    from "@/components/features/common/CMScore/CMScoreControlPanel";
import CMScorePathwayPlot
    from "@/components/features/visualization/components/CMScorePathwayPlot";

const hasPlotData = ({
    cmScoreData,
    selectedDataset,
}) => {
    if (
        !Array.isArray(cmScoreData?.results) ||
        !selectedDataset
    ) {
        return false;
    }

    return cmScoreData.results.some(
        row =>
            String(row?.dataset) ===
            String(selectedDataset)
    );
};

const CMScoreAnalysisView = ({
    taskType,
    title = "CM-Score Results",
    height = 660,

    groupOptions = [],
    groupValue = null,
    groupLabel = "Group",
    onGroupChange,

    selectedItem,
    itemOptions,
    itemLoading,
    onItemChange,

    selectedDataset,
    datasetOptions,
    datasetLoading,
    onDatasetChange,

    cmScoreData,

    isLoading = false,
    isError = false,

    missingDescription = null,
    unavailableDescription = null,
    emptyDescription = "No CM-score result data",
}) => {
    const [
        isControlPanelCollapsed,
        setIsControlPanelCollapsed,
    ] = useState(false);

    const renderPlotContent = () => {
        if (missingDescription) {
            return (
                <EmptyView
                    bordered
                    description={missingDescription}
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (unavailableDescription) {
            return (
                <EmptyView
                    bordered
                    description={
                        unavailableDescription
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (
            itemLoading ||
            isLoading
        ) {
            return (
                <LoadingView
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (isError) {
            return (
                <ErrorView
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (
            groupOptions.length > 0 &&
            !groupValue
        ) {
            return (
                <EmptyView
                    bordered
                    description="Select a group"
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (!selectedItem) {
            return (
                <EmptyView
                    bordered
                    description={
                        taskType ===
                        "CustomListQueryTask"
                            ? "Select a gene"
                            : "Select an axis"
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (!selectedDataset) {
            return (
                <EmptyView
                    bordered
                    description={
                        "Select a drug signature"
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        if (
            !hasPlotData({
                cmScoreData,
                selectedDataset,
            })
        ) {
            return (
                <EmptyView
                    bordered
                    description={
                        emptyDescription
                    }
                    containerSx={{
                        height: "100%",
                    }}
                />
            );
        }

        return (
            <CMScorePathwayPlot
                data={cmScoreData}
                selectedDataset={
                    selectedDataset
                }
                title="CM-Score Pathway Profile"
                height="100%"
                containerSx={{
                    minHeight: 0,
                }}
            />
        );
    };

    return (
        <Stack spacing={3}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    borderBottom:
                        "2px solid #e0e0e0",
                    pb: "12px",
                }}
            >
                <Box
                    component="h6"
                    sx={{
                        fontSize: "36px",
                        fontWeight: 700,
                        m: 0,
                    }}
                >
                    {title}
                </Box>

                <Box
                    component="span"
                    sx={{
                        fontSize: "14px",
                        color: "#595959",
                        marginTop: "24px",
                    }}
                >
                    TOTAL OF{" "}
                    <strong>
                        {
                            cmScoreData?.count ??
                            cmScoreData
                                ?.results
                                ?.length ??
                            0
                        }
                    </strong>{" "}
                    DRUG SIGNATURES
                </Box>
            </Stack>

            <Box
                sx={{
                    height,
                    minHeight: 540,
                    border:
                        "1px solid #e5e7eb",
                    borderRadius: 1,
                    overflow: "hidden",
                    bgcolor: "#fff",
                }}
            >
                <Splitter>
                    {!isControlPanelCollapsed && (
                        <Splitter.Panel
                            defaultSize={340}
                            min={280}
                            max={520}
                        >
                            <CMScoreControlPanel
                                taskType={taskType}

                                groupOptions={groupOptions}
                                groupValue={groupValue}
                                groupLabel={groupLabel}
                                onGroupChange={onGroupChange}

                                item={selectedItem}
                                itemOptions={itemOptions}
                                itemLoading={itemLoading}
                                onItemChange={onItemChange}

                                dataset={selectedDataset}
                                datasetOptions={datasetOptions}
                                datasetLoading={datasetLoading}
                                onDatasetChange={onDatasetChange}

                                onCollapse={() =>
                                    setIsControlPanelCollapsed(true)
                                }
                            />
                        </Splitter.Panel>
                    )}

                    <Splitter.Panel>
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                p: 2,
                                position: "relative",
                            }}
                        >
                            {isControlPanelCollapsed && (
                                <Button
                                    size="small"
                                    icon={
                                        <MenuUnfoldOutlined />
                                    }
                                    onClick={() =>
                                        setIsControlPanelCollapsed(
                                            false
                                        )
                                    }
                                    style={{
                                        position:
                                            "absolute",
                                        top: 12,
                                        left: 12,
                                        zIndex: 10,
                                    }}
                                >
                                    Controls
                                </Button>
                            )}

                            {renderPlotContent()}
                        </Box>
                    </Splitter.Panel>
                </Splitter>
            </Box>
        </Stack>
    );
};

export default CMScoreAnalysisView;
