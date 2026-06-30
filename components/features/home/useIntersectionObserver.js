import { useEffect, useRef, useState } from "react"

const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [hasTriggered, setHasTriggered] = useState(false)
    const targetRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTriggered) {
                    setIsIntersecting(true)
                    setHasTriggered(true)
                }
            },
            {
                threshold: 0.3,
                rootMargin: '0px 0px -50px 0px',
                ...options
            }
        )

        if (targetRef.current) {
            observer.observe(targetRef.current)
        }

        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current)
            }
        }
    }, [hasTriggered])

    return [targetRef, isIntersecting]
}

export default useIntersectionObserver
