"use client";

import { useState } from "react";

import EnrichrAnalysisView
    from "@/components/features/common/Enrichr/EnrichrAnalysisView";
import {
    useCustomListQueryEnrichr,
} from "@/components/features/workspace/hooks/useCustomListQueryEnrichr";
import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";

const DEFAULT_VISUAL_CONFIG = {
    direction: "up",
    xAxisScale: "linear",
    topN: 30,
    showAll: false,
    rankingMethod: "combined_score_desc",
    searchInput: "",
    focusKeyword: "",
};

const CustomListQueryEnrichrSection = ({
    task,
    height = 680,
}) => {
    const [visualConfig, setVisualConfig] = useState(
        DEFAULT_VISUAL_CONFIG
    );

    const taskData = getTaskData(task);

    const taskUUID = taskData.uuid;
    const isSuccess = isTaskSuccess(taskData.status);
    const hasMrnaDirection = Boolean(
        taskData.has_mrna_direction
    );

    const canFetch = Boolean(
        taskUUID &&
        isSuccess &&
        hasMrnaDirection
    );

    const {
        enrichrData,
        summary,
        isLoading,
        isError,
    } = useCustomListQueryEnrichr({
        taskUUID: canFetch ? taskUUID : null,
        direction: visualConfig.direction,
    });

    if (!hasMrnaDirection) {
        return null;
    }

    return (
        <EnrichrAnalysisView
            title="mRNA Pathway Enrichment"
            plotTitle={
                visualConfig.direction === "up"
                    ? "Upregulated mRNA Enrichment"
                    : "Downregulated mRNA Enrichment"
            }
            height={height}
            enrichrData={enrichrData}
            summary={summary}
            isLoading={isLoading}
            isError={isError}
            visualConfig={visualConfig}
            setVisualConfig={setVisualConfig}
            missingDescription={
                !taskUUID
                    ? "Missing task UUID"
                    : null
            }
            unavailableDescription={
                taskUUID && !isSuccess
                    ? "Enrichment result is available only after the task succeeds."
                    : null
            }
            emptyDescription={
                visualConfig.direction === "up"
                    ? "No upregulated mRNA Enrichment data"
                    : "No downregulated mRNA Enrichment data"
            }
        />
    );
};

export default CustomListQueryEnrichrSection;
