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

const RNA_TYPE_COLORS = {
    miRNA: "#ff7875",
    mRNA: "#69b1ff",
    lncRNA: "#95de64",
    circRNA: "#b37feb",
    unknown: "#d9d9d9",
};

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

const getNodeId = (node) => {
    if (node.id !== null && node.id !== undefined) {
        return `node:${node.id}`;
    }

    return `seed:${node.name}`;
};

const getEdgeClass = (interactionType) => {
    switch (interactionType) {
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

    const cytoscapeNodes = nodes.map(node => ({
        data: {
            id: getNodeId(node),
            label: node.name,
            type: node.type || "unknown",
            species: node.species || "",
            inDatabase: node.in_database ? "true" : "false",
            isSeed: node.is_seed ? "true" : "false",
        },
        classes: node.type || "unknown",
    }));

    const cytoscapeEdges = edges
        .filter(edge =>
            edge.source &&
            edge.target &&
            nodeIdSet.has(edge.source) &&
            nodeIdSet.has(edge.target)
        )
        .map(edge => ({
            data: {
                id: `edge:${edge.id}`,
                source: edge.source,
                target: edge.target,
                sourceName: edge.source_name || "",
                targetName: edge.target_name || "",
                interactionType: edge.type || "",
                databases: Array.isArray(edge.databases)
                    ? edge.databases.join(", ")
                    : "",
            },
            classes: getEdgeClass(edge.type),
        }));

    return [...cytoscapeNodes, ...cytoscapeEdges];
};

const createTooltipContent = (ele) => {
    const data = ele.data();

    if (ele.isNode()) {
        return `
            <div style="font-size: 12px; line-height: 1.7;">
                <div><strong>Name:</strong> ${data.label || "N/A"}</div>
                <div><strong>Type:</strong> ${data.type || "N/A"}</div>
                <div><strong>Species:</strong> ${data.species || "N/A"}</div>
            </div>
        `;
    }

    return `
        <div style="font-size: 12px; line-height: 1.7;">
            <div><strong>Source:</strong> ${data.sourceName || data.source || "N/A"}</div>
            <div><strong>Target:</strong> ${data.targetName || data.target || "N/A"}</div>
            <div><strong>Type:</strong> ${data.interactionType || "N/A"}</div>
            <div><strong>Databases:</strong> ${data.databases || "N/A"}</div>
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
];

const LineLegendIcon = ({ lineStyle }) => {
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
                borderTop: `2px ${borderStyleMap[lineStyle] || "solid"} #8c8c8c`,
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
                {Object.entries(RNA_TYPE_COLORS)
                    .filter(([type]) => type !== "unknown")
                    .map(([type, color]) => (
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
                            <span>{type}</span>
                        </div>
                    ))}
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
                        <LineLegendIcon lineStyle={item.lineStyle} />
                        <span>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    </Panel>
);

const NetworkControls = ({ searchStatus, onFitView, onSearchNode, onClearSearch }) => (
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
                status={searchStatus}
                size="small"
                placeholder="Search RNA..."
                enterButton={<SearchOutlined />}
                onSearch={onSearchNode}
                style={{ width: 220 }}
            />

            <Button
                size="small"
                icon={<ClearOutlined />}
                onClick={onClearSearch}
            >
                Clear
            </Button>

            <Button
                size="small"
                icon={<AimOutlined />}
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
    const [searchStatus, setSearchStatus] = useState();
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
    };

    const clearSearchHighlight = () => {
        const cy = cyRef.current;
        if (!cy) return;

        cy.elements().removeClass("dimmed search-match search-neighbor");
    };

    const handleSearchNode = (keyword) => {
        const cy = cyRef.current;
        const value = keyword.trim().toLowerCase();

        destroyTooltip();
        clearSearchHighlight();

        if (!cy || !value) {
            return;
        }

        const matchedNodes = cy.nodes().filter(node => {
            const label = node.data("label") || "";
            return label.toLowerCase().includes(value);
        });

        if (matchedNodes.empty()) {
            setSearchStatus("error");

            message.destroy();
            message.warning({
                content: `No RNA node found for "${keyword}".`,
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
                height: 600,
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                overflow: "hidden",
                background: "#ffffff",
            }}
        >
            <NetworkLegend />
            <NetworkControls
                searchStatus={searchStatus}
                onFitView={handleFitView}
                onSearchNode={handleSearchNode}
                onClearSearch={handleClearSearch}
            />
            <NetworkSummary networkData={networkData} />

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
                    padding: 40,

                    quality: "default",
                    randomize: true,

                    nodeSeparation: 80,
                    idealEdgeLength: 90,
                    nodeRepulsion: 6000,
                    edgeElasticity: 0.55,

                    nestingFactor: 0.1,
                    gravity: 0.45,
                    gravityRangeCompound: 1.5,
                    gravityCompound: 1.0,
                    gravityRange: 4.5,

                    numIter: 2500,
                    tile: true,
                }}
                wheelSensitivity={0.2}
                cy={handleCyReady}
            />
        </div>
    );
};

export default NetworkGraph;
