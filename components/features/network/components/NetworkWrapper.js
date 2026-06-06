"use client";

import RNAListUploadBox from "@/components/features/network/components/RNAListUploadBox"
import NetworkGraph from "@/components/features/network/components/NetworkGraph"
import { networkData } from "@/components/features/network/components/NetworkDemoData"
import { useState } from "react"
import { Empty, Space } from "antd"
import ErrorView from "@/components/common/status/ErrorView"
import LoadingView from "@/components/common/status/LoadingView"
import EmptyView from "@/components/common/status/EmptyView"
import { getCeRNAAxisNetworkQueryURL } from "@/lib/api/network"
import api from "@/lib/api/axios"
import { Box, Stack } from "@mui/system"

const NetworkWrapper = ({}) => {
    const [networkData, setNetworkData] = useState(null);
    const [ignoredNodes, setIgnoredNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async (payload) => {
        setLoading(true);
        setError(null);
        setIgnoredNodes([]);

        try {
            const response = await api.post(
                getCeRNAAxisNetworkQueryURL(),
                payload
            );

            const data = response.data;

            setNetworkData(data);
            setIgnoredNodes(data.ignored_nodes || []);
        } catch (err) {
            setNetworkData(null);

            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.message ||
                "Network request failed.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={4}>
            <Box
                component='h6'
                sx={{ fontSize: '40px' }}
            >
                ceRNA Axis Custom List Query
            </Box>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
                <RNAListUploadBox onUpload={handleUpload} loading={loading}/>
                {
                    error && <ErrorView height={600}/>
                }

                {
                    loading && <LoadingView height={600}/>
                }

                {!loading && networkData && (
                    <NetworkGraph networkData={networkData}/>
                )}

                {!loading && !networkData && !error && (
                    <EmptyView height={600} description="Submit RNA lists to generate a network."/>
                )}
            </Space>
        </Stack>
    )
}

export default NetworkWrapper
