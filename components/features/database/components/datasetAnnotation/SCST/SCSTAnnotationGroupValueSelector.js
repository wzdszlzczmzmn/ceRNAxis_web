import WorkflowGroupSelector
    from "@/components/features/common/GroupSelector/WorkflowGroupSelector";


const SCSTAnnotationGroupValueSelector = ({
    options = [],
    value,
    onChange,
}) => {
    const selectOptions = (
        Array.isArray(options)
            ? options
            : []
    ).map(option => ({
        value: option.value,
        label: option.label,
    }));

    return (
        <WorkflowGroupSelector
            options={selectOptions}
            value={value}
            onChange={onChange}
        />
    );
};


export default SCSTAnnotationGroupValueSelector;
