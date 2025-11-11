import React from "react";
import { useTranslation } from 'react-i18next';



function GeneralTableCounts({counts}) {
    const { t } = useTranslation();
    const strings = t("AdminGeneral", { returnObjects: true });


    return (
        <div style={{padding: 20}}>
            <div style={{
                paddingTop:5,
                height: '250px',   // <- altezza fissa
                overflowY: 'auto',    // <- scroll verticale se troppe righe
                border: '1px solid #ccc', // opzionale, per vedere il bordo
                borderRadius: '8px',
            }}>
                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px'}}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.active_tutors}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.n_tutors ?? 0}</p>
                </div>

                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />

                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.active_students}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.n_students ?? 0}</p>
                </div>

                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.lessons}</h1>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <p className={'main-font'} style={{fontSize: 20}}> {counts?.tot_hours ?? 0} {strings.tot_hours}</p>
                        <p className={'main-font'} style={{fontSize: 20}}> {counts?.tot_minutes ?? 0} {strings.tot_minutes}</p>
                    </div>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.money_in}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.money_in ?? 0}</p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.money_out}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.money_out ?? 0}</p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.gain}</h1>
                    <p className="main-font" style={{ fontSize: 20 }}>
                        {(counts?.money_in ?? 0) - (counts?.money_out ?? 0)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default GeneralTableCounts;