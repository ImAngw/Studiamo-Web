import React, {useState, useEffect} from "react";
import { useTranslation } from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import closeIcon from '../assets/icons/close.png';
import addUserIcon from '../assets/icons/add-user.png';
import addLessonIcon from '../assets/icons/add-lesson.png';
import delUserIcon from '../assets/icons/remove-user.png';
import Dropdown from "react-bootstrap/Dropdown";
import {addNewLesson} from "../supabase/DBFunctions";

import {FailAlert, SuccessAlert} from "../components/AlertComponents";





function NewStudentSlot({idx, students, setAvailableStudents, availableStudents, setStudentDict}) {
    const [selectedId, setSelectedId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [money, setMoney] = useState(0);

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
        <div style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:10}}>
            <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx}:</b></p>
            <Dropdown>
                <Dropdown.Toggle style={{
                    backgroundColor: 'transparent',  // nessun colore di sfondo
                    border: '1px solid black',     // bordo verde (o quello che vuoi)
                    color: 'black',                // testo verde per coerenza
                    boxShadow: 'none',                // rimuove l’ombra del focus
                    width:'300px',
                    fontSize: '10px',
                }}>
                    <p style={{ display: 'inline', margin: 0, paddingRight: selectedStudent ? 20:0 }}>{selectedStudent}</p>

                </Dropdown.Toggle>
                <Dropdown.Menu style={{
                    width: '200px',   // larghezza minima
                    maxHeight: '230px',  // altezza massima
                    overflowY: 'auto',   // scroll se troppi elementi
                }}>
                    {students.map((s, index) => (
                        availableStudents.includes(s.student_id) ? (
                            index === students.length - 1 ? (
                                <Dropdown.Item
                                    key={index}
                                    style={{fontSize: '10px'}}
                                    onClick={() => {
                                        setAvailableStudents(availableStudents.filter((id) => id !== s.student_id));
                                        if (selectedId !== null) {
                                            setAvailableStudents(prev => [...prev, selectedId]);
                                        }
                                        setSelectedId(s.student_id)
                                        setSelectedStudent(s.student_name + " " + s.student_surname);
                                    }
                                }>
                                    {s.student_name + " " + s.student_surname}
                                </Dropdown.Item>

                            ) : (
                                <div key={index}>
                                    <Dropdown.Item
                                        style={{fontSize: '10px'}}

                                        onClick={() => {
                                            setAvailableStudents(availableStudents.filter((id) => id !== s.student_id));
                                            if (selectedId !== null) {
                                                setAvailableStudents(prev => [...prev, selectedId]);

                                            }
                                            setSelectedId(s.student_id)
                                            setSelectedStudent(s.student_name + " " + s.student_surname);

                                        }
                                    }>
                                        {s.student_name + " " + s.student_surname}
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                </div>
                            )
                        ) : null
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            {/*
            <p style={{ display: 'inline', margin: 0, alignContent:'center', paddingLeft:20}} className={'main-font'}><b>€:</b></p>
            <input
                type="number"
                value={money}
                onChange={(e) => setMoney(e.target.value)}
                placeholder="€€€€"
                style={{ width: '50px', border: '1px solid black', borderRadius: '8px', padding: '5px', fontSize: '10px'}}
            />
            */}

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


function AddLessonPage({setIsOpen, lessonTypes, lessonFormats, students, setAllLessons, setShowAlert}) {
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
                backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                    padding: "20px",
                    width: "95%",
                    maxWidth: "400px",
                    position: "relative",
                    maxHeight: "90vh", // 👈 limita l’altezza
                    overflowY: "auto", // 👈 scroll solo dentro la "nuvoletta"

                }}
            >
                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:10}}>
                    <h1 style={{textAlign: 'center', margin: 0, fontSize:35, color:"green"}}> {strings.title}</h1>
                    <div style={{position: 'absolute', right: '15px', top: '10px',}}>
                        <ButtonWithIcon action={() => setIsOpen(false)} icon={closeIcon} />
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                    {/*
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'80px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, paddingRight:20 }}>{selectedDay}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '200px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {days.map((day, index) => (
                                index === days.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => {setSelectedDay(day)}
                                    }>
                                            {day}
                                    </Dropdown.Item>

                                    ) : (
                                        <div key={index}>
                                            <Dropdown.Item onClick={() => {setSelectedDay(day)}}>{day}</Dropdown.Item>
                                            <Dropdown.Divider />
                                        </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    */}
                    <p style={{ display: 'inline', margin: 0, paddingRight:20, paddingLeft:20 }} className={'main-font'}><b>{day}</b></p>
                    <p style={{ display: 'inline', margin: 0, paddingRight:20, paddingLeft:20 }} className={'main-font'}><b>{monthMap[month]}</b></p>
                    <p style={{ display: 'inline', margin: 0, paddingRight:20 }} className={'main-font'}><b>{year}</b></p>
                </div>

                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '10px 0', paddingTop: '10px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                    <p style={{ display: 'inline', margin: 0, paddingRight:20 }} className={'main-font'}><b>{strings.hours}:</b></p>
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'80px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, paddingRight:20 }}>{hours}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '200px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {allowedHours.map((hour, index) => (
                                index === allowedHours.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => {setHours(hour)}
                                        }>
                                        {hour}
                                    </Dropdown.Item>

                                ) : (
                                    <div key={index}>
                                        <Dropdown.Item onClick={() => {setHours(hour)}}>{hour}</Dropdown.Item>
                                        <Dropdown.Divider />
                                    </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <p style={{ display: 'inline', margin: 0, paddingRight:20, paddingLeft:20 }} className={'main-font'}><b>{strings.minutes}:</b></p>
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'80px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, paddingRight:20 }}>{minutes}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '200px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {allowedMinutes.map((min, index) => (
                                index === allowedHours.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => {setMinutes(min)}
                                    }>
                                        {min}
                                    </Dropdown.Item>

                                ) : (
                                    <div key={index}>
                                        <Dropdown.Item onClick={() => {setMinutes(min)}}>{min}</Dropdown.Item>
                                        <Dropdown.Divider />
                                    </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '10px 0', paddingTop: '10px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                    <p style={{ display: 'inline', margin: 0, paddingRight:20}} className={'main-font'}><b>{strings.type}:</b></p>
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'230px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, paddingRight: lessonTypeStr ? 20:0 }}>{lessonTypeStr}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '230px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {lessonTypes.map((type, index) => (
                                index === lessonTypes.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => {
                                            setLessonTypeId(type.type_id);
                                            setLessonTypeStr(type.italian_name);
                                    }}>
                                        {type.italian_name}
                                    </Dropdown.Item>

                                ) : (
                                    <div key={index}>
                                        <Dropdown.Item onClick={() => {
                                            setLessonTypeId(type.type_id);
                                            setLessonTypeStr(type.italian_name);
                                        }}>
                                            {type.italian_name}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                    </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '10px 0', paddingTop: '10px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                    <p style={{ display: 'inline', margin: 0, paddingRight:20}} className={'main-font'}><b>{strings.mod}:</b></p>
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'150px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, paddingRight: modStr ? 20:0 }}>{modStr}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '230px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {lessonFormats.map((format, index) => (
                                index === lessonFormats.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => {
                                            setMod(format.format_id);
                                            setModStr(format.italian_name);
                                        }}>
                                        {format.italian_name}
                                    </Dropdown.Item>

                                ) : (
                                    <div key={index}>
                                        <Dropdown.Item onClick={() => {
                                            setMod(format.format_id);
                                            setModStr(format.italian_name);
                                        }}>
                                            {format.italian_name}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                    </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '10px 0', paddingTop: '10px 0' }} />


                <div style={{display: 'flex', flexDirection:'row', justifyContent: 'space-between', paddingRight:20, paddingLeft:20}}>
                    <p style={{ display: 'inline', margin: 0, paddingRight:20}} className={'main-font'}><b>{strings.students}</b></p>
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

                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '10px 0', paddingTop: '10px 0' }} />

                <div style={{display: 'flex', justifyContent:'center'}}>
                    <ButtonWithIcon
                        icon={addLessonIcon}
                        action={async () => {
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
                    />
                </div>

            </div>
        </div>
    );
}

export default AddLessonPage;