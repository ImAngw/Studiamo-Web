import React, {useEffect} from "react";
import { useTranslation } from 'react-i18next';






function GeneralTableCounts({counts, courseCounts, nCourseTutors, nActiveCourseStudents, nActiveCourseTutors}) {
    const { t } = useTranslation();
    const strings = t("AdminGeneral", { returnObjects: true });

    const [hours, setHours] = React.useState();
    const [minutes, setMinutes] = React.useState(0);


    useEffect(  () => {
        if (nCourseTutors.total_minutes >= 60) {
            setHours(nCourseTutors.total_hours + Math.floor(nCourseTutors.total_minutes / 60))
            setMinutes(Math.floor(nCourseTutors.total_minutes / 60))
        } else {
            setHours(nCourseTutors.total_hours)
            setMinutes(nCourseTutors.total_minutes)
        }
    }, [nCourseTutors])


    return (
        <div style={{padding: 20}}>
            <div style={{
                paddingTop:5,
                height: '500px',   // <- altezza fissa
                overflowY: 'auto',    // <- scroll verticale se troppe righe
                border: '1px solid #ccc', // opzionale, per vedere il bordo
                borderRadius: '8px',
            }}>
                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px'}}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.active_tutors}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.n_tutors ?? 0}</p>
                </div>

                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />

                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px'}}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.course_active_tutors}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {nActiveCourseTutors?.n_tutor ?? 0}</p>
                </div>

                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />

                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.active_students}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.n_students ?? 0}</p>
                </div>

                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />

                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.active_students_course}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {nActiveCourseStudents?.n_stud ?? 0}</p>
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
                    <h1 className={'title-font'} style={{fontSize:25}}>{strings.course_lessons}</h1>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <p className={'main-font'} style={{fontSize: 20}}> {hours} {strings.tot_hours}</p>
                        <p className={'main-font'} style={{fontSize: 20}}> {minutes} {strings.tot_minutes}</p>
                    </div>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25, color:"green"}}>{strings.money_in}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.money_in ?? 0}</p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />

                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25, color:"green"}}>{strings.course_money_in}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {courseCounts?.total_money ?? 0}</p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25, color:"red"}}>{strings.money_out}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {counts?.money_out ?? 0}</p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25, color:"red"}}>{strings.course_money_out}</h1>
                    <p className={'main-font'} style={{fontSize: 20}}> {nCourseTutors?.total_money ?? 0}</p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />


                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25, color:"gold"}}>{strings.gain}</h1>
                    <p className="main-font" style={{ fontSize: 20 }}>
                        {Math.round(((counts?.money_in ?? 0) - (counts?.money_out ?? 0)) * 100 ) / 100}
                    </p>
                </div>
                <hr style={{border: 'none', borderTop: '2px solid #ccc', margin: '5px 0'}} />

                <div style={{display: 'flex', flexDirection: 'row', alignContent:'center', height: '30px' }}>
                    <h1 className={'title-font'} style={{fontSize:25, color:"gold"}}>{strings.gain_course}</h1>
                    <p className="main-font" style={{ fontSize: 20 }}>
                        {(courseCounts?.total_money ?? 0) - (nCourseTutors?.total_money ?? 0)}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default GeneralTableCounts;