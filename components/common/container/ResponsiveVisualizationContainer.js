import { Box } from "@mui/system"
import { createContext, useContext, useEffect, useRef, useState } from "react"

export const ResponsiveSizeContext = createContext({ width: 0, height: 0 })

export const useContainerSize = () => useContext(ResponsiveSizeContext)

const ResponsiveVisualizationContainer = ({ containerSx, children }) => {
    const [size, setSize] = useState({ width: 0, height: 0 })
    const containerRef = useRef(null)

    useEffect(() => {
        const observeTarget = containerRef.current

        if (!observeTarget || typeof ResizeObserver === "undefined") {
            return
        }

        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0]
            if (!entry) return

            const { width, height } = entry.contentRect

            setSize(prev => {
                if (prev.width === width && prev.height === height) {
                    return prev
                }

                return { width, height }
            })
        })

        resizeObserver.observe(observeTarget)

        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return (
        <Box
            ref={containerRef}
            sx={{ width: "100%", height: "100%", ...containerSx }}
        >
            <ResponsiveSizeContext.Provider value={size}>
                {children}
            </ResponsiveSizeContext.Provider>
        </Box>
    )
}

export default ResponsiveVisualizationContainer
