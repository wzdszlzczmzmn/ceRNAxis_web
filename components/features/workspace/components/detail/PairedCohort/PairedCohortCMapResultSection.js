"use client";

import CMapResultCard
    from "@/components/features/common/CMap/CMapResultCard";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import { usePairedCohortCMapResult } from "@/components/features/workspace/hooks/CMap/usePairedCohortCMapResult"


const PairedCohortCMapResultSection = ({
    task,
}) => {

    const taskData = getTaskData(task);


    const {
        columns,
        count,
        results,
        isLoading,
        isError,
    } = usePairedCohortCMapResult({
        taskUUID: isTaskSuccess(taskData.status)
            ? taskData.uuid
            : null,
    });


    return (
        <CMapResultCard
            title="CMap Results"
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
        />
    );
};


export default PairedCohortCMapResultSection;
