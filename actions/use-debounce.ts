import { useEffect, useState } from "react";

export function usedebounce<T>(value: T, delay?:number): T {
    const [debounce, setdebounce] = useState<T>(value)
    useEffect(()=>{
        const Timer = setTimeout(()=> {
            setdebounce(value)
        }, delay || 500)
        return () => {
            clearTimeout(Timer)
        }
    }, [value, delay])
    return debounce
}