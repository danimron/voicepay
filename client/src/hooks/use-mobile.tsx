import * as React from "react"

const MOBILE_BREAKPOINT = 768
const SMARTWATCH_BREAKPOINT = 400

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useIsSmartwatch() {
  const [isSmartwatch, setIsSmartwatch] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${SMARTWATCH_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsSmartwatch(window.innerWidth < SMARTWATCH_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsSmartwatch(window.innerWidth < SMARTWATCH_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isSmartwatch
}
