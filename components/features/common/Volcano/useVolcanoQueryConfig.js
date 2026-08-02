import { useEffect, useState } from "react";

const getInitialRnaType = available => {
    if (available.includes("mRNA")) return "mRNA";
    return available[0] ?? null;
};

const getInitialDegScope = available => {
    if (available.includes("all")) return "all";
    return available[0] ?? null;
};

export const useVolcanoQueryConfig = ({
    availableDegRnaTypes = [],
    availableDegScopes = ["all"],
}) => {
    const [queryConfig, setQueryConfig] = useState({
        rnaType: getInitialRnaType(availableDegRnaTypes),
        degScope: getInitialDegScope(availableDegScopes),
    });

    useEffect(() => {
        setQueryConfig(prev => {
            const next = {
                rnaType: availableDegRnaTypes.includes(prev.rnaType)
                    ? prev.rnaType
                    : getInitialRnaType(availableDegRnaTypes),

                degScope: availableDegScopes.includes(prev.degScope)
                    ? prev.degScope
                    : getInitialDegScope(availableDegScopes),
            };

            return (
                next.rnaType === prev.rnaType &&
                next.degScope === prev.degScope
            )
                ? prev
                : next;
        });
    }, [
        availableDegRnaTypes,
        availableDegScopes,
    ]);

    return {
        queryConfig,
        setQueryConfig,
    };
};
