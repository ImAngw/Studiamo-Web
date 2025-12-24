import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import SecretDropDown from "./SecretDropDown";
import {deleteCourseLesson} from "../supabase/DBFunctions";
import {ButtonWithIcon} from "../components/CustomButtons";
import delIcon from '../assets/icons/delete.png'
import plusIcon from '../assets/icons/plus.png'
import StudentCourseDropDown from "./StudentCourseDropDown";
import {useCourseLessonsData} from "../provider/AppTutorContext";
import AddCourseLessonPage from "./AddCourseLessonPage";
import CourseCountsWafer from "./CourseCountsWafer";



function makeCounts(lessons) {

    let bill = 0.
    let hours = 0
    let minutes = 0

    for (const lesson of lessons ?? []) {
        const price = lesson.lesson_cost
        const h = lesson.n_hours
        const min = lesson.n_minutes

        hours += h
        minutes += min
        bill += price
    }

    if (minutes >= 60) {
        const new_hours = Math.trunc(minutes / 60)
        const new_min = minutes % 60
        hours += new_hours
        minutes = new_min
    }

    return {bill: bill, hours: hours, minutes: minutes}
}





function MyCourseLessons({ courseList }) {
    const { t } = useTranslation();
    const strings = t("MyCourseLessons", { returnObjects: true });

    const today = new Date();
    const allowedYears = [today.getFullYear(), today.getFullYear() - 1]
    const allowedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const [isOpen, setIsOpen] = useState(false);
    const {currentMonth, setCurrentMonth, currentYear, setCurrentYear, allLessons, setAllLessons} = useCourseLessonsData()


    const counts = makeCounts(allLessons)


    return (
        <div style={{padding:20}}>
            <div>
                <div style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingBottom:20, gap:50}}>
                    <h1 className={'title-font'} style={{fontSize:40, margin: 0}}>{strings.title}</h1>
                    <ButtonWithIcon icon={plusIcon} action={() => ( setIsOpen(true))} />
                    {isOpen && (
                        <AddCourseLessonPage
                            setIsOpen={setIsOpen}
                            setAllLessons={setAllLessons}
                            courseList={courseList}
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
                            <th className={'title-font'} style={{fontSize: '20px', width:'110px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.course}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'45px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.hours}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'45px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.minutes}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'120px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.students}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>

                        </tr>
                        </thead>
                        <tbody>
                        {allLessons && (allLessons.map((lesson, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.day}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{courseList.find(c => c.id_course === lesson.course_id)?.name || ""}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.n_hours}</td>
                                <td className={'main-font'} style={{fontSize: '11px'}}>{lesson.n_minutes}</td>


                                <td className={'main-font'} style={{fontSize: '11px', textAlign: 'left'}}>
                                    <StudentCourseDropDown studentsList={lesson.student_list}/>
                                </td>

                                <td style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {lesson.is_processed ? (
                                        <div style={{ minHeight: '40px' }}></div>
                                    ) : (
                                        <ButtonWithIcon
                                            icon={delIcon}
                                            action={() => {
                                                deleteCourseLesson(lesson.l_id)
                                                setAllLessons(prev => prev.filter(l => l.l_id !== lesson.l_id))
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

                <div style={{paddingTop:20}}>
                    <CourseCountsWafer counts={counts}/>
                </div>
            </div>
        </div>
    );
}

export default MyCourseLessons;