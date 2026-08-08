import DatasetAnnotationGroupBySelector
    from "@/components/features/database/components/datasetAnnotation/common/DatasetAnnotationGroupBySelector";


const SCSTAnnotationGroupBySelector = props => {
    return (
        <DatasetAnnotationGroupBySelector
            {...props}
            placeholder="Select group by"
            loadingPlaceholder="Loading group by..."
            description={
                "Controls the metadata grouping used by downstream SC/ST annotation visualizations."
            }
        />
    );
};


export default SCSTAnnotationGroupBySelector;
