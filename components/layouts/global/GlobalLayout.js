import { MessageContext } from "@/context/MessageContext"
import { Layout, message } from "antd"
import GlobalHeader from "@/components/layouts/global/GlobalHeader"
import GlobalContent from "@/components/layouts/global/GlobalContent"
import GlobalFooter from "@/components/layouts/global/GlobalFooter"
import BrowserAlert from "@/components/common/alert/BrowserAlert"

const GlobalLayout = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage()

    return (
        <MessageContext.Provider value={messageApi}>
            <Layout>
                <GlobalHeader/>
                <GlobalContent>
                    {contextHolder}
                    {children}
                </GlobalContent>
                <GlobalFooter/>
                <BrowserAlert/>
            </Layout>
        </MessageContext.Provider>
    )
}

export default GlobalLayout
