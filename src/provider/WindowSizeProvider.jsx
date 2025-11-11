import React, {useState, useEffect} from "react";
import {WindowSizeContext} from "../context/Context";


function useWindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            let w = document.documentElement.clientWidth;
            let h = document.documentElement.clientHeight;
            setSize({ width: w, height: h });
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}

export function WindowSizeProvider({ children }) {
    const size = useWindowSize();

    return (
        <WindowSizeContext.Provider value={size}>
            {children}
        </WindowSizeContext.Provider>
    );
}
