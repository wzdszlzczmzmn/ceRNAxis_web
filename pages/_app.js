import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import "@/styles/globals.css";
import { StyleProvider } from "@ant-design/cssinjs"
import { ConfigProvider } from "antd"
import theme from '/theme/theme'
import Head from "next/head"
import GlobalLayout from "@/components/layouts/global/GlobalLayout"

export default function App({ Component, pageProps }) {
  return (
      <StyleProvider layer>
        <ConfigProvider theme={theme}>
          <Head>
            <title>ceRNAxisDB</title>
            <meta name="description" content="ceRNAxis"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <link rel="icon" href="/ceRNAxisDB_logo2.svg"/>
          </Head>
          <GlobalLayout>
            <Component {...pageProps} />
          </GlobalLayout>
        </ConfigProvider>
      </StyleProvider>
  )
}
