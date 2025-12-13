import { useEffect, useState } from "react"



export const useDebounce = (value, delay = 800) => {

    const [debounce, setDebounce] = useState(false);
    const [delayData, setDelayData] = useState()

    useEffect(() => {

        if (!value) {
            setDebounce(false)
        }

        const timer = setTimeout(() => {
            if (value) {
                setDebounce(true)
                setDelayData(value)
            }
        }, delay)


        return () => clearTimeout(timer)
    }, [value, delay])


    return { debounce, value: delayData };

}