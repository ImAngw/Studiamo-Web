import React, {useContext, useState} from "react";
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

import Offcanvas from "react-bootstrap/Offcanvas";
import {ButtonWithText, ButtonWithIcon} from "../components/CustomButtons";
import {WindowSizeContext} from "../context/Context";
import menuIcon from '../assets/icons/dots.png'
import {logout} from "../supabase/LogFunctions";



function SecretOffCanvas() {
    const { width, height } = useContext(WindowSizeContext);

    const { t } = useTranslation();
    const strings = t("AdminOffCanvas", { returnObjects: true });

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
                placement="end"
            >
                <Offcanvas.Header>
                    <Offcanvas.Title style={{width: '100%'}}>
                        <h1 className={'title-font'} style={{fontSize: '50px', textAlign: 'center'}}> Menù</h1>
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body>
                    <ButtonWithText
                        action={() => {navigate(("/admin_tutor_page"))}}
                        text={strings.general}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>

                    <ButtonWithText
                        action={() => {navigate(("/students_page"))}}
                        text={strings.students}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>


                    <ButtonWithText
                        action={() => {
                            logout(navigate)
                            window.scrollTo(0, 0);
                        }}
                        text={strings.logout}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>


                </Offcanvas.Body>

            </Offcanvas>

        </div>
    );
}

export default SecretOffCanvas;