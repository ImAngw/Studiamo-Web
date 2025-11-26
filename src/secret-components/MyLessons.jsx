import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import SecretDropDown from "./SecretDropDown";
import {getLessons, deleteLesson} from "../supabase/DBFunctions";
import {ButtonWithIcon} from "../components/CustomButtons";
import delIcon from '../assets/icons/delete.png'
import plusIcon from '../assets/icons/plus.png'
import StudentsDropDown from "./StudentsDropDown";
import CountsWafer from "./CountsWafer";
import AddLessonPage from "./AddLessonPage";



function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

function makeCounts(lessons) {

    let bill = 0.
    let private_hours = 0
    let private_minutes = 0
    let group_hours = 0
    let group_minutes = 0

    for (const lesson of lessons ?? []) {
        const price = lesson.lesson_cost
        const n_students = lesson.student_list.length
        const hours = lesson.lesson_hours
        const min = lesson.lesson_minutes

        const total_time = hours + min / 60.

        bill += price * total_time
        if (n_students === 1) {
            private_hours += hours
            private_minutes += min
        } else {
            group_hours += hours
            group_minutes += min
        }
    }

    if (private_minutes >= 60) {
        const new_hours = Math.trunc(private_minutes / 60)
        const new_min = private_minutes % 60
        private_hours += new_hours
        private_minutes = new_min
    }

    if (group_minutes >= 60) {
        const new_hours = Math.trunc(group_minutes / 60)
        const new_min = group_minutes % 60
        group_hours += new_hours
        group_minutes = new_min
    }


    return {
        bill,
        private_hours,
        private_minutes,
        group_hours,
        group_minutes
    }
}






function MyLessons({studentsList, lessonTypes, lessonFormats}) {
    const { t } = useTranslation();
    const strings = t("MyLessons", { returnObjects: true });

    const today = new Date();
    const allowedYears = [today.getFullYear(), today.getFullYear() - 1]
    const allowedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [allLessons, setAllLessons] = useState([]);

    const [isOpen, setIsOpen] = useState(false);


    const firstData = formatDate(currentYear, currentMonth, 1);
    let lastData = new Date(currentYear, currentMonth, 0);
    lastData = formatDate(lastData.getFullYear(), lastData.getMonth() + 1, lastData.getDate());


    useEffect(() => {
        async function fetchLessons() {
            const lessons = await getLessons(firstData, lastData)
            setAllLessons(lessons)
        }
        fetchLessons();
    }, [firstData, lastData])



    const counts = makeCounts(allLessons)
    return (
        <div style={{padding:20}}>
            <div>
                <div style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingBottom:20, gap:50}}>
                    <h1 className={'title-font'} style={{fontSize:40, margin: 0}}>{strings.title}</h1>
                    <ButtonWithIcon icon={plusIcon} action={() => ( setIsOpen(true))} />
                    {isOpen && (
                        <AddLessonPage
                            setIsOpen={setIsOpen}
                            lessonTypes={lessonTypes}
                            lessonFormats={lessonFormats}
                            students={studentsList}
                            setAllLessons={setAllLessons}
                        />)}
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center', gap:'30px'}}>
                    <SecretDropDown options={allowedYears} defaultValue={currentYear} setDefaultValue={setCurrentYear}/>
                    <SecretDropDown options={allowedMonths} defaultValue={currentMonth} setDefaultValue={setCurrentMonth}/>
                </div>
            </div>

            <div style={{paddingTop:20}}>
                <div
                    style={{
                        height: '245px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc' // opzionale, per vedere il bordo
                    }}
                >
                    <table
                        className="table table-striped table-bordered table-hover"
                        style={{ tableLayout: 'fixed'}}
                    >
                        <thead>
                        <tr>
                            <th className={'title-font'} style={{fontSize: '20px', width:'40px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'80px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.data}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'45px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.hours}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'45px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.minutes}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'85px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.mod}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'80px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.type}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'120px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.students}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>

                        </tr>
                        </thead>
                        <tbody>
                        {allLessons && (allLessons.map((lesson, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.lesson_date}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.lesson_hours}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.lesson_minutes}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.lesson_mod}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.lesson_type}</td>
                                <td className={'main-font'} style={{fontSize: '11px', textAlign: 'left'}}>
                                    <StudentsDropDown students={Object.values(lesson.student_list)} studentsList={studentsList}/>
                                </td>

                                <td style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {lesson.lesson_state ? (
                                        <div style={{ minHeight: '40px' }}></div>
                                    ) : (
                                        <ButtonWithIcon
                                            icon={delIcon}
                                            action={() => {

                                                deleteLesson(lesson.lesson_id)
                                                setAllLessons(prev => prev.filter(l => l.lesson_id !== lesson.lesson_id))
                                                alert(strings.delete_success)
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <CountsWafer counts={counts}/>
            </div>
        </div>
    );
}

export default MyLessons;