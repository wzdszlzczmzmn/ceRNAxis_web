import CustomHeader from "@/components/ui/layout/CustomHeader"
import { Box, Stack } from "@mui/system"
import Image from "next/image"
import { useRouter } from "next/router"
import CustomHeaderMenu from "@/components/ui/menu/CustomHeaderMenu"
import {
    BarChartOutlined,
    CloudDownloadOutlined, DeploymentUnitOutlined,
    FileTextOutlined,
    HomeOutlined, MailOutlined,
    ProfileOutlined
} from "@ant-design/icons"
import DatabaseIcon from "@/components/icons/Database"

const GlobalHeader = () => (
    <CustomHeader>
        <Stack direction='row' justifyContent='space-between'>
            <LogoSection/>
            <HeaderMenu/>
        </Stack>
    </CustomHeader>
)

const LogoSection = () => (
    <Box
        component='a'
        href='/'
        sx={{
            height: '64px',
            lineHeight: '64px',
            display: 'inline-flex',
            columnGap: '8px',
            alignItems: 'center',
            fontSize: '28px',
            overflow: 'hidden',
            color: '#000000',
        }}
    >
        <Image
            src='/ceRNAxisDB_logo2.svg'
            width={56}
            height={56}
            alt='CNA Scope Logo'
            priority
        />
        <Stack direction='row'>
            <Box component='span' sx={{ color: '#011c5c', fontWeight: 'bold' }}>ceRNAxis</Box>
        </Stack>
    </Box>
)

const HeaderMenu = () => {
    const router = useRouter()

    const handleClick = ({ item }) => {
        router.push(item.props.link)
    }

    return (
        <CustomHeaderMenu
            mode="horizontal"
            items={menuItems}
            onClick={handleClick}
            selectable={false}
        />
    )
}

const menuItems = [
    {
        key: 'home',
        label: 'Home',
        icon: <HomeOutlined style={{ fontSize: '20px' }}/>,
        link: '/'
    },
    {
        key: 'database',
        label: 'Database',
        icon: <DatabaseIcon style={{ fontSize: '20px' }}/>,
        children: [
            {
                key: 'mRNA',
                label: 'mRNA Datasets',
                link: '/database/datasetMetaTable?gene_bio_type=mRNA'
            },
            {
                key: 'miRNA',
                label: 'miRNA Datasets',
                link: '/database/datasetMetaTable?gene_bio_type=miRNA'
            },
            {
                key: 'lncRNA',
                label: 'lncRNA Datasets',
                link: '/database/datasetMetaTable?gene_bio_type=lncRNA'
            },
            {
                key: 'circRNA',
                label: 'circRNA Datasets',
                link: '/database/datasetMetaTable?gene_bio_type=circRNA'
            },
            {
                key: 'ceRNA Axis',
                label: 'ceRNA Axis',
                link: '/database/ceRNAAxis'
            },
        ]
    },
    {
        key: 'analysis',
        label: 'Workflow',
        icon: <BarChartOutlined style={{ fontSize: '20px' }}/>,
        link: '/workflow'
    },
    {
        key: 'workspace',
        label: 'Workspace',
        icon: <ProfileOutlined style={{ fontSize: '20px' }}/>,
        link: '/workspace'
    },
    {
        key: 'tutorial',
        label: 'Tutorial',
        icon: <FileTextOutlined style={{ fontSize: '20px' }}/>,
        link: '/tutorial'
    },
    {
        key: 'contactUs',
        label: 'Contact us',
        icon: <MailOutlined style={{ fontSize: '20px' }}/>,
        link: '/contact'
    }
]

export default GlobalHeader
