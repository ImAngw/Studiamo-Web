import React, { useContext } from 'react';
import {WindowSizeContext} from "../context/Context";
import Header from "../components/Header";
import Example from "../components/NewHeader";
import Login from "../components/Login";
import {useTranslation} from "react-i18next";
import TutorAreaContent from "../components/TutorAreaContent";
import NewFooter from "../components/NewFooter";
import ScrollToTop from "../admin-components/ScrollToTop";




function TutorPage() {
    const { width, height } = useContext(WindowSizeContext);
    const { t } = useTranslation();
    const strings = t("TutorPage", { returnObjects: true });


    let img;
    if (width < 600) {
        img = "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/cover-images/login-page/vertical.jpg";
    } else {
        img = "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/cover-images/login-page/horizontal.jpg";
    }

    return (
        <div className={'tutor-style pt-[80px]'} style={{overflowX: 'hidden'}}>

            {/*<Header img={img}/>*/}
            <ScrollToTop/>
            <Example/>
            <TutorAreaContent/>
            {/*
            <div style={{paddingRight:15, paddingLeft:15, paddingTop:50}}>
                <h1 className={'title-font'}>{strings.title}</h1>
                <p className={'main-font'}>{strings.par1}</p>
                <p className={'main-font'}>{strings.par2}</p>
            </div>
            <Login />
            */}
            <NewFooter/>
        </div>

    );
}

export default TutorPage;