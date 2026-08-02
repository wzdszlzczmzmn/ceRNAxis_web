"use client";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import AxisFinalResultCard
    from "@/components/features/common/AxisFinal/AxisFinalResultCard";
import {
    useSCSTHybridReferenceAxisFinal,
} from "@/components/features/workspace/hooks/AxisFinal/useSCSTHybridReferenceAxisFinal";
import SCSTHybridReferenceAxisFinalGroupSelector
    from "@/components/features/workspace/components/detail/SCSTHybridReference/AxisFinal/SCSTHybridReferenceAxisFinalGroupSelector";


const SCSTHybridReferenceAxisFinalSection = ({
    task,
    vizInfo,
}) => {
    const taskData = task?.data ?? {};

    const groupOptions = useMemo(
        () => vizInfo?.groupInfo?.groupOptions ?? [],
        [vizInfo?.groupInfo?.groupOptions]
    );

    const [groupValue, setGroupValue] = useState(null);

    useEffect(() => {
        if (!groupValue && groupOptions.length > 0) {
            setGroupValue(groupOptions[0].value);
        }
    }, [groupOptions, groupValue]);

    const {
        count,
        columns,
        results,
        isLoading,
        isError,
    } = useSCSTHybridReferenceAxisFinal({
        taskUUID: taskData.uuid,
        groupValue,
    });

    return (
        <AxisFinalResultCard
            title="ceRNA Axis Final Results"
            titleExtra={
                <SCSTHybridReferenceAxisFinalGroupSelector
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
            showProjectMatches
        />
    );
};


export default SCSTHybridReferenceAxisFinalSection;
