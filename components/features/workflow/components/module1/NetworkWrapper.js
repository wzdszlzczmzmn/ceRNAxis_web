"use client";

import RNAListUploadBox from "@/components/features/workflow/components/module1/RNAListUploadBox";
import { useState } from "react";
import { Button, Divider, Space, Spin } from "antd";
import api from "@/lib/api/axios";
import { Box, Stack } from "@mui/system";
import BasicChip from "@/components/ui/chips/BasicChip";
import {
    ExperimentOutlined,
    FileExcelOutlined,
    FileSearchOutlined,
    QuestionCircleOutlined,
} from "@ant-design/icons";
import { getCustomListQueryRunDemoURL, getCustomListQuerySubmitTaskURL } from "@/lib/api/analysis"
import { useGlobalMessage } from "@/context/MessageContext"
import ResultModal from "@/components/features/workflow/components/common/ResultModal"

const initialWorkflowParams = {
    taskName: "",
    cancerType: undefined,
};

const initialInputValue = {
    miRNA: "",
    mRNA: "",
    lncRNA: "",
    circRNA: "",
};

const demoWorkflowParams = {
    taskName: "demo_task",
    cancerType: "ACC",
};

const demoInputValue = {
    miRNA: "hsa-mir-567,hsa-miR-6742-5p,hsa-miR-127-5p,hsa-miR-9-3p,hsa-mir-1305,hsa-miR-4487,hsa-mir-629,hsa-mir-181a-2,hsa-miR-548o-3p,hsa-miR-642a-5p,hsa-miR-12115,hsa-miR-5011-5p,hsa-miR-548az-5p,mmu-miR-140-5p,hsa-miR-6715b-5p,hsa-miR-660-3p,hsa-miR-3617-3p,hsa-miR-1266-3p,hsa-miR-639,hsa-miR-10525-3p,hsa-miR-598-3p,hsa-miR-4483,hsa-miR-4694-3p,hsa-miR-548p,hsa-miR-365b-3p,hsa-mir-513c,hsa-mir-4423,hsa-miR-1299,hsa-mir-320a,hsa-mir-421",
    mRNA: "LRRC24,CTSC,UBE2K,NDUFB1,PCTP,TLCD5,FHL3,GALNT16,IGF2R,VILL,CDT1,NRARP,APMAP,ZNF532,SYNM,SMG7,KDM8,TNP2,ST3GAL4,ZNF544,ACSL6,RRP1B,STX4,HPX,C2CD2L,OSCP1,PAFAH1B3,GALNS,SPDYE14,HLA-DRA,HLA-DPA1,HLA-DQB1,CD74,IFNG,HLA-DRB5,HLA-DPB1,HLA-DQA1,HLA-DMA,HLA-DRB1,KLRC1,HLA-DQA2,CTSS,KLRD1,HLA-DOA,CIITA,CD8B,KIR2DL4",
    lncRNA: "NONHSAG043011,AC092279.1,AC139099.1,RP11-108M9.3,AL645939.2,AC022075.2,NONHSAG054710,LINC01630,AC093515.1,NONHSAG043672,AC113383.1,RP11-274H2.5,RP1-261D10.2,AC021242.3,AL137782.1,LOC440461,GS1-124K5.4,RP11-539L10.3,NONHSAG011425,NONHSAG026847,AP001055.6,RP11-56D16.8,LINC01296,MIR22HG,Z95704.3,NONHSAG036097,AC090607.5,AC016907.3,SNAP47-IT1,AC005220.1",
    circRNA: "",
}

const getTaskUUIDFromResponse = (response) => {
    return (
        response.data?.data?.uuid ||
        response.data?.uuid ||
        response.data?.task_uuid ||
        ""
    );
};

const NetworkWrapper = () => {
    const [workflowParams, setWorkflowParams] = useState(initialWorkflowParams);
    const [rnaInputValue, setRnaInputValue] = useState(initialInputValue);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [taskUUID, setTaskUUID] = useState("");
    const [submissionStatus, setSubmissionStatus] = useState(true);

    const messageApi = useGlobalMessage();

    const handleLoadDemoInput = () => {
        setWorkflowParams(demoWorkflowParams);
        setRnaInputValue(demoInputValue);
    };

    const handleRunDemo = async () => {
        try {
            setIsSubmitting(true);

            const response = await api.post(
                getCustomListQueryRunDemoURL(),
                {},
                {
                    timeout: 600000,
                }
            );

            const uuid = getTaskUUIDFromResponse(response);

            setTaskUUID(uuid);
            setSubmissionStatus(true);
            setIsModelOpen(true);
            messageApi.success("Run demo success!");
        } catch (err) {
            setTaskUUID("");
            setSubmissionStatus(false);
            setIsModelOpen(true);

            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.response?.data?.msg ||
                err.message ||
                "Run demo failed!";

            messageApi.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpload = async (payload) => {
        try {
            setIsSubmitting(true);

            const response = await api.post(
                getCustomListQuerySubmitTaskURL(),
                payload,
                {
                    timeout: 600000,
                }
            );

            const uuid = getTaskUUIDFromResponse(response);

            setTaskUUID(uuid);
            setSubmissionStatus(true);
            setIsModelOpen(true);
            messageApi.success("Submit Success!");
        } catch (err) {
            setTaskUUID("");
            setSubmissionStatus(false);
            setIsModelOpen(true);

            const message =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.response?.data?.msg ||
                err.message ||
                "Submit Fail!";

            messageApi.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Spin
            spinning={isSubmitting}
            tip="Submitting, please wait..."
            size="large"
        >
            <Stack spacing={4}>
                <Stack spacing={2}>
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Box
                            component="h6"
                            sx={{
                                fontSize: "40px",
                                m: 0,
                            }}
                        >
                            ceRNA Axis Custom List Query
                        </Box>

                        <BasicChip
                            value="Mode 1"
                            color="blue"
                            style={{
                                height: "32px",
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "0 12px",
                                fontSize: "14px",
                                fontWeight: 600,
                                marginTop: "10px",
                            }}
                        />
                    </Stack>

                    <Divider/>

                    <Space>
                        <Button
                            type="primary"
                            icon={<ExperimentOutlined />}
                            disabled={isSubmitting}
                            onClick={handleRunDemo}
                        >
                            Run Demo
                        </Button>

                        <Button
                            danger
                            icon={<FileSearchOutlined />}
                            disabled={isSubmitting}
                            href='/workspace/detail?taskId=35fb8c89-a674-469f-a670-ea4bebd312ab'
                            target='_blank'
                        >
                            View Demo Result
                        </Button>

                        <Divider
                            type="vertical"
                            verticalAlign="middle"
                            style={{ height: 24 }}
                        />

                        <Button
                            type="primary"
                            icon={<QuestionCircleOutlined />}
                            disabled={isSubmitting}
                            href='/tutorial'
                            target='_blank'
                        >
                            Submission Help
                        </Button>

                        <Button
                            danger
                            icon={<FileExcelOutlined />}
                            onClick={handleLoadDemoInput}
                            disabled={isSubmitting}
                        >
                            View Demo
                        </Button>
                    </Space>
                </Stack>

                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    <RNAListUploadBox
                        workflowParams={workflowParams}
                        onWorkflowParamsChange={setWorkflowParams}
                        initialWorkflowParams={initialWorkflowParams}
                        inputValue={rnaInputValue}
                        onInputValueChange={setRnaInputValue}
                        initialInputValue={initialInputValue}
                        onUpload={handleUpload}
                        loading={isSubmitting}
                    />
                </Space>
                <ResultModal
                    isModalOpen={isModalOpen}
                    setIsModelOpen={setIsModelOpen}
                    taskUUID={taskUUID}
                    submissionStatus={submissionStatus}
                />
            </Stack>
        </Spin>
    );
};

export default NetworkWrapper;
