import { useState } from "react"
import SplitterLayout from "@/components/layouts/SplitterLayout"
import FocalCNASettingPanel from "@/components/features/visualization/components/FocalCNAPlot/FocalCNASettingPanel"
import FocalCNAPlotPanel from "@/components/features/visualization/components/FocalCNAPlot/FocalCNAPlotPanel"
import api from "@/lib/api/axios"
import { getFocalCNAInfoUrl } from "@/lib/api/dataset"
import LoadingView from "@/components/common/status/LoadingView"
import { Box } from "@mui/system"

const initRenderDataSetting = (focalOptions) => {
    const key = Object.keys(focalOptions)[0]

    return {
        type: key,
        workflow: focalOptions[key][0],
        chromosome: 'all'
    }
}

const FocalCNAView = ({
    datasetName,
    focalInfo,
    focalOptions,
    reference,
    vizRef
}) => {
    const [renderDataSetting, setRenderDataSetting] = useState(initRenderDataSetting(focalOptions))
    const [renderData, setRenderData] = useState(null)
    const [processing, setProcessing] = useState(false)
    const [isShowLeft, setIsShowLeft] = useState(true)
    const [config, setConfig] = useState({
        chart: {
            marginX: 30,
            marginY: 20
        },
        areaPlot: {
            width: 500
        },
        title: {
            marginTop: 5,
            marginBottom: 5,
            fontSize: 24
        },
        legend: {
            width: 90,
            height: 20,
            itemGap: 5,
            marginTop: 10,
            marginBottom: 0,
            symbolWidth: 30,
            fontSize: 14
        },
        label: {
            fontSize: 10,
            height: 70
        },
        chromosomeAxis: {
            height: 20
        },
    })

    const handleRenderDataSettingChange = (key, value) => {
        setRenderDataSetting(prev => {
            if (key === 'type') {
                const newWorkflow = focalOptions[value][0]
                return {
                    ...prev,
                    [key]: value,
                    workflow: newWorkflow
                }
            }

            return {
                ...prev,
                [key]: value
            }
        })
    }

    const handleIsShowLeftChange = () => {
        setIsShowLeft(!isShowLeft)
    }

    const handleConfigChange = (key, subKey, value) => {
        setConfig(prevConfig => ({
            ...prevConfig,
            [key]: {
                ...prevConfig[key],
                [subKey]: value
            }
        }))
    }

    const onRender = async () => {
        setProcessing(true)

        try {
            api.get(getFocalCNAInfoUrl(datasetName, renderDataSetting.type, renderDataSetting.workflow))
                .then(res => {
                    setRenderData({
                        amp: res.data['amp'],
                        del: res.data['del'],
                        scores: res.data['scores']
                    })
                })
        } catch (err) {
            console.log(err)
        } finally {
            setProcessing(false)
        }
    }

    const onReset = () => {
        setRenderData(null)
    }

    return (
        <SplitterLayout
            isShowLeft={isShowLeft}
            leftPanelWidth={300}
            leftPanel={
                <FocalCNASettingPanel
                    focalOptions={focalOptions}
                    renderDataSetting={renderDataSetting}
                    handleRenderDataSettingChange={handleRenderDataSettingChange}
                    config={config}
                    handleConfigChange={handleConfigChange}
                    onRender={onRender}
                    onReset={onReset}
                />
            }
            rightPanel={
                <FocalCNAPlotPanelWrapper
                    processing={processing}
                    chromosome={renderDataSetting.chromosome}
                    renderData={renderData}
                    config={config}
                    reference={reference}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    vizRef={vizRef}
                />
            }
        />
    )
}

const FocalCNAPlotPanelWrapper = ({
    processing,
    chromosome,
    renderData,
    config,
    reference,
    isShowLeft,
    handleIsShowLeftChange,
    vizRef
}) => (
    <>
        {
            processing ? (
                <LoadingView
                    containerSx={{ height: '910px' }}
                    loadingPrompt="Processing Data..., please wait for a moment."
                />
            ) : renderData === null ? (
                <Box sx={{
                    width: '100%',
                    height: '100%',
                    padding: '0px 60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Box sx={{ fontWeight: 500, fontSize: '28px', textAlign: 'center' }}>
                        Use the Data Setting panel to configure the CNA Type and Workflow. Click Render to generate the visualization based on your selections.
                    </Box>
                </Box>
            ) : (
                <FocalCNAPlotPanel
                    chromosome={chromosome}
                    focalInfo={renderData}
                    config={config}
                    reference={reference}
                    isShowLeft={isShowLeft}
                    handleIsShowLeftChange={handleIsShowLeftChange}
                    ref={vizRef}
                />
            )
        }
    </>
)

export default FocalCNAView
