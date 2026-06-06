import { Stack } from "@mui/system"
import ExpressionDataTable from "./ExpressionDataTable"

const ExpressionDataSection = ({
    dataset,
    availableExpressionTypes = [],
}) => {
    if (!dataset || availableExpressionTypes.length === 0) {
        return null
    }

    return (
        <Stack spacing={5}>
            {availableExpressionTypes.map(expressionType => (
                <ExpressionDataTable
                    key={expressionType}
                    dataset={dataset}
                    expressionType={expressionType}
                />
            ))}
        </Stack>
    )
}

export default ExpressionDataSection
