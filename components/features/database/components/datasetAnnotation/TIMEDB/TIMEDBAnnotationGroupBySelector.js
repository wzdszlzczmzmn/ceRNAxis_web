import { Stack } from "@mui/system";
import { Card, Select, Tag, Typography } from "antd";

const { Text } = Typography;

const TIMEDBAnnotationGroupBySelector = ({
    value,
    onChange,
    options = [],
    loading = false,
    disabled = false,
}) => {
    const selectOptions = options.map((option) => ({
        value: option.value,
        label: option.label,
    }));

    const isDisabled = disabled || loading || options.length === 0;

    return (
        <Card
            title={
                <Text
                    strong
                    style={{
                        fontSize: 16,
                    }}
                >
                    Annotation Group By
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
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", md: "center" }}
                justifyContent="space-between"
            >
                <Select
                    value={value}
                    onChange={onChange}
                    disabled={isDisabled}
                    loading={loading}
                    placeholder={
                        loading
                            ? "Loading group types..."
                            : "Select group type"
                    }
                    size="middle"
                    style={{
                        width: 420,
                        maxWidth: "100%",
                        flexShrink: 0,
                    }}
                    options={selectOptions}
                />

                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent={{ xs: "flex-start", md: "flex-end" }}
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
                        Controls the grouping type used by downstream annotation result requests.
                    </Text>
                </Stack>
            </Stack>
        </Card>
    );
};

export default TIMEDBAnnotationGroupBySelector;
