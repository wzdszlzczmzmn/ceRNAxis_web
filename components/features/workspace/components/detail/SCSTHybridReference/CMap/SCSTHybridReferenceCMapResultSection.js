"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import CMapResultCard
    from "@/components/features/common/CMap/CMapResultCard";

import {
    getTaskData,
    isTaskSuccess,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import {
    useSCSTHybridReferenceCMapResult
} from "@/components/features/workspace/hooks/CMap/useSCSTHybridReferenceCMapResult"
import SCSTHybridReferenceCMapGroupSelector
    from "@/components/features/workspace/components/detail/SCSTHybridReference/CMap/SCSTHybridReferenceCMapGroupSelector"


const SCSTHybridReferenceCMapResultSection = ({
    task,
    vizInfo,
}) => {

    const taskData = getTaskData(task);


    const groupOptions = useMemo(
        () =>
            vizInfo?.groupInfo?.groupOptions ?? [],
        [vizInfo?.groupInfo?.groupOptions]
    );


    const [
        groupValue,
        setGroupValue,
    ] = useState(null);


    useEffect(() => {
        if (!groupValue && groupOptions.length) {
            setGroupValue(
                groupOptions[0].value
            );
        }
    }, [
        groupOptions,
        groupValue,
    ]);


    const {
        columns,
        count,
        results,
        isLoading,
        isError,
    } = useSCSTHybridReferenceCMapResult({
        taskUUID:
            isTaskSuccess(taskData.status)
                ? taskData.uuid
                : null,

        groupValue,
    });


    return (
        <CMapResultCard
            title="CMap Results"
            titleExtra={
                <SCSTHybridReferenceCMapGroupSelector
                    groupOptions={groupOptions}
                    value={groupValue}
                    onChange={setGroupValue}
                />
            }
            count={count}
            columns={columns}
            results={results}
            isLoading={isLoading}
            isError={isError}
        />
    );
};


export default SCSTHybridReferenceCMapResultSection;
