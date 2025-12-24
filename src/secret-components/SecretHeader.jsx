import React, {useContext} from "react";
import {WindowSizeContext} from "../context/Context";
import { useTranslation } from 'react-i18next';
import SecretOffCanvas from "./SecretOffCanvas";




function SecretHeader({ name, surname, pageName}) {
    const { width, height } = useContext(WindowSizeContext);
    const { t } = useTranslation();
    const strings = t(pageName, { returnObjects: true });

    return (
        <div
            style={{height: 80, width: width, display: 'flex', alignItems: 'center'}}
            className={pageName === "CoursesPage" ? 'dashboard-navbar-course' : 'dashboard-navbar'}
        >
            <div style={{height: '90%', width: '100%', display: 'flex', flexDirection:'column',}}>
                <h1 className={'title-font'} style={{fontSize: '35px'}}>{strings.title}</h1>
                <h1 className={'main-font'} style={{fontSize: '15px', paddingLeft:'30px'}}> {name} {surname}</h1>

            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', paddingRight: 15}}>
                <SecretOffCanvas/>
            </div>

        </div>
    );
}

export default SecretHeader;