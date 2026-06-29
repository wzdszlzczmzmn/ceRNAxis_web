import {
    getListCount,
    getStatusBadge,
    getTaskData,
} from "@/components/features/workspace/components/taskInformation/taskStatusUtils";
import { Space } from "antd"
import BasicChip from "@/components/ui/chips/BasicChip"

const formatMapInfoLabel = (mapInfo) => {
    if (!mapInfo) return "--";

    return String(mapInfo).replace(/^ImmiRImmiR_/, "");
};

const formatChipValue = (value, color = "blue") => {
    if (value === undefined || value === null || value === "") {
        return "--";
    }

    return (
        <BasicChip
            value={value}
            color={color}
        />
    );
};

const formatDegMethod = (method) => {
    if (!method) return "--";

    const colorMap = {
        limma: "green",
        deseq2: "purple",
    };

    return (
        <BasicChip
            value={method}
            color={colorMap[String(method).toLowerCase()] || "blue"}
        />
    );
};

const formatBooleanChip = (value, trueLabel = "True", falseLabel = "False") => {
    if (value === undefined || value === null) {
        return "--";
    }

    return (
        <BasicChip
            value={value ? trueLabel : falseLabel}
            color={value ? "green" : "orange"}
        />
    );
};

const formatUsePadj = (usePadj) => {
    if (usePadj === undefined || usePadj === null) {
        return "--";
    }

    return (
        <BasicChip
            value={usePadj ? "Adjusted p-value" : "Raw p-value"}
            color={usePadj ? "green" : "orange"}
        />
    );
};

const formatUploadedRnaTypes = (rnaTypes = []) => {
    if (!Array.isArray(rnaTypes) || rnaTypes.length === 0) {
        return "--";
    }

    return (
        <Space size={6} wrap>
            {rnaTypes.map(rnaType => (
                <BasicChip
                    key={rnaType}
                    value={rnaType}
                    color="blue"
                />
            ))}
        </Space>
    );
};

const formatCutoff = (cutoff, logfcColor = "blue", pvalueColor = "orange") => {
    if (!cutoff) return "--";

    const logfc = cutoff.logfc_cutoff ?? "--";
    const pvalue = cutoff.pvalue_cutoff ?? "--";

    return (
        <Space size={6} wrap>
            <BasicChip
                value={`log2FC ≥ ${logfc}`}
                color={logfcColor}
            />

            <BasicChip
                value={`p-value ≤ ${pvalue}`}
                color={pvalueColor}
            />
        </Space>
    );
};

const generateBaseTaskItems = (taskInformation) => {
    const data = getTaskData(taskInformation);

    return [
        {
            key: "TaskUUID",
            label: "Task UUID",
            children: data.uuid || "--",
            span: 2,
        },
        {
            key: "Status",
            label: "Status",
            children: getStatusBadge(taskInformation),
            span: 2,
        },
        {
            key: "TaskType",
            label: "Task Type",
            children: taskInformation?.task_type || data.task_type || "--",
            span: 2,
        },
        {
            key: "CreateTime",
            label: "Create Time",
            children: data.create_time || "--",
            span: 1,
        },
        {
            key: "FinishTime",
            label: "Finish Time",
            children: data.finish_time || "--",
            span: 1,
        },
    ];
};

const generateCustomListQueryTaskItems = (taskInformation) => {
    const data = getTaskData(taskInformation);

    const rnas = data.rnas ?? {};
    const params = data.params ?? data.workflow_params ?? {};

    const taskName =
        data.task_name ||
        params.task_name ||
        data.name ||
        "--";

    const mapInfo =
        data.map_info ||
        params.map_info ||
        "--";

    return [
        {
            key: "TaskName",
            label: "Task Name",
            children: taskName,
            span: 2,
        },
        {
            key: "MapInfo",
            label: "Immune Annotation File",
            children: formatChipValue(
                formatMapInfoLabel(data.map_info),
                "blue"
            ),
            span: 2,
        },
        {
            key: "miRNACount",
            label: "miRNA Count",
            children:
                data.miRNA_count ??
                data.mirna_count ??
                getListCount(rnas.miRNA),
            span: 1,
        },
        {
            key: "mRNACount",
            label: "mRNA Count",
            children:
                data.mRNA_count ??
                data.mrna_count ??
                getListCount(rnas.mRNA),
            span: 1,
        },
        {
            key: "lncRNACount",
            label: "lncRNA Count",
            children:
                data.lncRNA_count ??
                data.lncrna_count ??
                getListCount(rnas.lncRNA),
            span: 1,
        },
        {
            key: "circRNACount",
            label: "circRNA Count",
            children:
                data.circRNA_count ??
                data.circrna_count ??
                getListCount(rnas.circRNA),
            span: 1,
        },
    ];
};

const generatePairedCohortTaskItems = (taskInformation) => {
    const data = getTaskData(taskInformation);

    const cutoffs = data.cutoffs ?? {};
    const uploadedRnaTypes = Array.isArray(data.uploaded_rna_types)
        ? data.uploaded_rna_types
        : [];

    const hasLncrnaFile =
        data.has_lncrna_file !== undefined && data.has_lncrna_file !== null
            ? data.has_lncrna_file
            : uploadedRnaTypes.length > 0
                ? uploadedRnaTypes.includes("lncRNA")
                : Boolean(data.files?.lncrna_file);

    const hasCircrnaFile =
        data.has_circrna_file !== undefined && data.has_circrna_file !== null
            ? data.has_circrna_file
            : uploadedRnaTypes.length > 0
                ? uploadedRnaTypes.includes("circRNA")
                : Boolean(data.files?.circrna_file);

    const items = [
        {
            key: "TaskName",
            label: "Task Name",
            children: data.task_name || "--",
            span: 2,
        },
        {
            key: "MapInfo",
            label: "Immune Annotation File",
            children: formatChipValue(
                formatMapInfoLabel(data.map_info),
                "blue"
            ),
            span: 1,
        },
        {
            key: "DEGMethod",
            label: "DEG Method",
            children: formatDegMethod(data.deg_method),
            span: 1,
        },
        {
            key: "CancerType",
            label: "Cancer Type",
            children: formatChipValue(data.cancer_type || "None", "purple"),
            span: 1,
        },
        {
            key: "UsePadj",
            label: "P-value Type",
            children: formatUsePadj(data.use_padj),
            span: 1,
        },
        {
            key: "UploadedRnaTypes",
            label: "Uploaded RNA Types",
            children: formatUploadedRnaTypes(uploadedRnaTypes),
            span: 2,
        },
        {
            key: "mRNACutoff",
            label: "mRNA DEG Cutoff",
            children: formatCutoff(cutoffs.mRNA),
            span: 2,
        },
        {
            key: "miRNACutoff",
            label: "miRNA DEG Cutoff",
            children: formatCutoff(cutoffs.miRNA),
            span: 2,
        },
    ];

    if (hasLncrnaFile) {
        items.push({
            key: "lncRNACutoff",
            label: "lncRNA DEG Cutoff",
            children: formatCutoff(cutoffs.lncRNA),
            span: 2,
        });
    }

    if (hasCircrnaFile) {
        items.push({
            key: "circRNACutoff",
            label: "circRNA DEG Cutoff",
            children: formatCutoff(cutoffs.circRNA),
            span: 2,
        });
    }

    return items;
};

const generateHybridReferenceTaskItems = (taskInformation) => {
    const data = getTaskData(taskInformation);

    const cutoffs = data.cutoffs ?? {};
    const uploadedRnaTypes = Array.isArray(data.uploaded_rna_types)
        ? data.uploaded_rna_types
        : [];

    return [
        {
            key: "TaskName",
            label: "Task Name",
            children: data.task_name || "--",
            span: 2,
        },
        {
            key: "MapInfo",
            label: "Immune Annotation File",
            children: formatChipValue(
                formatMapInfoLabel(data.map_info),
                "blue"
            ),
            span: 1,
        },
        {
            key: "TCGAType",
            label: "TCGA Reference Type",
            children: formatChipValue(data.tcga_type, "purple"),
            span: 1,
        },
        {
            key: "LncRNAType",
            label: "lncRNA Reference Value Type",
            children: formatChipValue(data.lncrna_type, "cyan"),
            span: 1,
        },
        {
            key: "DEGMethod",
            label: "DEG Method",
            children: formatDegMethod(data.deg_method),
            span: 1,
        },
        {
            key: "UsePadj",
            label: "P-value Type",
            children: formatUsePadj(data.use_padj),
            span: 1,
        },
        {
            key: "UploadedRnaTypes",
            label: "Uploaded RNA Types",
            children: formatUploadedRnaTypes(uploadedRnaTypes),
            span: 1,
        },
        {
            key: "mRNACutoff",
            label: "mRNA DEG Cutoff",
            children: formatCutoff(
                cutoffs.mRNA,
                "blue",
                data.use_padj ? "green" : "orange"
            ),
            span: 2,
        },
    ];
};

const TASK_INFORMATION_ITEM_GENERATOR_MAP = {
    CustomListQueryTask: generateCustomListQueryTaskItems,
    PairedCohortTask: generatePairedCohortTaskItems,
    HybridReferenceTask: generateHybridReferenceTaskItems,
};

export const generateTaskInformationItems = (taskInformation) => {
    const taskType = taskInformation?.task_type;

    const baseItems = generateBaseTaskItems(taskInformation);

    const taskSpecificGenerator =
        TASK_INFORMATION_ITEM_GENERATOR_MAP[taskType];

    if (!taskSpecificGenerator) {
        return baseItems;
    }

    return [
        ...baseItems,
        ...taskSpecificGenerator(taskInformation),
    ];
};
