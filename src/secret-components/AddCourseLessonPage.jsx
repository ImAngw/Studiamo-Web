import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import Dropdown from "react-bootstrap/Dropdown";
import {getCourseStudents, addNewCourseLesson} from "../supabase/DBFunctions";


function AddStudentsTable({students, setStudents, strings}) {
    const allowedSel = ["P", "A"]


    const togglePres = (idStud, sel) => {
        setStudents(prev =>
            prev.map(s =>
                s.student_id === idStud
                    ? { ...s, pres: sel === "P" }
                    : s
            )
        );
    };

    return (
        <div style={{paddingTop:20, paddingBottom:20}}>
            <p style={{}} className={'main-font'}><b>{strings.students}:</b></p>
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
                        <th className={'title-font'} style={{fontSize: '20px', width:'20px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}> </th>
                        <th className={'title-font'} style={{fontSize: '20px', width:'100px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.surname}</th>
                        <th className={'title-font'} style={{fontSize: '20px', width:'100px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.name}</th>
                        <th className={'title-font'} style={{fontSize: '15px', width:'40px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.in_class}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students && (students.map((stud, index) => (
                        <tr key={index}>
                            <td className={'main-font'} style={{fontSize: '11px'}}>{index + 1}</td>
                            <td className={'main-font'} style={{fontSize: '11px'}}>{stud.student_surname}</td>
                            <td className={'main-font'} style={{fontSize: '11px'}}>{stud.student_name}</td>

                            <td className={'main-font'} style={{fontSize: '11px', textAlign: 'left'}}>
                                <Dropdown>
                                    <Dropdown.Toggle style={{
                                        backgroundColor: 'transparent',  // nessun colore di sfondo
                                        border: '1px solid black',     // bordo verde (o quello che vuoi)
                                        color: 'black',                // testo verde per coerenza
                                        boxShadow: 'none',                // rimuove l’ombra del focus
                                        width:'30px',
                                        fontSize: '9px',
                                    }}>
                                        <p style={{ display: 'inline', margin: 0, paddingRight:20 }}>{stud.pres ? "P" : "A"}</p>

                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{
                                        minWidth: '100px',   // larghezza minima
                                        maxHeight: '200px',  // altezza massima
                                        overflowY: 'auto',   // scroll se troppi elementi
                                    }}>
                                        {allowedSel.map((sel, index) => (
                                            index === allowedSel.length - 1 ? (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={() => {
                                                        togglePres(stud.student_id, sel);
                                                    }}>
                                                    {sel}
                                                </Dropdown.Item>

                                            ) : (
                                                <div key={index}>
                                                    <Dropdown.Item onClick={() => {
                                                        togglePres(stud.student_id, sel);
                                                    }}>
                                                        {sel}
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                </div>
                                            )
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}


function confirmLesson(strings, year, month, day, courseId, hours, minutes, students) {
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
        alert(error);
        return {state: false, data: null};
    } else {
        return {state: true, data: date}
    }
}




function AddLessonPage({setIsOpen, setAllLessons, courseList}) {
    const { t } = useTranslation();
    const strings = t("AddCourseLessonPage", { returnObjects: true });
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
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                overflowY: "auto",
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    padding: "20px",
                    width: "95%",
                    position: "relative",
                    maxHeight: "90vh", // 👈 limita l’altezza
                    overflowY: "auto", // 👈 scroll solo dentro la "nuvoletta"
                    maxWidth: "400px",
                }}
            >
                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:60}}>
                    <h1  style={{textAlign: 'center', margin: 0, fontSize:35, color:"green"}}> {strings.title}</h1>
                    <div style={{position: 'absolute', right: '15px', top: '10px',}}>
                        <ButtonWithIcon action={() => setIsOpen(false)} icon={"src/assets/icons/close.png"} />
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
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
                    <p style={{ display: 'inline', margin: 0, paddingRight:20}} className={'main-font'}><b>{strings.course}:</b></p>
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'250px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, marginRight:5}}>{course.name}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '200px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {courseList.map((c, index) => (
                                index === courseList.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={async () => {
                                            setCourse({id: c.id_course, name: c.name, price:c.price_per_hour});
                                            const stud = await getCourseStudents(c.id_course)
                                            const studWithPres = stud.map(s => ({
                                                ...s,
                                                pres: false
                                            }));

                                            setStudents(studWithPres);
                                            setIsVisible(true);
                                        }}>
                                            {c.name}
                                    </Dropdown.Item>

                                ) : (
                                    <div key={index}>
                                        <Dropdown.Item onClick={async () => {
                                            setCourse({id: c.id_course, name: c.name, price:c.price_per_hour});
                                            const stud = await getCourseStudents(c.id_course)
                                            const studWithPres = stud.map(s => ({
                                                ...s,
                                                pres: false
                                            }));

                                            setStudents(studWithPres);
                                            setIsVisible(true);
                                        }}>
                                            {c.name}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                    </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '10px 0', paddingTop: '10px 0' }} />

                {isVisible && (
                    <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start'}}>
                        <AddStudentsTable
                            students={students}
                            setStudents={setStudents}
                            strings={strings}
                        />
                    </div>
                )}

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

            </div>
        </div>
    );
}

export default AddLessonPage;