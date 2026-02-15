import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import Dropdown from "react-bootstrap/Dropdown";
import {getCourseStudents, addNewCourseLesson, addNewLesson} from "../supabase/DBFunctions";
import calendarIcon from "../assets/icons/calendar.png";
import {ChevronDownIcon} from "@heroicons/react/16/solid";
import addUserIcon from "../assets/icons/add-user.png";
import delUserIcon from "../assets/icons/remove-user.png";
import {FailAlert} from "../components/AlertComponents";



function AddStudentsTable({students, setStudents, strings}) {
    const togglePres = (idStud, checked) => {
        setStudents(prev =>
            prev.map(s =>
                s.student_id === idStud
                    ? { ...s, pres: checked}
                    : s
            )
        );
    };

    return (
        <div style={{paddingTop:20, paddingBottom:20}}>
            {/*<h5 className="mt-1 text-sm/6 text-gray-600"><b>{strings.students}</b></h5>*/}


            <div className="pt-1">
                <div className="h-[300px] overflow-y-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                    <table className="w-full text-sm table-fixed">
                        <thead className="sticky top-0 bg-[#E9E1CD] z-10 text-xs uppercase tracking-wide text-gray-700">
                        <tr>
                            <th className="w-52 px-2 py-3 text-left">{strings.student}</th>
                            <th className="w-20 px-2 py-3 text-center">{strings.in_class}</th>
                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {students?.map((stud, index) => (
                            <tr
                                key={stud.student_id}
                                className={`transition-colors hover:bg-gray-50 ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }`}
                            >
                                <td className="px-2 py-3 text-[12px]">
                                    {stud.student_surname} {stud.student_name}
                                </td>

                                <td className="px-2 py-3 text-center">
                                    <label className="relative inline-block w-14 h-8 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={!!stud.pres}
                                            onChange={(e) =>
                                                togglePres(stud.student_id, e.target.checked)
                                            }
                                        />

                                        {/* background */}
                                        <div className="w-full h-full bg-gray-300 rounded-full transition-colors peer-checked:bg-green-500" />

                                        {/* pallino */}
                                        <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-200 peer-checked:left-7">
                                            {/* X icon */}
                                            <svg
                                                className={`w-4 h-4 text-gray-600 ${stud.pres ? "hidden" : "block"}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>

                                            {/* Check icon */}
                                            <svg
                                                className={`w-4 h-4 text-green-600 ${stud.pres ? "block" : "hidden"}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </label>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}


function confirmLesson(strings, year, month, day, courseId, hours, minutes, students, setShowAlert, setText) {
    let error = "";

    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const date = `${year}-${mm}-${dd}`;


    if (hours === 0 && minutes === 0) {
        error += strings.error1 + "\n";
    }

    if (students.filter(stud => stud.pres === true).length === 0) {
        error += strings.error2 + "\n";
    }

    if (courseId === null) {
        error += strings.error3 + "\n";
    }

    if (error !== "") {
        //alert(error);
        setText(error);
        setShowAlert(true);
        return {state: false, data: null};
    } else {
        return {state: true, data: date}
    }
}




function AddLessonPage({setIsOpen, setAllLessons, courseList, setShowSuccessAlert}) {
    const { t } = useTranslation();
    const strings = t("AddCourseLessonPage", { returnObjects: true });
    const monthStrings = t("Months", { returnObjects: true });
    const [showFailAlert, setShowFailAlert] = useState(false);
    const [text, setText] = useState("");


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
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const allowedHours = [0, 1, 2, 3, 4, 5]
    const allowedMinutes = [0, 15, 30, 45]

    const [selectedDay, setSelectedDay] = useState(day);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [course, setCourse] = useState({id: null, name: "", price: 0})
    const [students, setStudents] = useState([]);

    const [isVisible, setIsVisible] = useState(false);



    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                overflowY: "auto",
            }}
        >
            {showFailAlert &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Sfondo semi-trasparente */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <FailAlert show={showFailAlert} onClose={() => setShowFailAlert(false)} text={text}/>
                </div>
            }

            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "40px",
                    width: "95%",
                    position: "relative",
                    maxHeight: "90vh", // 👈 limita l’altezza
                    overflowY: "auto", // 👈 scroll solo dentro la "nuvoletta"
                    maxWidth: "800px",
                }}
            >

                <form
                    id="add-course-lesson"
                    onSubmit={(e) => {
                        e.preventDefault(); // blocca il reload
                    }}
                >
                    <div className="space-y-10">
                        <div className="border-b border-gray-900/10 pb-1">
                            <h1 className="text-base/7 font-semibold text-gray-900" style={{fontSize:35}}>{strings.title}</h1>
                            <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center', paddingBottom:15}}>
                                <img src={calendarIcon} className="w-7 h-7 mr-2" alt="add user icon"/>
                                <p style={{ display: 'inline', margin: 0, paddingRight:5, paddingLeft:20, fontSize:12}}><b>{day}</b></p>
                                <p style={{ display: 'inline', margin: 0, paddingRight:5, paddingLeft:5, fontSize:12 }}><b>{monthMap[month]}</b></p>
                                <p style={{ display: 'inline', margin: 0, fontSize:12}}><b>{year}</b></p>
                            </div>

                            <p className="mt-1 text-sm/6 text-gray-600">
                                {strings.par}
                            </p>
                        </div>

                        <div className="border-b border-gray-900/10 pb-6">
                            <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label htmlFor="hours" className="block text-sm/6 font-medium text-gray-900">
                                        <b>{strings.hours}</b>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="hours"
                                            name="hours"
                                            autoComplete="country-name"
                                            onChange={(e) => setHours(Number(e.target.value))}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            {allowedHours.map((hour, index) => (
                                                <option key={index} value={hour}>
                                                    {hour}
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
                                    <label htmlFor="minutes" className="block text-sm/6 font-medium text-gray-900">
                                        <b>{strings.minutes}</b>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="minutes"
                                            name="minutes"
                                            autoComplete="country-name"
                                            onChange={(e) => setMinutes(Number(e.target.value))}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            {allowedMinutes.map((min, index) => (
                                                <option key={index} value={min}>
                                                    {min}
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

                            <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                                <div className="sm:col-span-1">
                                    <label htmlFor="type" className="block text-sm/6 font-medium text-gray-900">
                                        <b>{strings.course}</b>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="type"
                                            name="type"
                                            value={course.id || ""}
                                            onChange={async (e) => {
                                                const selectedCourse = courseList.find(
                                                    c => String(c.id_course) === e.target.value
                                                );

                                                if (!selectedCourse) return;

                                                setCourse({
                                                    id: selectedCourse.id_course,
                                                    name: selectedCourse.name,
                                                    price: selectedCourse.price_per_hour,
                                                });

                                                const stud = await getCourseStudents(selectedCourse.id_course);

                                                setStudents(
                                                    stud.map(s => ({
                                                        ...s,
                                                        pres: false
                                                    }))
                                                );

                                                setIsVisible(true);
                                            }}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >

                                            <option value="" disabled>
                                                Seleziona un corso
                                            </option>

                                            {courseList.map((c, index) => (
                                                <option key={index} value={c.id_course}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {isVisible && (
                                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                                    <AddStudentsTable
                                        students={students}
                                        setStudents={setStudents}
                                        strings={strings}
                                    />
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={() => setIsOpen(false)}>
                            {strings.del}
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-gradient-to-r from-[#9AD0EC] to-[#9BCECF] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:from-[#89C2E0] hover:to-[#8EC0C1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9BCECF]"
                            onClick={async () => {

                                const check = confirmLesson(strings, year, month, selectedDay, course.id,  hours, minutes, students, setShowFailAlert, setText);
                                if (check.state) {
                                    const studInClass = students
                                        .filter(stud => stud.pres === true)
                                        .map(({ pres, student_id, student_name, student_surname }) => ({
                                            s_id: student_id,
                                            name: student_name,
                                            surname: student_surname
                                        }));

                                    const newInfo = await addNewCourseLesson(
                                        check.data,
                                        course.id,
                                        hours,
                                        minutes,
                                        studInClass.map(({ s_id }) => s_id),
                                        Math.round((Number(course.price) * (Number(hours) + Number(minutes) / 60)) * 100) / 100,
                                        false
                                    )


                                    const newLesson = {
                                        course_id: course.id,
                                        day: check.data,
                                        is_processed: false,
                                        l_id: newInfo.lesson_id,
                                        lesson_cost: Math.round((Number(course.price) * (Number(hours) + Number(minutes) / 60)) * 100) / 100,
                                        n_hours: hours,
                                        n_minutes: minutes,
                                        student_list: studInClass
                                    }

                                    setAllLessons(prev => {
                                        return [
                                            ...prev,
                                            newLesson
                                        ];
                                    });

                                    //alert(strings.success)
                                    setShowSuccessAlert(true)
                                    setIsOpen(false)
                                }

                            }}
                        >
                            {strings.confirm}
                        </button>
                    </div>


                </form>



                {/*
                <div style={{display: 'flex', justifyContent:'center'}}>
                    <ButtonWithIcon
                        icon={"src/assets/icons/add-lesson.png"}
                        action={async () => {
                            const check = confirmLesson(strings, year, month, selectedDay, course.id,  hours, minutes, students);
                            if (check.state) {

                                const studInClass = students
                                    .filter(stud => stud.pres === true)
                                    .map(({ pres, student_id, student_name, student_surname }) => ({
                                        s_id: student_id,
                                        name: student_name,
                                        surname: student_surname
                                    }));

                                const newInfo = await addNewCourseLesson(
                                    check.data,
                                    course.id,
                                    hours,
                                    minutes,
                                    studInClass.map(({ s_id }) => s_id),
                                    Math.round((Number(course.price) * (Number(hours) + Number(minutes) / 60)) * 100) / 100,
                                    false
                                )


                                const newLesson = {
                                    course_id: course.id,
                                    day: check.data,
                                    is_processed: false,
                                    l_id: newInfo.lesson_id,
                                    lesson_cost: Math.round((Number(course.price) * (Number(hours) + Number(minutes) / 60)) * 100) / 100,
                                    n_hours: hours,
                                    n_minutes: minutes,
                                    student_list: studInClass
                                }

                                setAllLessons(prev => {
                                    return [
                                        ...prev,
                                        newLesson
                                    ];
                                });

                                alert(strings.success)
                                setIsOpen(false)
                            }
                        }}
                    />
                </div>

                */}









            </div>
        </div>
    );
}

export default AddLessonPage;