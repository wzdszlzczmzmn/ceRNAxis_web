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
    const rnaCounts = data.rna_counts ?? {};

    const taskName =
        data.task_name ||
        params.task_name ||
        data.name ||
        "--";

    const cancerType =
        data.cancer_type ||
        params.cancer_type ||
        "--";

    const hasMrnaDirection = Boolean(
        data.has_mrna_direction ??
        params.has_mrna_direction ??
        false
    );

    const miRNACount =
        data.miRNA_count ??
        data.mirna_count ??
        rnaCounts.miRNA ??
        getListCount(rnas.miRNA);

    const mRNACount =
        data.mRNA_count ??
        data.mrna_count ??
        rnaCounts.mRNA ??
        getListCount(rnas.mRNA);

    const mRNAUpCount =
        data.mRNA_up_count ??
        data.mrna_up_count ??
        rnaCounts.mRNA_up ??
        getListCount(rnas.mRNA_up);

    const mRNADownCount =
        data.mRNA_down_count ??
        data.mrna_down_count ??
        rnaCounts.mRNA_down ??
        getListCount(rnas.mRNA_down);

    const lncRNACount =
        data.lncRNA_count ??
        data.lncrna_count ??
        rnaCounts.lncRNA ??
        getListCount(rnas.lncRNA);

    const circRNACount =
        data.circRNA_count ??
        data.circrna_count ??
        rnaCounts.circRNA ??
        getListCount(rnas.circRNA);

    const calculatedTotalRNACount = hasMrnaDirection
        ? (
            miRNACount +
            mRNAUpCount +
            mRNADownCount +
            lncRNACount +
            circRNACount
        )
        : (
            miRNACount +
            mRNACount +
            lncRNACount +
            circRNACount
        );

    const totalRNACount =
        data.total_rna_count ??
        rnaCounts.total ??
        calculatedTotalRNACount;

    const items = [
        {
            key: "TaskName",
            label: "Task Name",
            children: taskName,
            span: 2,
        },
        {
            key: "CancerType",
            label: "Cancer Type",
            children: formatChipValue(cancerType, "purple"),
            span: 1,
        },
        {
            key: "HasMrnaDirection",
            label: "mRNA Direction",
            children: formatBooleanChip(
                hasMrnaDirection,
                "Directional",
                "Non-directional"
            ),
            span: 1,
        },
        {
            key: "TotalRNACount",
            label: "Total RNA Count",
            children: totalRNACount,
            span: 2,
        },
        {
            key: "miRNACount",
            label: "miRNA Count",
            children: miRNACount,
            span: 1,
        },
    ];

    if (hasMrnaDirection) {
        items.push(
            {
                key: "mRNAUpCount",
                label: "mRNA Up Count",
                children: mRNAUpCount,
                span: 1,
            },
            {
                key: "mRNADownCount",
                label: "mRNA Down Count",
                children: mRNADownCount,
                span: 1,
            }
        );
    } else {
        items.push({
            key: "mRNACount",
            label: "mRNA Count",
            children: mRNACount,
            span: 1,
        });
    }

    items.push(
        {
            key: "lncRNACount",
            label: "lncRNA Count",
            children: lncRNACount,
            span: 1,
        },
        {
            key: "circRNACount",
            label: "circRNA Count",
            children: circRNACount,
            span: 1,
        }
    );

    if (data.map_info) {
        items.splice(2, 0, {
            key: "MapInfo",
            label: "Legacy Immune Annotation File",
            children: formatChipValue(
                formatMapInfoLabel(data.map_info),
                "blue"
            ),
            span: 1,
        });
    }

    return items;
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

const generateSCSTHybridReferenceTaskItems = (taskInformation) => {
    const data = getTaskData(taskInformation);

    const cutoffs = data.cutoffs ?? {};
    const uploadedRnaTypes = Array.isArray(data.uploaded_rna_types)
        ? data.uploaded_rna_types
        : [];

    const dataTypeLabel =
        data.data_type_label ||
        (
            data.data_type === "sc"
                ? "Single-cell RNA-seq"
                : data.data_type === "st"
                    ? "Spatial transcriptomics"
                    : data.data_type
        ) ||
        "--";

    return [
        {
            key: "TaskName",
            label: "Task Name",
            children: data.task_name || "--",
            span: 2,
        },
        {
            key: "DataType",
            label: "Data Type",
            children: formatChipValue(
                dataTypeLabel,
                data.data_type === "st" ? "purple" : "blue"
            ),
            span: 1,
        },
        {
            key: "GroupColumn",
            label: "Group Column",
            children: formatChipValue(data.group_col, "geekblue"),
            span: 1,
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
    SCSTHybridReferenceTask: generateSCSTHybridReferenceTaskItems,
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
