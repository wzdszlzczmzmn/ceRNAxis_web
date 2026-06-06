import { useEffect, useState } from "react"
import { Alert, Button, Input } from "antd"
import { Box, Stack } from "@mui/system"
import { MAX_SELECTED_GENES } from "@/components/features/database/hooks/datasetDetail/useDatasetDetail"
import { FileTextOutlined } from "@ant-design/icons"
import BasicChip from "@/components/ui/chips/BasicChip"

const { TextArea } = Input

const parseGeneInput = (value) => {
    return value
        .split(",")
        .map(item => item.trim())
        .filter(Boolean)
}

const uniqueGenes = (genes) => {
    return [...new Set(genes)]
}

const ExpressionGeneInput = ({
    availableGenes,
    selectedGenes,
    setSelectedGenes,
    disabled = false,
}) => {
    const [draftValue, setDraftValue] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        setDraftValue(selectedGenes.join(", "))
    }, [selectedGenes])

    const handleApply = () => {
        const parsedGenes = uniqueGenes(parseGeneInput(draftValue))

        if (parsedGenes.length === 0) {
            setErrorMessage("Please input at least one gene.")
            return
        }

        if (parsedGenes.length > MAX_SELECTED_GENES) {
            setErrorMessage(`At most ${MAX_SELECTED_GENES} genes can be selected.`)
            return
        }

        const availableGeneSet = new Set(availableGenes)
        const missingGenes = parsedGenes.filter(gene => !availableGeneSet.has(gene))

        if (missingGenes.length > 0) {
            setErrorMessage(
                `Some genes are not available in this expression file: ${missingGenes.join(", ")}`
            )
            return
        }

        setErrorMessage("")
        setSelectedGenes(parsedGenes)
    }

    return (
        <Stack
            spacing={2}
            sx={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                p: 2.5,
                backgroundColor: "#fff",
            }}
        >
            <Alert
                type="info"
                showIcon
                message={
                    <Box component='span' sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                        Gene Input Rules:
                    </Box>
                }
                description={
                    <Box component='span' sx={{ fontSize: '14px' }}>
                        Input gene symbols separated only by English commas (,). Maximum {MAX_SELECTED_GENES} genes can be selected.
                    </Box>
                }
                icon={
                    <FileTextOutlined
                        style={{ fontSize: '24px', color: 'rgb(22, 119, 255)', marginRight: '12px' }}/>
                }
                style={{
                    marginBottom: 4,
                }}
            />

            <TextArea
                allowClear
                disabled={disabled}
                value={draftValue}
                placeholder="Input genes separated by English commas, e.g. TP53, BRCA1, EGFR"
                autoSize={{ minRows: 2, maxRows: 4 }}
                onChange={(e) => {
                    setDraftValue(e.target.value)
                    setErrorMessage("")
                }}
            />

            <Stack direction="row" spacing={2} alignItems="center">
                <Button
                    type="primary"
                    disabled={disabled}
                    onClick={handleApply}
                >
                    Apply Genes
                </Button>

                <BasicChip
                    value={`Selected ${selectedGenes.length} / ${MAX_SELECTED_GENES} genes`}
                    color="blue"
                />
            </Stack>

            {errorMessage && (
                <Alert
                    type="warning"
                    showIcon
                    message={errorMessage}
                />
            )}
        </Stack>
    )
}

export default ExpressionGeneInput
