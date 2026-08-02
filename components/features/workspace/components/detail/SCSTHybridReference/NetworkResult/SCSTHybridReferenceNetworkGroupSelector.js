import WorkflowGroupSelector from "@/components/features/common/GroupSelector/WorkflowGroupSelector"


const SCSTHybridReferenceNetworkGroupSelector = ({
    groupOptions = [],
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


export default SCSTHybridReferenceNetworkGroupSelector;
