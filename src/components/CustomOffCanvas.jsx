import React, {useContext, useState} from 'react';

import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

import Offcanvas from "react-bootstrap/Offcanvas";
import {ButtonWithIcon, ButtonWithText} from "./CustomButtons";

import {WindowSizeContext} from "../context/Context";


import menuIcon from '../assets/icons/dots.png'
import imAngIcon from '../assets/icons/imagw-logo.png'
import img from "../assets/logo/logo.jpg";




function CustomOffCanvas() {
    const { width, height } = useContext(WindowSizeContext);

    const { t } = useTranslation();
    const strings = t("OffCanvas", { returnObjects: true });

    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    return (
        <div style={{display: "flex", flexDirection: 'column', justifyContent: "flex-end"}}>
            <ButtonWithIcon action={handleShow} icon={menuIcon}/>

            <Offcanvas
                show={show}
                onHide={handleClose}
                style={{width: '300px', height:height, }}
                onClick={() => handleClose()}
            >
                <Offcanvas.Header>
                    <Offcanvas.Title style={{width: '100%'}}>
                        <h1 className={'title-font'} style={{fontSize: '50px', textAlign: 'center'}}> StudiAmo</h1>
                        <h2 className={'title-font'} style={{fontSize: '18px', textAlign: 'center', color:'black'}}>{strings.subtitle}</h2>
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <ButtonWithText
                        action={() => {
                            navigate('/');
                            window.scrollTo(0, 0);
                        }}
                        text={strings.home}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>

                    <ButtonWithText
                        action={() => {
                            navigate('/tutor_page');
                            window.scrollTo(0, 0);
                        }}
                        text={strings.tutor_area}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>


                    <ButtonWithText
                        action={() => {
                            navigate('/join_us_page');
                            window.scrollTo(0, 0);
                        }}
                        text={strings.join_us}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>
                </Offcanvas.Body>

                <div
                    style={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        display: 'flex',
                        flexDirection: 'row',       // elementi affiancati
                        justifyContent: 'center',   // centra orizzontalmente
                        alignItems: 'center',       // centra verticalmente
                        gap: '5px'                  // spazio tra testo e immagine
                    }}
                >
                    <p style={{ margin: 0, fontSize:11}}>{strings.powered_by}</p>
                    <img src={imAngIcon} alt="Image" style={{ height: '40px', width: '40px' }} />
                </div>
            </Offcanvas>
        </div>
    );
}

export default CustomOffCanvas;






