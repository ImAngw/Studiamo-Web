import React, {useState, useEffect} from "react";
import { useTranslation } from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import closeIcon from '../assets/icons/close.png';
import addUserIcon from '../assets/icons/add-user.png';
import addLessonIcon from '../assets/icons/add-lesson.png';
import delUserIcon from '../assets/icons/remove-user.png';
import Dropdown from "react-bootstrap/Dropdown";
import {addNewLesson} from "../supabase/DBFunctions";

import {FailAlert} from "../components/AlertComponents";

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import calendarIcon from '../assets/icons/calendar.png';





function NewStudentSlot({idx, students, setAvailableStudents, availableStudents, setStudentDict}) {
    const [selectedId, setSelectedId] = useState(null);
    const [money, setMoney] = useState(0);
    const [selectedStudent, setSelectedStudent] = useState(null);



    useEffect(() => {
        setStudentDict(prev => ({
            ...prev,
            [idx]: {
                student_id: selectedId,
                cash_payment: Number(money)
            }
        }));
    }, [selectedId, money, idx, setStudentDict]);


    return (

        <div>
            <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                <div className="sm:col-span-1">
                    <label htmlFor="type" className="block text-sm/6 font-medium text-gray-900">
                        <b>Studente {idx}</b>
                    </label>
                    <div className="mt-2 grid grid-cols-1" style={{maxHeight:"100%", overflowY:"auto"}}>

                        <select
                            value={selectedId || ""}
                            id={`student_${idx}`}
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            onChange={(e) => {
                                const newId = Number(e.target.value);
                                const student = students.find(s => s.student_id === newId);

                                // rimuovi il nuovo studente dagli available
                                setAvailableStudents(availableStudents.filter((id) => id !== Number(newId)));

                                // rimetti il vecchio studente negli available
                                if (selectedId !== null) {
                                    setAvailableStudents(prev => [...prev, selectedId]);
                                }

                                // aggiorna selezione
                                setSelectedId(student.student_id);
                                setSelectedStudent(
                                    student.student_name + " " + student.student_surname
                                );
                            }}
                        >

                            <option value="" disabled>
                                Seleziona studente
                            </option>

                            {students
                                .filter(s => availableStudents.includes(s.student_id) || s.student_id === selectedId)
                                .map((s) => (
                                    <option
                                        key={s.student_id}
                                        value={s.student_id}
                                    >
                                        {s.student_name + " " + s.student_surname}
                                    </option>
                                ))
                            }
                        </select>

                        <ChevronDownIcon
                            aria-hidden="true"
                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500"
                        />
                    </div>
                </div>
            </div>
        </div>










    );
}

function confirmLesson(strings, year, month, day, hours, minutes, lesson_type_id, format_id, studDict, setIsOpen, lessonTypes, lessonFormats, setShowAlert, setText) {
    let error = "";
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const data = `${year}-${mm}-${dd}`;
    if (hours === 0 && minutes === 0) {
        error += strings.error1 + "\n";
    }
    if (lesson_type_id === null) {
        error += strings.error2 + "\n";
    }
    if (format_id === null) {
        error += strings.error3 + "\n";
    }

    const studList = Object.values(studDict)
        .filter(stud => stud.student_id !== null)  // elimina quelli non selezionati
        .map(stud => ({
            student_id: stud.student_id,
            cash_payment: stud.cash_payment,
        }));

    if (studList.length === 0) {
        error += strings.error4 + "\n";
    }


    if (error !== "") {
        //alert(error);
        setText(error);
        setShowAlert(true);
        return {state: false, data: null, studList: null};
    } else {
        let typeStr = "";
        let modStr = "";

        for (let type of lessonTypes) {
            if (type.type_id === lesson_type_id) {
                typeStr = type.italian_name;
                break
            }
        }

        for (let format of lessonFormats) {
            if (format.format_id === format_id) {
                modStr = format.italian_name;
                break
            }
        }

        return {state: true, data:data, studList: studList, modStr: modStr, typeStr: typeStr};

    }

}


function NewAddLessonPage({setIsOpen, lessonTypes, lessonFormats, students, setAllLessons, setShowAlert}) {
    const { t } = useTranslation();
    const strings = t("AddLessonPage", { returnObjects: true });
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
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const lastDay = new Date(year, month, 0).getDate()
    const days = Array.from({ length: lastDay }, (_, i) => i + 1)
    const allowedHours = [0, 1, 2, 3, 4, 5]
    const allowedMinutes = [0, 15, 30, 45]


    const [selectedDay, setSelectedDay] = useState(day);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [lessonTypeId, setLessonTypeId] = useState(null);
    const [lessonTypeStr, setLessonTypeStr] = useState(null);
    const [mod, setMod] = useState(null);
    const [modStr, setModStr] = useState(null);

    const allStudentsId = students.map((student) => {return student.student_id});
    const [available, setAvailable] = useState(allStudentsId);

    const [slots, setSlots] = useState([0]);
    const [studDict, setStudDict] = useState({1: {student_id: null, cash_payment: 0}});
    const [showFailAlert, setShowFailAlert] = useState(false);
    const [text, setText] = useState("");



    const addSlot = () => {
        const idx = slots.length;

        if (studDict[idx].student_id !== null) {
            setSlots((prev) => [...prev, prev.length]); // aggiunge un nuovo indice
        } else {
            // alert(strings.alert) // mostra la nuvoletta
            setShowFailAlert(true);
            setText(strings.alert)
        }
    };

    const removeSlot = () => {
        setSlots((prev) => {
            if (prev.length > 1) {
                const deletedIdx = studDict[prev.length].student_id;
                setAvailable((prev) => [...prev, deletedIdx]);

                const newDict = { ...studDict };
                delete newDict[prev.length];
                setStudDict(newDict);

                return prev.slice(0, -1); // rimuove l'ultimo elemento
            }
            return prev; // se è l'unico, non fa nulla
        });
    };

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                paddingTop:30,
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                display: "flex",
                alignItems: "start",
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
                    maxWidth: "800px",
                    position: "relative",
                    maxHeight: "90vh", // 👈 limita l’altezza
                    overflowY: "auto", // 👈 scroll solo dentro la "nuvoletta"

                }}
            >


                <form onSubmit={(e) => {e.preventDefault()}} id={"add_lesson"}>
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
                                        <b>{strings.type}</b>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="type"
                                            name="type"
                                            value={lessonTypeId || ""}
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                const selectedType = lessonTypes.find(
                                                    (type) => String(type.type_id) === selectedId
                                                );

                                                setLessonTypeId(selectedType.type_id);
                                                setLessonTypeStr(selectedType.italian_name);
                                            }}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >

                                            <option value="" disabled>
                                                Seleziona tipo lezione
                                            </option>

                                            {lessonTypes.map((type) => (
                                                <option key={type.type_id} value={type.type_id}>
                                                    {type.italian_name}
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

                            <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                                <div className="sm:col-span-1">
                                    <label htmlFor="mod" className="block text-sm/6 font-medium text-gray-900">
                                        <b>{strings.mod}</b>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="mod"
                                            name="mod"
                                            value={ mod|| ""}
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                const selectedFormat = lessonFormats.find(
                                                    (format) => String(format.format_id) === selectedId
                                                );

                                                setMod(selectedFormat.format_id);
                                                setModStr(selectedFormat.italian_name);
                                            }}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >

                                            <option value="" disabled>
                                                Seleziona la modalità
                                            </option>

                                            {lessonFormats.map((format) => (
                                                <option key={format.format_id} value={format.format_id}>
                                                    {format.italian_name}
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

                        </div>


                        <div className="border-b border-gray-900/10 pb-12">
                            <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between'}}>
                                <h5 className="mt-1 text-sm/6 text-gray-600"><b>{strings.students}</b></h5>
                                <div style={{display: 'flex', flexDirection:'row', gap:20}}>
                                    <ButtonWithIcon action={() => (addSlot())} icon={addUserIcon} />
                                    <ButtonWithIcon action={() => (removeSlot())} icon={delUserIcon} />
                                </div>
                            </div>

                            {slots.map((idx) => (
                                <NewStudentSlot
                                    key={idx}
                                    idx={idx + 1}
                                    students={students}
                                    availableStudents={available}
                                    setAvailableStudents={setAvailable}
                                    setStudentDict={setStudDict}
                                />
                            ))}
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
                                const check = confirmLesson(strings, year, month, selectedDay, hours, minutes, lessonTypeId, mod, studDict, setIsOpen, lessonTypes, lessonFormats, setShowFailAlert, setText);

                                if (check.state) {
                                    const n_students = check.studList.length < 5 ? check.studList.length : 5;
                                    const newInfo = await addNewLesson(
                                        check.data,
                                        hours,
                                        minutes,
                                        lessonTypeId,
                                        mod,
                                        n_students,
                                        check.studList,
                                        false
                                    );

                                    const newLesson = {
                                        lesson_cost: newInfo.lesson_cost,
                                        lesson_id: newInfo.lesson_id,
                                        lesson_date: check.data,
                                        lesson_hours: hours,
                                        lesson_minutes: minutes,
                                        lesson_mod: check.modStr,
                                        lesson_state: false,
                                        lesson_type: check.typeStr,
                                        student_list: check.studList
                                    }

                                    // alert(strings.success);
                                    setIsOpen(false);
                                    setShowAlert(true);

                                    setAllLessons(prev => {
                                        return [
                                            ...prev,
                                            newLesson
                                        ];
                                    });
                                    // window.location.reload()
                                }
                            }}
                        >
                            {strings.confirm}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewAddLessonPage;
