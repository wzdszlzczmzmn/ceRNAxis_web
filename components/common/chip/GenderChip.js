import BasicChip from "@/components/ui/chips/BasicChip"

const genderConfig = {
    female: {
        label: "female",
        color: "magenta",
    },
    male: {
        label: "male",
        color: "blue",
    },
}

const GenderChip = ({ value }) => {
    if (!value) {
        return (
            <BasicChip
                value="Unknown"
                color="default"
            />
        )
    }

    const key = String(value).trim().toLowerCase()

    const config = genderConfig[key]

    if (!config) {
        return (
            <BasicChip
                value={value}
                color="default"
            />
        )
    }

    return (
        <BasicChip
            value={config.label}
            color={config.color}
        />
    )
}

export default GenderChip
