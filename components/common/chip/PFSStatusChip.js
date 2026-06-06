import BasicChip from "@/components/ui/chips/BasicChip"

const PFSStatusChip = ({ value }) => {
    if (value === 0 || value === "0") {
        return (
            <BasicChip
                value="No Progression"
                color="green"
            />
        )
    }

    if (value === 1 || value === "1") {
        return (
            <BasicChip
                value="Progressed"
                color="orange"
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

export default PFSStatusChip
