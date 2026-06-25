import { DATABASE_API_BASE } from "@/lib/api/config"

export const parseBlobErrorMessage = async (err) => {
    const data = err.response?.data;

    if (data instanceof Blob) {
        try {
            const text = await data.text();
            const json = JSON.parse(text);

            return (
                json.msg ||
                json.detail ||
                json.message ||
                "Download failed."
            );
        } catch {
            return "Download failed.";
        }
    }

    return (
        data?.msg ||
        data?.detail ||
        data?.message ||
        err.message ||
        "Download failed."
    );
};

export const getDatasetDetailURL = (dataset) => {
    if (!dataset) return null

    return `${DATABASE_API_BASE}/dataset_metadata/${dataset}/`
}

export const getDatasetSampleMetaURL = (dataset) => {
    if (!dataset) return null

    return `${DATABASE_API_BASE}/dataset_metadata/${dataset}/sample_meta/`
}


export const getDatasetDegVolcanoURL = ({ dataset, expressionType }) => {
    if (!dataset || !expressionType) return null

    const params = new URLSearchParams({
        dataset,
        expression_type: expressionType,
    })

    return `${DATABASE_API_BASE}/dataset_deg_volcano/?${params.toString()}`
}

export const getAliquotExpressionDownloadFilesURL = ({
    dataset,
}) => {
    const params = new URLSearchParams();

    params.set("dataset", dataset);

    return `${DATABASE_API_BASE}/aliquot_expression_download_files/?${params.toString()}`;
};

export const getAliquotExpressionFileDownloadURL = ({
    dataset,
    fileType,
    valueType,
}) => {
    const params = new URLSearchParams();

    params.set("dataset", dataset);
    params.set("file_type", fileType);

    if (fileType === "expression" && valueType) {
        params.set("value_type", valueType);
    }

    return `${DATABASE_API_BASE}/aliquot_expression_file_download/?${params.toString()}`;
};
