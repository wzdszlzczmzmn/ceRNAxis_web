import { Box } from "@mui/system"
import { Typography } from "antd"
import Slider from "react-slick"
import {
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons"

const { Title } = Typography

const ArrowButton = ({
    direction,
    onClick,
}) => {
    const isPrev = direction === "prev"

    return (
        <Box
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                left: isPrev ? "-48px" : "auto",
                right: isPrev ? "auto" : "-48px",
                zIndex: 2,
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid #D7E0EF",
                backgroundColor: "#ffffff",
                color: "#062A73",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.12)",
                transition: "all 0.2s ease",
                "&:hover": {
                    backgroundColor: "#F5F8FC",
                    borderColor: "#B8C7DF",
                },
            }}
        >
            {isPrev ? <LeftOutlined/> : <RightOutlined/>}
        </Box>
    )
}

const Carousel = ({}) => {
    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        // autoplaySpeed: 6000,
        prevArrow: <ArrowButton direction="prev"/>,
        nextArrow: <ArrowButton direction="next"/>,
    }

    return (
        <Box
            sx={{
                width: "84%",
                mx: "auto",
                position: "relative",
            }}
        >
            <Slider {...settings}>
                <Box>
                    <Box
                        component="img"
                        src="/ceRNAxis_Figure2.png"
                        alt="Slide 1"
                        sx={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                </Box>

                <Box>
                    <Box
                        component="img"
                        src="/ceRNAxis_Figure1.png"
                        alt="Slide 2"
                        sx={{
                            width: "100%",
                            height: "auto",
                            display: "block",
                        }}
                    />
                </Box>
            </Slider>
        </Box>
    )
}

const HomeFocus = () => (
    <Box sx={{ mt: 2, mb: 2 }}>
        <Title
            level={2}
            style={{
                textAlign: "center",
                marginBottom: "36px",
                fontSize: "28px",
                fontWeight: 700,
            }}
        >
            Focus
        </Title>

        <Carousel/>
    </Box>
)

export default HomeFocus
