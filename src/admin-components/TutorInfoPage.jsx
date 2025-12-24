import React, {useEffect, useState} from "react";
import {ButtonWithIcon} from "../components/CustomButtons";
import closeIcon from "../assets/icons/close.png";
import {useTranslation} from "react-i18next";

import {
    getFollowedStudentsAdmin,
    getStudBySurname,
    removeTutorStudentRelation,
    getTutorCourse,
    updateTutor, addTutorStudentRelation, removeTutorCourseRelation, addStudentCourseRelation,
    updateStudentCourseRelation, addTutorCourseRelation, updateTutorCourseRelation
} from "../supabase/DBAdminFunctions";
import removeIcon from "../assets/icons/remove-user.png";
import searchIcon from "../assets/icons/search.png";
import {useAdminData, useAdminStudentsData} from "../provider/AppAdminContext";
import confirmIcon from "../assets/icons/confirm.png";




function TutorInfoPage({setIsOpen, tutor}) {
    const { t } = useTranslation();
    const strings = t("TutorInfoPage", { returnObjects: true });

    const [students, setStudents] = useState([]);
    const [tutorCourses, setTutorCourses] = useState([]);
    const {courses} = useAdminData()
    const {tutorRoles} = useAdminStudentsData();


    const [formData, setFormData] = useState({
        uid: tutor.uid,
        name: tutor.name,
        surname: tutor.surname,
        role: tutor.role,
        lastActivity: tutor.last_activity_date
    });



    const [searchedStr, setSearchedStr] = useState('');
    const [searchedStudents, setSearchedStudents] = useState([]);
    const [studentsToAdd, setStudentsToAdd] = useState([]);


    const [searchedCourseStr, setSearchedCourseStr] = useState('');
    const [searchedCourses, setSearchedCourse] = useState([]);


    const handleChange = (event) => {
        setSearchedStr(event.target.value);
    };
    const handleDataChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleCourseDataChange = (event, id_course) => {
        const { name, value } = event.target;
        setTutorCourses(prev =>
            prev.map(item =>
                item.id_course === id_course
                    ? { ...item, [name]: String(value) }
                    : item
            )
        );
    }
    const handleCourseChange = (event) => {
        setSearchedCourseStr(event.target.value);
        const filtered = courses.filter(c =>
            c.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setSearchedCourse(filtered);
    };


    useEffect(() => {
        const fetchData = async () => {
            const stud = await getFollowedStudentsAdmin(tutor.uid);
            setStudents(stud);

            const c = await getTutorCourse(tutor.uid);
            setTutorCourses(c);
        }
        fetchData();
    }, [])



    useEffect(() => {
        const fetchStudentsBySurname = async () => {
            try {
                const studentBySurname = await getStudBySurname(searchedStr);
                let availableStudents = studentBySurname.filter(
                    stud => !students.some(s => s.student_id === stud.student_id)
                );

                availableStudents = availableStudents.filter(
                    stud => !studentsToAdd.some(s => s.stud_id === stud.stud_id)
                );

                setSearchedStudents(availableStudents);
            } catch (err) {
                console.error(err);
            }
        };

        if (searchedStr.trim() === '') {
            setSearchedStudents([]);
            return;
        }
        fetchStudentsBySurname();

    }, [searchedStr]);



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
                }}
            >
                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:20}}>
                    <h1 className="title-font" style={{textAlign: 'center', margin: 0}}> {strings.title}</h1>
                    <div style={{position: 'absolute', right: '15px', top: '10px',}}>
                        <ButtonWithIcon action={() => setIsOpen(false)} icon={closeIcon} />
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:18}}> {strings.name}:</h1>
                    <input
                        type="text"
                        name={"name"}
                        value={formData.name}
                        onChange={handleDataChange}
                        placeholder=" "
                        className={'main-font'}
                        style={{ width: '200px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 22}}
                    />
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:18}}> {strings.surname}:</h1>
                    <input
                        type="text"
                        name={"surname"}
                        value={formData.surname}
                        onChange={handleDataChange}
                        placeholder=" "
                        className={'main-font'}
                        style={{ width: '200px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 22}}
                    />
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:18}}> {strings.role}:</h1>
                    <input
                        type="text"
                        name={"role"}
                        value={formData.role}
                        onChange={handleDataChange}
                        placeholder=" "
                        className={'main-font'}
                        style={{ width: '200px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 22}}
                    />
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:18}}> {strings.lastActivity}:</h1>
                    <p className="main-font" style={{textAlign: 'center', margin: 0, fontSize:22}}> {formData.lastActivity}</p>
                </div>


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:20, paddingTop:30}}>
                    <h1 className="title-font" style={{textAlign: 'center', margin: 0, fontSize:30}}> {strings.followed_students}</h1>
                </div>

                {students.map((student, idx) => (
                    <div key={idx} style={{display: 'flex', flexDirection:'row', paddingTop:15, justifyContent:'space-between'}}>
                        <div>
                            <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                            <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{student.student_surname + " " + student.student_name }</p>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', paddingRight:40}}>
                            <ButtonWithIcon
                                icon={removeIcon}
                                action={async () => {
                                    await removeTutorStudentRelation(student.student_id, formData.uid);
                                    const filtered = students.filter(stud => stud.student_id !== student.student_id);

                                    setStudents(filtered);
                                }}
                            />
                        </div>
                    </div>
                ))}

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:20, paddingTop:30}}>
                    <h1 className="title-font" style={{textAlign: 'center', margin: 0, fontSize:30}}> {strings.new_students}</h1>
                </div>

                <div style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
                    {/* search bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        maxWidth: '90%',
                        backgroundColor: '#fff',
                        margin: '0 auto',
                    }}>
                        <img
                            src={searchIcon}
                            alt="search"
                            style={{ width: '18px', height: '18px', marginRight: '6px', opacity: 0.6 }}
                        />
                        <input
                            type="text"
                            value={searchedStr}
                            onChange={handleChange}
                            placeholder="Cerca studente per cognome..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '15px'
                            }}
                        />
                    </div>

                    {/* dropdown con i risultati */}
                    {searchedStudents.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginTop: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            zIndex: 10,
                            maxHeight: '200px',
                            width: '90%',
                            overflowY: 'auto',
                            margin: '0 auto'
                        }}>
                            {searchedStudents.map((stud, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setStudentsToAdd([...studentsToAdd, stud]);
                                        setSearchedStudents([]);
                                        setSearchedStr('');

                                    }}
                                    style={{
                                        padding: '8px 10px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    {stud.stud_surname} {stud.stud_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {studentsToAdd.map((student, idx) => (
                    <div key={idx} style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:25}}>
                        <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                        <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{student.stud_surname + " " + student.stud_name}</p>
                        <ButtonWithIcon
                            icon={removeIcon}
                            action={() => {
                                const availableStudents = studentsToAdd.filter(
                                    s => s.stud_id !== student.stud_id
                                );
                                setStudentsToAdd(availableStudents);
                            }}
                        />

                    </div>
                ))}


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:20, paddingTop:40}}>
                    <h1 className="title-font" style={{textAlign: 'center', margin: 0, fontSize:30}}> {strings.followed_courses}</h1>
                </div>


                {tutorCourses.map((course, idx) => (
                    <div key={idx}>
                        <div style={{paddingTop:25}}>
                            <div style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:10}}>
                                <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                                <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{course.name}</p>
                                <ButtonWithIcon
                                    icon={removeIcon}
                                    action={async () => {
                                        if (!course.hasOwnProperty("isNew")) {
                                            await removeTutorCourseRelation(course.id_course, formData.uid);
                                        }
                                        const filtered = tutorCourses.filter(item => item.id_course !== course.id_course);
                                        setTutorCourses(filtered);
                                    }}
                                />

                                {course.hasOwnProperty("isNew") && (
                                    <p style={{ display: 'inline', margin: 0, paddingLeft: 50, color:"red"}} className={"main-font"}>New</p>
                                )}
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '1px 0', paddingTop: '1px 0' }} />

                            <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                                <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.price}:</h1>
                                <input
                                    name={"price_per_hour"}
                                    value={course.price_per_hour}
                                    onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                    placeholder=" "
                                    className={'main-font'}
                                    style={{ width: '100px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                                />
                            </div>
                            <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />
                        </div>
                    </div>
                ))}


                <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingTop:30 }}>
                    {/* search bar */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '4px 8px',
                        maxWidth: '90%',
                        backgroundColor: '#fff',
                        margin: '0 auto',
                    }}>
                        <img
                            src={searchIcon}
                            alt="search"
                            style={{ width: '18px', height: '18px', marginRight: '6px', opacity: 0.6 }}
                        />
                        <input
                            type="text"
                            value={searchedCourseStr}
                            onChange={handleCourseChange}
                            placeholder="Cerca corso per nome..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '15px'
                            }}
                        />
                    </div>

                    {/* dropdown con i risultati */}
                    {searchedCourses.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            marginTop: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            zIndex: 10,
                            maxHeight: '200px',
                            width: '90%',
                            overflowY: 'auto',
                            margin: '0 auto'
                        }}>
                            {searchedCourses.map((course, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setTutorCourses(prev => {
                                            // se esiste già un elemento con lo stesso id, non aggiungere
                                            if (prev.some(item => item.id_course === course.id_course)) {
                                                return prev; // restituisce la lista invariata
                                            }

                                            // altrimenti aggiungi il nuovo dizionario
                                            return [
                                                ...prev,
                                                {
                                                    id_course: course.id_course,
                                                    name: course.name,
                                                    price_per_hour: "0",
                                                    isNew: true
                                                }
                                            ];
                                        });
                                        setSearchedCourse([]);
                                        setSearchedCourseStr('');

                                    }}
                                    style={{
                                        padding: '8px 10px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #eee',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    {course.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <div style={{display: 'flex', justifyContent:'center', paddingTop:50, paddingBottom:20}}>
                    <ButtonWithIcon
                        icon={confirmIcon}
                        action={async () => {
                            const isNumber = (str) => {
                                const strin = String(str);
                                return !isNaN(strin) && strin.trim() !== "";
                            };

                            let errorStr = ""

                            if (formData.name === "" || formData.surname === "" || formData.role === "") {
                                alert(t(strings.alert_msg));
                            } else {
                                if (isNumber(formData.role)) {
                                    const roleCheck = tutorRoles.find(r => r.id === Number(formData.role));
                                    if (!roleCheck) {
                                        const availableIds = tutorRoles.map(r => r.id).join(", ");
                                        errorStr += `Il ruolo non esiste. Scegli tra: ${availableIds} \n`;
                                    }

                                } else {
                                    errorStr += "Il ruolo deve essere un numero.\n"
                                }

                                for (let course of tutorCourses) {
                                    if (!isNumber(course.price_per_hour)) {
                                        errorStr += "I prezzi devono essere numeri.\n"
                                        break
                                    }
                                }

                                if (errorStr !== "") {
                                    alert(errorStr);
                                } else {
                                    await updateTutor(
                                        formData.uid,
                                        formData.name,
                                        formData.surname,
                                        Number(formData.role)
                                    )


                                    for (let s of studentsToAdd) {
                                        await addTutorStudentRelation(s.stud_id, formData.uid)
                                        console.log(s)
                                    }


                                    for (let c of tutorCourses) {
                                        console.log(c)
                                        if (c.hasOwnProperty("isNew")){
                                            await addTutorCourseRelation(
                                                c.id_course,
                                                formData.uid,
                                                Number(c.price_per_hour)
                                            )
                                        } else {
                                            await updateTutorCourseRelation(
                                                c.id_course,
                                                formData.uid,
                                                Number(c.price_per_hour)
                                            )
                                        }
                                    }

                                    alert(strings.success)
                                    setIsOpen(false)
                                    window.location.reload();
                                }
                            }
                        }}
                    />
                </div>
            </div>

        </div>
    );
}

export default TutorInfoPage;