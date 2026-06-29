import { useEffect, useState } from "react";

const getInitialInteractionType = availableTypes => {
    if (availableTypes.includes("miRNA-mRNA")) {
        return "miRNA-mRNA";
    }

    return availableTypes[0] || null;
};

export const useLog2FCCorrelationQueryConfig = ({
    availableTypes = [],
}) => {
    const [queryConfig, setQueryConfig] = useState({
        interactionType: getInitialInteractionType(availableTypes),
    });

    useEffect(() => {
        setQueryConfig(prev => {
            if (availableTypes.includes(prev.interactionType)) {
                return prev;
            }

            return {
                ...prev,
                interactionType: getInitialInteractionType(availableTypes),
            };
        });
    }, [availableTypes]);

    return {
        queryConfig,
        setQueryConfig,
    };
};
