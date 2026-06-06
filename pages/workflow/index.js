import { Box, Stack } from "@mui/system"
import { useState } from "react"
import NetworkWrapper from "@/components/features/network/components/NetworkWrapper"
import { ConfigProvider, Menu } from "antd"

const customTheme = {
    components: {
        Menu: {
            itemHeight: 48,
            itemPaddingInline: 20,
            fontSize: 16
        }
    }
}

const menuItems = [
    {
        key: 'mode1',
        label: 'ceRNA Axis Custom List Query'
    }
]

const Workflow = ({}) => {
    const [selectedKey, setSelectedKey] = useState('mode1')

    const renderContent = () => {
        switch (selectedKey) {
            case 'mode1':
                return <NetworkWrapper/>
            default:
                return null
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: 'calc(100vh - 148px)'
            }}
        >
            <Box
                sx={{
                    pt: '12px',
                    width: 350,
                    borderRight: '1px solid #e5e5e5'
                }}
            >
                <ConfigProvider theme={customTheme}>
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        onClick={({ key }) => setSelectedKey(key)}
                        style={{ borderRight: 'none' }}
                        items={menuItems}
                    />
                </ConfigProvider>
            </Box>

            <Box flex={1} p={3} overflow="auto">
                {renderContent()}
            </Box>
        </Box>
    )
}

export default Workflow
