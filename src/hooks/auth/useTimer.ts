import { useCallback, useEffect, useRef, useState } from "react"

export default function useTimer(initialTime: number = 120) {
    const [countDown, setCountDown] = useState(initialTime)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const clear = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    const tick = useCallback(() => {
        setCountDown((prev) => {
            if (prev <= 1) {
                clear()
                return 0
            }
            return prev - 1
        })
    }, [clear])

    const handleTimerStart = useCallback(() => {
        clear()
        setCountDown(initialTime)
        intervalRef.current = setInterval(tick, 1000)
    }, [initialTime, tick, clear])

    useEffect(() => clear, [clear])

    const seconds = `0${countDown % 60}`.slice(-2)
    const minutes = `0${Math.floor(countDown / 60)}`.slice(-2)

    return {
        minutes,
        seconds,
        time: countDown,
        handleTimerStart,
    }
}
