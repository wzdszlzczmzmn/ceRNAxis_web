export const isEmptyValue = (value) => {
    return value === null || value === undefined || String(value).trim() === ""
}

export const normalizeFilterValue = (value) => {
    return isEmptyValue(value) ? "NA" : String(value).trim()
}

export const renderEmpty = (value) => {
    return isEmptyValue(value) ? "--" : value
}

export const stringSorter = (key) => (a, b) => {
    const av = isEmptyValue(a?.[key]) ? "" : String(a[key])
    const bv = isEmptyValue(b?.[key]) ? "" : String(b[key])

    return av.localeCompare(bv)
}

export const numberSorter = (key) => (a, b) => {
    const av = Number(a?.[key])
    const bv = Number(b?.[key])

    return (Number.isFinite(av) ? av : -Infinity) -
        (Number.isFinite(bv) ? bv : -Infinity)
}

export const getColumnFilters = (
    data,
    key,
    labelFormatter = normalizeFilterValue,
) => {
    const values = data.map(item => normalizeFilterValue(item?.[key]))

    return [...new Set(values)]
        .sort((a, b) => a.localeCompare(b))
        .map(value => ({
            text: labelFormatter(value),
            value,
        }))
}

export const getFilterProps = (data, key, labelFormatter) => {
    return {
        filters: getColumnFilters(data, key, labelFormatter),
        filterSearch: true,
        onFilter: (value, record) => {
            return normalizeFilterValue(record?.[key]) === value
        },
    }
}
