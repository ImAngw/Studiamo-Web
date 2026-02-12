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
                        ? "rgba(255, 255, 255, 0.3)" // più scuro al passaggio del mouse
                        : "rgba(0, 0, 0, 0.05)", // più trasparente normalmente
                    transition: "background-color 0.5s ease",
                }}
            >
                <CustomNavBar/>
            </div>
            <div>
                <Image src={img} style={{width: '100%', maxHeight: '450px'}}/>
                <svg
                    viewBox="0 0 1440 150"       // griglia interna logica
                    preserveAspectRatio="none"    // permette di scalare l’onda liberamente
                    style={{
                        position: "absolute",
                        bottom: -1,
                        left: 0,
                        width: "100%",             // si adatta al width reale del container
                        height: "30px",            // altezza reale in px dell’onda
                    }}
                >
                    <path
                        fill="#fff"
                        d="M0,64 C360,160 1080,0 1440,64 L1440,150 L0,150 Z"
                    />
                </svg>
            </div>
        </div>
    )
}


export default Header;




