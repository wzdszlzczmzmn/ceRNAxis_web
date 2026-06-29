import { Stack } from "@mui/system"
import LargeExpressionDataTable from "./LargeExpressionDataTable"

const LargeExpressionDataSection = ({
    dataset,
    expressionMode,
    availableExpressionTypes = [],
}) => {
    if (!dataset || availableExpressionTypes.length === 0) {
        return null
    }

    return (
        <Stack spacing={5}>
            {availableExpressionTypes.map(expressionType => (
                <LargeExpressionDataTable
                    key={expressionType}
                    dataset={dataset}
                    expressionMode={expressionMode}
                    expressionType={expressionType}
                />
            ))}
        </Stack>
    )
}

export default LargeExpressionDataSection
