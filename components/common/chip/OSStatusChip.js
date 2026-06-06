import BasicChip from "@/components/ui/chips/BasicChip"

const OSStatusChip = ({ value }) => {
    if (value === 0 || value === "0") {
        return (
            <BasicChip
                value="Alive"
                color="green"
            />
        )
    }

    if (value === 1 || value === "1") {
        return (
            <BasicChip
                value="Dead"
                color="red"
            />
        )
    }

    return (
        <BasicChip
            value="Unknown"
            color="default"
        />
    )
}

export default OSStatusChip
