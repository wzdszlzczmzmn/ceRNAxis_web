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

const formatCutoff = (cutoff, logfcColor = "blue", padjColor = "orange") => {
    if (!cutoff) return "--";

    const logfc = cutoff.logfc_cutoff ?? "--";
    const padj = cutoff.padj_cutoff ?? "--";

    return (
        <Space size={6} wrap>
            <BasicChip
                value={`log2FC ≥ ${logfc}`}
                color={logfcColor}
            />

            <BasicChip
                value={`padj ≤ ${padj}`}
                color={padjColor}
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

    const files = data.files ?? {};
    const cutoffs = data.cutoffs ?? {};

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
            key: "DEGMethod",
            label: "DEG Method",
            children: formatDegMethod(data.deg_method),
            span: 1,
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
        {
            key: "lncRNACutoff",
            label: "lncRNA DEG Cutoff",
            children: formatCutoff(cutoffs.lncRNA),
            span: 2,
        },
    ];
};

const TASK_INFORMATION_ITEM_GENERATOR_MAP = {
    CustomListQueryTask: generateCustomListQueryTaskItems,
    PairedCohortTask: generatePairedCohortTaskItems,
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
