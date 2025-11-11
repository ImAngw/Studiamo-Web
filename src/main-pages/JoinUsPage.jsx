import React, {useContext} from 'react';
import { useTranslation } from 'react-i18next';
import {WindowSizeContext} from "../context/Context";
import Header from "../components/Header";
import CustomFooter from "../components/CustomFooter";



function JoinUsPage() {
    const { width, height } = useContext(WindowSizeContext);
    const { t } = useTranslation();
    const strings = t("JoinUsPage", { returnObjects: true });

    let img;
    if (width < 600) {
        img = "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/cover-images/join-us/vertical.jpg";
    } else {
        img = "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/cover-images/join-us/horizontal.jpg";
    }

    return (
        <div className={'join-us-style'} style={{overflowX: 'hidden'}}>
            <Header img={img}/>
            <div style={{paddingRight:15, paddingLeft:15, paddingTop:50}}>
                <h1 className={'title-font'}>{strings.title}</h1>
                <p className={'main-font'}>{strings.par1}</p>
                <p className={'main-font'}>{strings.par2}</p>
                <p className={'main-font'}>{strings.par3}</p>
            </div>
            <CustomFooter/>
        </div>


    );
}

export default JoinUsPage;