"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import cytoscape from "cytoscape";
import fcose from "cytoscape-fcose";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { Button, Input, message, Space } from "antd";
import { AimOutlined, SearchOutlined, ClearOutlined } from "@ant-design/icons";


cytoscape.use(fcose);

const CytoscapeComponent = dynamic(
    () => import("react-cytoscapejs"),
    { ssr: false }
);

const TYPE_LABEL_MAP = {
    miRNA: "miRNA",
    mRNA: "mRNA",
    lncRNA: "lncRNA",
    circRNA: "circRNA",
    immune_checkpoint_gene: "Immune Checkpoint Gene",
    unknown: "Unknown",
};

const EDGE_TYPE_LABEL_MAP = {
    rna_interaction: "RNA Interaction",
    immune_annotation: "Immune Annotation",
};

const getTypeLabel = (type) => {
    return TYPE_LABEL_MAP[type] || type || "N/A";
};

const getEdgeTypeLabel = (type) => {
    return EDGE_TYPE_LABEL_MAP[type] || getTypeLabel(type);
};

const getImmuneNodeTypeLabel = (type) => {
    if (type === "immune_source_miRNA") return "Immune Source miRNA";
    if (type === "immune_checkpoint_gene") return "Immune Checkpoint Gene";

    return type || "N/A";
};

const RNA_TYPE_COLORS = {
    miRNA: "#ff7875",
    mRNA: "#69b1ff",
    lncRNA: "#95de64",
    circRNA: "#b37feb",
    unknown: "#d9d9d9",
};

const RNA_LEGEND_TYPES = ["miRNA", "mRNA", "lncRNA", "circRNA"];

const IMMUNE_CHECKPOINT_GENE_COLOR = "#fff1b8";

const IMMUNE_BORDER_COLOR = "#13c2c2";
const IMMUNE_EDGE_COLOR = "#13c2c2";
const IMMUNE_UNDERLAY_COLOR = "#e6fffb";

const INTERACTION_TYPES = [
    {
        type: "miRNA-mRNA",
        label: "miRNA-mRNA",
        className: "mirna-mrna",
        lineStyle: "solid",
    },
    {
        type: "miRNA-lncRNA",
        label: "miRNA-lncRNA",
        className: "mirna-lncrna",
        lineStyle: "dashed",
    },
    {
        type: "miRNA-circRNA",
        label: "miRNA-circRNA",
        className: "mirna-circrna",
        lineStyle: "dotted",
    },
];

const normalizeElementId = (value) => {
    if (value === null || value === undefined) return "";

    return String(value);
};

const getNodeId = (node) => {
    if (node.id !== null && node.id !== undefined) {
        return normalizeElementId(node.id);
    }

    if (node.db_id !== null && node.db_id !== undefined) {
        return `node:${node.db_id}`;
    }

    return `seed:${node.name}`;
};

const getEdgeId = (edge) => {
    if (edge.id !== null && edge.id !== undefined) {
        return normalizeElementId(edge.id);
    }

    return [
        "edge",
        edge.source,
        edge.target,
        edge.type || edge.edge_type || "unknown",
    ].join(":");
};

const getEdgeClass = (edge) => {
    const edgeType = edge.edge_type || edge.type;

    if (edgeType === "immune_annotation") {
        return "immune-annotation immune-related";
    }

    switch (edge.type) {
        case "miRNA-mRNA":
            return "mirna-mrna";
        case "miRNA-lncRNA":
            return "mirna-lncrna";
        case "miRNA-circRNA":
            return "mirna-circrna";
        default:
            return "mirna-mrna";
    }
};

const buildElements = (networkData) => {
    const nodes = networkData?.nodes || [];
    const edges = networkData?.edges || [];

    const nodeIdSet = new Set(nodes.map(getNodeId));

    const cytoscapeNodes = nodes.map(node => {
        const nodeId = getNodeId(node);
        const nodeType = node.type || "unknown";
        const isImmuneRelated = Boolean(node.is_immune_related);
        const immuneNodeType = node.immune_node_type || "";

        return {
            data: {
                id: nodeId,
                label: node.name,
                type: nodeType,
                typeLabel: getTypeLabel(nodeType),
                species: node.species || "",
                source: node.source || "",
                matchedInDatabase: node.matched_in_database ? "true" : "false",
                isImmuneRelated: isImmuneRelated ? "true" : "false",
                immuneNodeType,
                immuneNodeTypeLabel: getImmuneNodeTypeLabel(immuneNodeType),
                immunePathways: Array.isArray(node.immune_pathways)
                    ? node.immune_pathways.join(", ")
                    : "",
            },
            classes: [
                nodeType,
                isImmuneRelated ? "immune-related" : "",
                immuneNodeType,
            ]
                .filter(Boolean)
                .join(" "),
        };
    });

    const droppedEdges = [];

    const cytoscapeEdges = edges
        .filter(edge => {
            const source = normalizeElementId(edge.source);
            const target = normalizeElementId(edge.target);

            const isValid =
                source &&
                target &&
                nodeIdSet.has(source) &&
                nodeIdSet.has(target);

            if (!isValid) {
                droppedEdges.push({
                    id: edge.id,
                    source,
                    target,
                    sourceExists: nodeIdSet.has(source),
                    targetExists: nodeIdSet.has(target),
                    sourceName: edge.source_name,
                    targetName: edge.target_name,
                    edgeType: edge.edge_type,
                });
            }

            return isValid;
        })
        .map(edge => {
            const evidenceItems = edge.immune_annotation?.evidence_items ?? [];
            const isImmuneRelated = Boolean(edge.is_immune_related);

            return {
                data: {
                    id: getEdgeId(edge),
                    source: normalizeElementId(edge.source),
                    target: normalizeElementId(edge.target),
                    sourceName: edge.source_name || "",
                    targetName: edge.target_name || "",
                    sourceType: edge.source_type || "",
                    targetType: edge.target_type || "",
                    sourceTypeLabel: getTypeLabel(edge.source_type),
                    targetTypeLabel: getTypeLabel(edge.target_type),
                    interactionType: edge.type || "",
                    interactionTypeLabel: getEdgeTypeLabel(edge.type),
                    edgeType: edge.edge_type || "",
                    edgeTypeLabel: getEdgeTypeLabel(edge.edge_type),
                    databases: Array.isArray(edge.databases)
                        ? edge.databases.join(", ")
                        : "",
                    isImmuneRelated: isImmuneRelated ? "true" : "false",
                    immuneEvidenceCount: edge.immune_annotation?.evidence_count ?? 0,
                    immunePathways: evidenceItems
                        .map(item => item.pathway)
                        .filter(Boolean)
                        .join(", "),
                    immuneEvidence: evidenceItems
                        .map(item => item.evidence)
                        .filter(Boolean)
                        .join(", "),
                },
                classes: getEdgeClass(edge),
            };
        });

    return [...cytoscapeNodes, ...cytoscapeEdges];
};

const createTooltipContent = (ele) => {
    const data = ele.data();

    if (ele.isNode()) {
        return `
            <div style="font-size: 12px; line-height: 1.7;">
                <div><strong>Name:</strong> ${data.label || "N/A"}</div>
                <div><strong>Type:</strong> ${data.typeLabel || getTypeLabel(data.type)}</div>
                <div><strong>Species:</strong> ${data.species || "N/A"}</div>
                <div><strong>Source:</strong> ${data.source || "N/A"}</div>
                ${
            data.isImmuneRelated === "true"
                ? `
                            <div><strong>Immune related:</strong> Yes</div>
                            <div><strong>Immune node type:</strong> ${data.immuneNodeTypeLabel || getImmuneNodeTypeLabel(data.immuneNodeType)}</div>
                            <div><strong>Immune pathways:</strong> ${data.immunePathways || "N/A"}</div>
                        `
                : ""
        }
            </div>
        `;
    }

    return `
    <div style="font-size: 12px; line-height: 1.7;">
        <div><strong>Source:</strong> ${data.sourceName || data.source || "N/A"}</div>
        <div><strong>Target:</strong> ${data.targetName || data.target || "N/A"}</div>
        <div><strong>Source type:</strong> ${data.sourceTypeLabel || getTypeLabel(data.sourceType)}</div>
        <div><strong>Target type:</strong> ${data.targetTypeLabel || getTypeLabel(data.targetType)}</div>
        <div><strong>Interaction:</strong> ${data.interactionTypeLabel || getEdgeTypeLabel(data.interactionType)}</div>
        <div><strong>Edge type:</strong> ${data.edgeTypeLabel || getEdgeTypeLabel(data.edgeType)}</div>
        <div><strong>Databases:</strong> ${data.databases || "N/A"}</div>
        ${
        data.isImmuneRelated === "true"
            ? `
                    <div><strong>Immune related:</strong> Yes</div>
                    <div><strong>Evidence count:</strong> ${data.immuneEvidenceCount || 0}</div>
                    <div><strong>Pathways:</strong> ${data.immunePathways || "N/A"}</div>
                    <div><strong>Evidence:</strong> ${data.immuneEvidence || "N/A"}</div>
                `
            : ""
    }
    </div>
`;
};

const stylesheet = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            "font-size": 9,
            "text-valign": "bottom",
            "text-halign": "center",
            "text-margin-y": 4,
            color: "#262626",
            "background-color": RNA_TYPE_COLORS.unknown,
            width: 34,
            height: 34,
            "border-width": 0,
            "text-outline-width": 2,
            "text-outline-color": "#ffffff",
        },
    },
    {
        selector: "node.miRNA",
        style: { "background-color": RNA_TYPE_COLORS.miRNA },
    },
    {
        selector: "node.mRNA",
        style: { "background-color": RNA_TYPE_COLORS.mRNA },
    },
    {
        selector: "node.lncRNA",
        style: { "background-color": RNA_TYPE_COLORS.lncRNA },
    },
    {
        selector: "node.circRNA",
        style: { "background-color": RNA_TYPE_COLORS.circRNA },
    },
    {
        selector: "edge",
        style: {
            width: 1.6,
            "line-color": "#bfbfbf",
            "curve-style": "bezier",
            "target-arrow-shape": "none",
            label: "",
        },
    },
    {
        selector: "edge.mirna-mrna",
        style: {
            "line-style": "solid",
            "line-color": "#9e9e9e",
            width: 1.8,
        },
    },
    {
        selector: "edge.mirna-lncrna",
        style: {
            "line-style": "dashed",
            "line-color": "#8c8c8c",
            width: 1.8,
        },
    },
    {
        selector: "edge.mirna-circrna",
        style: {
            "line-style": "dotted",
            "line-color": "#8c8c8c",
            width: 2,
        },
    },
    {
        selector: "node:selected",
        style: {
            "border-width": 4,
            "border-color": "#faad14",
        },
    },
    {
        selector: "edge:selected",
        style: {
            width: 3,
            "line-color": "#faad14",
        },
    },
    {
        selector: ".dimmed",
        style: {
            opacity: 0.15,
        },
    },
    {
        selector: "node.search-match",
        style: {
            "border-width": 4,
            "border-color": "#faad14",
            "border-opacity": 1,
            "background-blacken": -0.12,
            "z-index": 999,
        },
    },
    {
        selector: "edge.search-neighbor",
        style: {
            width: 3,
            "line-color": "#faad14",
            "z-index": 998,
        },
    },
    {
        selector: "node.search-neighbor",
        style: {
            "z-index": 998,
        },
    },
    {
        selector: "node.immune-related",
        style: {
            "border-width": 5,
            "border-color": IMMUNE_BORDER_COLOR,
            "border-opacity": 1,
            "background-blacken": -0.08,
            "shadow-blur": 14,
            "shadow-color": IMMUNE_BORDER_COLOR,
            "shadow-opacity": 0.45,
            "shadow-offset-x": 0,
            "shadow-offset-y": 0,
            "z-index": 900,
        },
    },
    {
        selector: "node.immune_checkpoint_gene",
        style: {
            "background-color": IMMUNE_CHECKPOINT_GENE_COLOR,
            shape: "round-rectangle",
            width: 46,
            height: 30,
            "border-width": 5,
            "border-color": IMMUNE_BORDER_COLOR,
            "border-opacity": 1,
            "font-weight": 600,
            "z-index": 930,
        },
    },
    {
        selector: "edge.immune-annotation",
        style: {
            width: 4,
            "line-color": IMMUNE_EDGE_COLOR,
            "line-style": "dashed",
            "curve-style": "unbundled-bezier",
            "control-point-distances": 60,
            "control-point-weights": 0.5,
            "target-arrow-shape": "triangle",
            "target-arrow-color": IMMUNE_EDGE_COLOR,
            "arrow-scale": 0.9,
            "underlay-color": IMMUNE_UNDERLAY_COLOR,
            "underlay-opacity": 0.95,
            "underlay-padding": 5,
            "z-index": 999,
        },
    },
];

const LineLegendIcon = ({ lineStyle, color = "#8c8c8c" }) => {
    const borderStyleMap = {
        solid: "solid",
        dashed: "dashed",
        dotted: "dotted",
    };

    return (
        <span
            style={{
                width: 32,
                height: 0,
                borderTop: `2px ${borderStyleMap[lineStyle] || "solid"} ${color}`,
                display: "inline-block",
            }}
        />
    );
};

const Panel = ({ children, style }) => (
    <div
        style={{
            position: "absolute",
            zIndex: 10,
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(255, 255, 255, 0.92)",
            border: "1px solid #f0f0f0",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            fontSize: 12,
            ...style,
        }}
    >
        {children}
    </div>
);

const NetworkLegend = () => (
    <Panel
        style={{
            top: 16,
            left: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
        }}
    >
        <div>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#262626" }}>
                RNA Type
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {RNA_LEGEND_TYPES.map(type => {
                    const color = RNA_TYPE_COLORS[type];

                    return (
                        <div
                            key={type}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
            <span
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    backgroundColor: color,
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
                            <span>{getTypeLabel(type)}</span>
                        </div>
                    );
                })}
            </div>
        </div>

        <div>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#262626" }}>
                Interaction Type
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {INTERACTION_TYPES.map(item => (
                    <div
                        key={item.className}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <LineLegendIcon lineStyle={item.lineStyle}/>
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <div style={{ fontWeight: 600, marginBottom: 8, color: "#262626" }}>
                Immune Annotation
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
                style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#ffffff",
                    border: `3px solid ${IMMUNE_BORDER_COLOR}`,
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
                    <span>Cyan border: immune-related node</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
                style={{
                    width: 18,
                    height: 12,
                    borderRadius: 4,
                    backgroundColor: "#fff1b8",
                    border: `3px solid ${IMMUNE_BORDER_COLOR}`,
                    display: "inline-block",
                    flexShrink: 0,
                }}
            />
                    <span>Annotation-only checkpoint gene</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <LineLegendIcon lineStyle="dashed" color={IMMUNE_EDGE_COLOR}/>
                    <span>Immune annotation edge</span>
                </div>
            </div>
        </div>
    </Panel>
);

const NetworkControls = ({
    searchKeyword,
    searchStatus,
    onSearchKeywordChange,
    onFitView,
    onSearchNode,
    onClearSearch,
}) => (
    <div
        style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
        }}
    >
        <Space.Compact>
            <Input.Search
                allowClear
                value={searchKeyword}
                status={searchStatus}
                size="small"
                placeholder="Search RNA / immune gene..."
                enterButton={<SearchOutlined/>}
                onChange={(e) => {
                    onSearchKeywordChange(e.target.value);
                }}
                onSearch={onSearchNode}
                style={{ width: 220 }}
            />

            <Button
                size="small"
                icon={<ClearOutlined/>}
                onClick={onClearSearch}
            >
                Clear
            </Button>

            <Button
                size="small"
                icon={<AimOutlined/>}
                onClick={onFitView}
            >
                Fit View
            </Button>
        </Space.Compact>
    </div>
);

const NetworkSummary = ({ networkData }) => {
    const nodeCount =
        networkData?.meta?.matched_node_count ??
        networkData?.meta?.total_node_count ??
        networkData?.nodes?.length ??
        0;

    const edgeCount =
    networkData?.meta?.edge_count ??
        networkData?.meta?.total_edge_count ??
        networkData?.edges?.length ??
        0;

    const ignoredCount =
        networkData?.meta?.ignored_node_count ??
        networkData?.ignored_nodes?.length ??
        0;

    const items = [
        { label: "Nodes", value: nodeCount },
        { label: "Edges", value: edgeCount },
        {
            label: "Immune",
            value: networkData?.meta?.immune_annotation_edge_count ?? 0,
        },
        { label: "Ignored", value: ignoredCount },
    ];

    return (
        <div
            style={{
                position: "absolute",
                left: 16,
                bottom: 16,
                zIndex: 10,
                display: "flex",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 999,
                background: "rgba(38, 38, 38, 0.82)",
                color: "#ffffff",
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
            }}
        >
            {items.map(item => (
                <div
                    key={item.label}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                    }}
                >
                    <span style={{ opacity: 0.75 }}>
                        {item.label}
                    </span>
                    <strong>{item.value}</strong>
                </div>
            ))}
        </div>
    );
};

const NetworkGraph = ({ networkData }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchStatus, setSearchStatus] = useState();

    const searchKeywordRef = useRef("");
    const cyRef = useRef(null);
    const tooltipRef = useRef(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });

    const elements = useMemo(() => {
        return buildElements(networkData);
    }, [networkData]);

    const destroyTooltip = () => {
        if (tooltipRef.current) {
            tooltipRef.current.destroy();
            tooltipRef.current = null;
        }
    };

    const handleFitView = () => {
        destroyTooltip();
        cyRef.current?.fit(undefined, 40);
    };

    const handleCyReady = (cy) => {
        cyRef.current = cy;

        cy.off("mousemove", "node, edge");
        cy.off("mouseout", "node, edge");
        cy.off("drag pan zoom resize");

        cy.on("mousemove", "node, edge", (event) => {
            const ele = event.target;
            const { originalEvent } = event;

            if (!originalEvent) return;

            mousePositionRef.current = {
                x: originalEvent.clientX,
                y: originalEvent.clientY,
            };

            if (!tooltipRef.current) {
                const dummyDomEle = document.createElement("div");

                tooltipRef.current = tippy(dummyDomEle, {
                    getReferenceClientRect: () => ({
                        width: 0,
                        height: 0,
                        top: mousePositionRef.current.y,
                        bottom: mousePositionRef.current.y,
                        left: mousePositionRef.current.x,
                        right: mousePositionRef.current.x,
                        x: mousePositionRef.current.x,
                        y: mousePositionRef.current.y,
                    }),
                    content: createTooltipContent(ele),
                    allowHTML: true,
                    trigger: "manual",
                    placement: "top",
                    arrow: true,
                    appendTo: document.body,
                    interactive: false,
                    hideOnClick: false,
                    offset: [0, 10],
                });

                tooltipRef.current.show();
            } else {
                tooltipRef.current.setProps({
                    getReferenceClientRect: () => ({
                        width: 0,
                        height: 0,
                        top: mousePositionRef.current.y,
                        bottom: mousePositionRef.current.y,
                        left: mousePositionRef.current.x,
                        right: mousePositionRef.current.x,
                        x: mousePositionRef.current.x,
                        y: mousePositionRef.current.y,
                    }),
                });

                tooltipRef.current.popperInstance?.update();
            }
        });

        cy.on("mouseout", "node, edge", () => {
            destroyTooltip();
        });

        cy.on("drag pan zoom resize", () => {
            destroyTooltip();
        });

        cy.off("dbltap", "node");

        cy.on("dbltap", "node", (event) => {
            const node = event.target;
            const label = node.data("label");

            if (!label) return;

            const currentKeyword = searchKeywordRef.current.trim().toLowerCase();
            const currentLabel = label.trim().toLowerCase();

            if (currentKeyword === currentLabel) {
                handleClearSearch();
                return;
            }

            handleSearchNode(label);
        });
    };

    const clearSearchHighlight = () => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.elements().removeClass("dimmed search-match search-neighbor");
    };

    const handleSearchKeywordChange = (value) => {
        setSearchKeyword(value);
        searchKeywordRef.current = value;
        setSearchStatus(undefined);
    };

    const normalizeSearchValue = (value) => {
        return String(value || "")
            .trim()
            .toLowerCase();
    };

    const getNodeSearchLabel = (node) => {
        return String(
            node.data("label") ||
            node.data("name") ||
            node.data("id") ||
            ""
        );
    };

    const findMatchedNodes = ({
        cy,
        keyword,
    }) => {
        const value = normalizeSearchValue(keyword);

        if (!cy || !value) {
            return cy?.collection() ?? null;
        }

        const nodes = cy.nodes();

        const exactMatches = nodes.filter(node => {
            const label = normalizeSearchValue(getNodeSearchLabel(node));
            return label === value;
        });

        if (!exactMatches.empty()) {
            return exactMatches;
        }

        return nodes.filter(node => {
            const label = normalizeSearchValue(getNodeSearchLabel(node));
            return label.includes(value);
        });
    };

    const handleSearchNode = (keyword) => {
        const cy = cyRef.current;
        const rawValue = keyword || "";
        const value = rawValue.trim().toLowerCase();

        setSearchKeyword(rawValue);
        searchKeywordRef.current = rawValue;

        destroyTooltip();
        clearSearchHighlight();

        if (!cy || !value) {
            setSearchStatus(undefined);
            return;
        }

        const matchedNodes = findMatchedNodes({
            cy,
            keyword: rawValue,
        });

        if (matchedNodes.empty()) {
            setSearchStatus("error");

            message.destroy();
            message.warning({
                content: `No node found for "${rawValue}".`,
                duration: 2,
            });

            return;
        }

        setSearchStatus(undefined);

        const neighborhood = matchedNodes.closedNeighborhood();

        cy.elements().addClass("dimmed");
        neighborhood.removeClass("dimmed");
        matchedNodes.addClass("search-match");
        neighborhood.edges().addClass("search-neighbor");
        neighborhood.nodes().difference(matchedNodes).addClass("search-neighbor");

        cy.fit(neighborhood, 80);
    };

    const handleClearSearch = () => {
        setSearchKeyword("");
        searchKeywordRef.current = "";
        setSearchStatus(undefined);

        destroyTooltip();
        clearSearchHighlight();
        cyRef.current?.fit(undefined, 40);
    };

    if (!networkData) return null;

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "75vh",
                minHeight: 720,
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                overflow: "hidden",
                background: "#ffffff",
            }}
        >
            <NetworkLegend/>
            <NetworkControls
                searchKeyword={searchKeyword}
                searchStatus={searchStatus}
                onSearchKeywordChange={handleSearchKeywordChange}
                onFitView={handleFitView}
                onSearchNode={handleSearchNode}
                onClearSearch={handleClearSearch}
            />
            <NetworkSummary networkData={networkData}/>

            <CytoscapeComponent
                elements={elements}
                stylesheet={stylesheet}
                style={{
                    width: "100%",
                    height: "100%",
                }}
                layout={{
                    name: "fcose",

                    animate: false,
                    fit: true,
                    padding: 60,

                    quality: "default",

                    randomize: true,

                    nodeSeparation: 150,
                    idealEdgeLength: 180,
                    nodeRepulsion: 12000,

                    edgeElasticity: 0.3,

                    nestingFactor: 0.1,

                    gravity: 0.2,
                    gravityRangeCompound: 1.5,
                    gravityCompound: 1.0,
                    gravityRange: 4.5,

                    numIter: 2500,

                    tile: true,
                }}
                wheelSensitivity={1}
                cy={handleCyReady}
            />
        </div>
    );
};

export default NetworkGraph;
