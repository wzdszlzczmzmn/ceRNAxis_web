import { Stack } from "@mui/system"
import ExpressionDataTable from "./ExpressionDataTable"

const ExpressionDataSection = ({
    dataset,
    rnaType,
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
                    rnaType={rnaType}
                    expressionType={expressionType}
                />
            ))}
        </Stack>
    )
}

export default ExpressionDataSection
