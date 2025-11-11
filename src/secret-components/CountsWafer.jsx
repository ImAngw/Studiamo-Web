import React from "react";
import { useTranslation } from 'react-i18next';



function CountsWafer({counts}) {
    const { t } = useTranslation();
    const strings = t("CountsWafer", { returnObjects: true });
    return (
        <div style={{paddingTop: 20}}>
            <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '50px'}}>
                <h1 className={'title-font'} style={{fontSize:40}}>{strings.gain}</h1>
                <p className={'main-font'} style={{fontSize: 35}}> {counts.bill} €</p>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '50px' }}>
                <h1 className={'title-font'} style={{fontSize:40}}>{strings.private}</h1>
                <p className={'main-font'} style={{fontSize: 35}}> {counts.private_hours} h : {counts.private_minutes} min</p>
            </div>

            <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '50px' }}>
                <h1 className={'title-font'} style={{fontSize:40}}>{strings.group}</h1>
                <p className={'main-font'} style={{fontSize: 35}}> {counts.group_hours} h : {counts.group_minutes} min</p>
            </div>
        </div>
    );
}

export default CountsWafer;