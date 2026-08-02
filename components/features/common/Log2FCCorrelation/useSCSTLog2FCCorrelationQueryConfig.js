import {
    useEffect,
    useMemo,
    useState,
} from "react";


const getInitialInteractionType = availableTypes => {
    if (availableTypes.includes("miRNA-mRNA")) {
        return "miRNA-mRNA";
    }

    return availableTypes[0] || null;
};


const getAvailableTypesForGroup = ({
    groupOptions,
    groupValue,
}) => {
    if (!groupValue) {
        return [];
    }

    const groupOption = groupOptions.find(
        item => item.value === groupValue
    );

    if (!groupOption) {
        return [];
    }

    if (groupOption.background_available === false) {
        return [];
    }

    return Array.isArray(
        groupOption.available_background_types
    )
        ? groupOption.available_background_types
        : [];
};


const getInitialGroupValue = groupOptions => {
    const firstAvailableGroup = groupOptions.find(item => {
        if (item.background_available === false) {
            return false;
        }

        return (
            Array.isArray(
                item.available_background_types
            ) &&
            item.available_background_types.length > 0
        );
    });

    return firstAvailableGroup?.value ?? null;
};


export const useSCSTLog2FCCorrelationQueryConfig = ({
    groupOptions = [],
}) => {
    const [
        queryConfig,
        setQueryConfig,
    ] = useState({
        groupValue: null,
        interactionType: null,
    });

    /*
     * Ensure groupValue always points to a valid group.
     *
     * This also handles vizInfo arriving asynchronously.
     */
    useEffect(() => {
        setQueryConfig(prev => {
            const currentGroupIsValid =
                groupOptions.some(item => (
                    item.value === prev.groupValue &&
                    item.background_available !== false
                ));

            if (currentGroupIsValid) {
                return prev;
            }

            return {
                ...prev,
                groupValue:
                    getInitialGroupValue(groupOptions),
            };
        });
    }, [groupOptions]);

    /*
     * availableTypes depends on the selected group.
     */
    const availableTypes = useMemo(() => {
        return getAvailableTypesForGroup({
            groupOptions,
            groupValue: queryConfig.groupValue,
        });
    }, [
        groupOptions,
        queryConfig.groupValue,
    ]);

    /*
     * When the group changes, ensure interactionType
     * is still valid for that group.
     */
    useEffect(() => {
        setQueryConfig(prev => {
            if (
                availableTypes.includes(
                    prev.interactionType
                )
            ) {
                return prev;
            }

            return {
                ...prev,
                interactionType:
                    getInitialInteractionType(
                        availableTypes
                    ),
            };
        });
    }, [availableTypes]);

    return {
        queryConfig,
        setQueryConfig,
        availableTypes,
    };
};
