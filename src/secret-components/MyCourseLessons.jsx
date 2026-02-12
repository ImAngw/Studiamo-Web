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
import {ChevronDownIcon} from "@heroicons/react/16/solid";



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





function MyCourseLessons({ courseList, setShowAlert }) {
    const { t } = useTranslation();
    const strings = t("MyCourseLessons", { returnObjects: true });
    const monthStrings = t("Months", { returnObjects: true });

    const monthMap = {
        1: monthStrings.january,
        2: monthStrings.february,
        3: monthStrings.march,
        4: monthStrings.april,
        5: monthStrings.may,
        6: monthStrings.june,
        7: monthStrings.july,
        8: monthStrings.august,
        9: monthStrings.september,
        10: monthStrings.october,
        11: monthStrings.november,
        12: monthStrings.december
    }

    const today = new Date();
    const allowedYears = [today.getFullYear(), today.getFullYear() - 1]
    const allowedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    const [isOpen, setIsOpen] = useState(false);
    const {currentMonth, setCurrentMonth, currentYear, setCurrentYear, allLessons, setAllLessons} = useCourseLessonsData()


    const counts = makeCounts(allLessons)


    return (
        <div>
            <div>
                {/*
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
                */}

                <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <label htmlFor="month" className="block text-sm/6 font-medium text-gray-900">
                            <b>{strings.month}</b>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="month"
                                name="month"
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                {allowedMonths.map((month, index) => (
                                    <option key={index} value={month}>
                                        {monthMap[month]}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </div>
                    </div>


                    <div className="sm:col-span-1">
                        <label htmlFor="year" className="block text-sm/6 font-medium text-gray-900">
                            <b>{strings.year}</b>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="year"
                                name="year"
                                value={currentYear}
                                onChange={(e) => setCurrentYear(Number(e.target.value))}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                {allowedYears.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </div>
                    </div>

                </div>
                {/*
                <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center', gap:'30px'}}>
                    <SecretDropDown options={allowedYears} defaultValue={currentYear} setDefaultValue={setCurrentYear}/>
                    <SecretDropDown options={allowedMonths} defaultValue={currentMonth} setDefaultValue={setCurrentMonth}/>
                </div>
                */}

            </div>

            <div style={{paddingTop:15}}>
                <div
                    style={{
                        height: '345px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        backgroundColor: 'white'
                    }}
                >
                    <table
                        className="table table-striped table-bordered table-hover"
                        style={{ tableLayout: 'fixed'}}
                    >
                        <thead>
                        <tr>
                            <th  style={{fontSize: '16px', width:'40px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}> </th>
                            <th  style={{fontSize: '16px', width:'85px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.data}</th>
                            <th  style={{fontSize: '16px', width:'110px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.course}</th>
                            <th  style={{fontSize: '16px', width:'45px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.hours}</th>
                            <th  style={{fontSize: '16px', width:'45px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.minutes}</th>
                            <th  style={{fontSize: '16px', width:'120px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.students}</th>
                            <th  style={{fontSize: '16px', width:'50px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}> </th>

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
                                                // alert(strings.delete_success)
                                                setShowAlert(true);
                                            }}
                                        />
                                    )}
                                </td>

                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>

                {/*
                <div style={{paddingTop:20}}>
                    <CourseCountsWafer counts={counts}/>
                </div>
                */}
            </div>
        </div>
    );
}

export default MyCourseLessons;