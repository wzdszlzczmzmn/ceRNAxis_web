import { Card, Select, Typography } from "antd";
import { Stack } from "@mui/system";


const { Text } = Typography;


const DatasetAnnotationGroupBySelector = ({
    value,
    onChange,
    options = [],
    loading = false,
    disabled = false,

    title = "Annotation Group By",
    placeholder = "Select group type",
    loadingPlaceholder = "Loading group types...",
    description = null,

    selectWidth = 420,
}) => {
    const normalizedOptions = (
        Array.isArray(options)
            ? options
            : []
    ).map(option => ({
        value: option.value,
        label: option.label,

        disabled: (
            option.disabled
            ?? option.available === false
        ),
    }));

    const isDisabled = (
        disabled
        || loading
        || normalizedOptions.length === 0
    );

    return (
        <Card
            title={
                <Text
                    strong
                    style={{
                        fontSize: 16,
                    }}
                >
                    {title}
                </Text>
            }
            styles={{
                header: {
                    minHeight: 48,
                    padding: "0 20px",
                },
                body: {
                    padding: "16px 20px",
                },
            }}
            style={{
                borderRadius: 8,
            }}
        >
            <Stack
                direction={{
                    xs: "column",
                    md: "row",
                }}
                spacing={2}
                alignItems={{
                    xs: "stretch",
                    md: "center",
                }}
                justifyContent="space-between"
            >
                <Select
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    loading={loading}
                    placeholder={
                        loading
                            ? loadingPlaceholder
                            : placeholder
                    }
                    size="middle"
                    style={{
                        width: selectWidth,
                        maxWidth: "100%",
                        flexShrink: 0,
                    }}
                    options={normalizedOptions}
                />

                {description && (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent={{
                            xs: "flex-start",
                            md: "flex-end",
                        }}
                        sx={{
                            flexWrap: "wrap",
                        }}
                    >
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 13,
                                lineHeight: "22px",
                            }}
                        >
                            {description}
                        </Text>
                    </Stack>
                )}
            </Stack>
        </Card>
    );
};


export default DatasetAnnotationGroupBySelector;
