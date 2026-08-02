import WorkflowGroupSelector
    from "@/components/features/common/GroupSelector/WorkflowGroupSelector";


const SCSTHybridReferenceAxisFinalGroupSelector = ({
    groupOptions,
    value,
    onChange,
}) => {

    return (
        <WorkflowGroupSelector
            options={
                groupOptions.map(item => ({
                    label:item.label,
                    value:item.value,
                }))
            }
            value={value}
            onChange={onChange}
        />
    );
};


export default SCSTHybridReferenceAxisFinalGroupSelector;
