import { useEffect, useState } from "react";

const getInitialRnaType = availableDegRnaTypes => {
    if (availableDegRnaTypes.includes("mRNA")) {
        return "mRNA";
    }

    return availableDegRnaTypes[0] || null;
};

const getInitialDegScope = availableDegScopes => {
    if (availableDegScopes.includes("all")) {
        return "all";
    }

    return availableDegScopes[0] || null;
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
            const nextRnaType = availableDegRnaTypes.includes(prev.rnaType)
                ? prev.rnaType
                : getInitialRnaType(availableDegRnaTypes);

            const nextDegScope = availableDegScopes.includes(prev.degScope)
                ? prev.degScope
                : getInitialDegScope(availableDegScopes);

            return {
                ...prev,
                rnaType: nextRnaType,
                degScope: nextDegScope,
            };
        });
    }, [availableDegRnaTypes, availableDegScopes]);

    return {
        queryConfig,
        setQueryConfig,
    };
};
