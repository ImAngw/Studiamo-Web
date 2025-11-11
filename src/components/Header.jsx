import React, {useContext, useState} from 'react';
import CustomNavBar from "./CustomNavBar";
import Image from "react-bootstrap/Image";

import {WindowSizeContext} from "../context/Context";



function Header( {img}) {
    const { width, height } = useContext(WindowSizeContext);
    const [hovered, setHovered] = useState(false);

    return (
        <div style={{position: 'relative', width: width, height: '100%'}}>
            <div
                key="navbar-overlay" // mantiene stabile il nodo DOM
                onMouseLeave={() => setHovered(false)}
                onMouseEnter={() => setHovered(true)}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    zIndex: 10, // << questo la porta in primo piano
                    padding: '1rem',
                    backgroundColor: hovered
                        ? "rgba(255, 255, 255, 0.65)" // più scuro al passaggio del mouse
                        : "rgba(0, 0, 0, 0.01)", // più trasparente normalmente
                    transition: "background-color 0.5s ease",
                }}
            >
                <CustomNavBar/>
            </div>
            <div>
                <Image src={img} style={{width: '100%', maxHeight: '450px'}}/>
            </div>
        </div>
    )
}


export default Header;