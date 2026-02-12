import React, {useContext, useState} from "react";
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";

import Offcanvas from "react-bootstrap/Offcanvas";
import {ButtonWithText, ButtonWithIcon} from "../components/CustomButtons";
import {WindowSizeContext} from "../context/Context";
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
            <ButtonWithIcon action={handleShow} icon={"src/assets/icons/dots.png"}/>
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
                        action={() => {navigate(("/admin_home"))}}
                        text={strings.general}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>

                    <ButtonWithText
                        action={() => {navigate(("/admin_tutor_page"))}}
                        text={strings.tutor}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>

                    <ButtonWithText
                        action={() => {navigate(("/students_page"))}}
                        text={strings.students}
                    />
                    <hr style={{margin: "5px 0", borderColor: "#ccc"}}/>


                    <ButtonWithText
                        action={() => {navigate(("/admin_course_page"))}}
                        text={strings.courses}
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


                <div
                    style={{
                        paddingTop: '10px',
                        paddingBottom: '20px',
                        display: 'flex',
                        flexDirection: 'row',       // elementi affiancati
                        justifyContent: 'center',   // centra orizzontalmente
                        alignItems: 'center',       // centra verticalmente
                        gap: '5px'                  // spazio tra testo e immagine
                    }}
                >
                    <img src={"https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/imagw-logo.png"} alt="Image" style={{ height: '50px', width: '50px' }} />
                </div>

            </Offcanvas>

        </div>
    );
}

export default SecretOffCanvas;