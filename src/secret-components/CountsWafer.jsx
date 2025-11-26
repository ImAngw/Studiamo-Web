import React from "react";
import { useTranslation } from 'react-i18next';



function CountsWafer({counts}) {
    const { t } = useTranslation();
    const strings = t("CountsWafer", { returnObjects: true });
    return (
        <div style={{paddingTop: 40}}>
            <div style={{display: 'flex', flexDirection: 'row', alignItems:'center', height: '50px'}}>
                <h1 className="title-font" style={{ fontSize: 40, margin: 0, display: 'flex', alignItems: 'center' }}>
                    {strings.gain}
                </h1>
                <p className="main-font" style={{ fontSize: 25, margin: 0, display: 'flex', alignItems: 'center' }}>
                    {counts.bill} €
                </p>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '50px' }}>
                <h1 className={'title-font'} style={{ fontSize: 40, margin: 0, display: 'flex', alignItems: 'center' }}>{strings.private}</h1>
                <p className={'main-font'} style={{ fontSize: 25, margin: 0, display: 'flex', alignItems: 'center' }}> {counts.private_hours} h : {counts.private_minutes} min</p>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '50px' }}>
                <h1 className={'title-font'} style={{ fontSize: 40, margin: 0, display: 'flex', alignItems: 'center' }}>{strings.group}</h1>
                <p className={'main-font'} style={{ fontSize: 25, margin: 0, display: 'flex', alignItems: 'center' }}> {counts.group_hours} h : {counts.group_minutes} min</p>
            </div>
        </div>
    );
}

export default CountsWafer;