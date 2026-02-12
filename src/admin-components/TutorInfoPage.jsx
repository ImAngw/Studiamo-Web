import React, {useEffect, useState} from "react";
import {ButtonWithIcon} from "../components/CustomButtons";
import closeIcon from "../assets/icons/close.png";
import {useTranslation} from "react-i18next";

import {
    getFollowedStudentsAdmin,
    getStudBySurname,
    removeTutorStudentRelation,
    getTutorCourse,
    updateTutor, addTutorStudentRelation, removeTutorCourseRelation, addTutorCourseRelation, updateTutorCourseRelation,
    addStudentMonthResume, removeStudentMonthResume, tutor_ban, tutor_activation
} from "../supabase/DBAdminFunctions";
import removeIcon from "../assets/icons/remove-user.png";
import searchIcon from "../assets/icons/search.png";
import {useAdminData, useAdminStudentsData} from "../provider/AppAdminContext";
import confirmIcon from "../assets/icons/confirm.png";
import {addNewLesson} from "../supabase/DBFunctions";
import {ChevronDownIcon} from "@heroicons/react/16/solid";




function TutorInfoPage({setIsOpen, tutor, setShowAlert, setText}) {
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
        lastActivity: tutor.last_activity_date,
        is_banned: tutor.ban_situation
    });



    const [searchedStr, setSearchedStr] = useState('');
    const [searchedStudents, setSearchedStudents] = useState([]);
    const [studentsToAdd, setStudentsToAdd] = useState([]);


    const [searchedCourseStr, setSearchedCourseStr] = useState('');
    const [searchedCourses, setSearchedCourse] = useState([]);

    const [banIsChanged, setBanIsChanged] = useState(false);
    const [firstBan, setFirstBan] = useState(formData.is_banned);


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
        if(event.target.value.trim() === "") {
            setSearchedCourse([])
        } else {
            setSearchedCourse(filtered);
        }

    };


    const handleSliderDataChange = (e) => {
        const { name, type, checked, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        if (checked !== firstBan) {
            setBanIsChanged(true);
        } else {
            setBanIsChanged(false);
        }
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
                    stud => !students.some(s => s.student_id === stud.stud_id)
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
                backgroundColor: "rgba(0, 0, 0, 0.25)",
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
                    padding: "40px",
                    width: "95%",
                    maxWidth: "800px",
                    position: "relative",
                    maxHeight: "700px", // 👈 limita l’altezza
                    overflowY: "auto", // 👈 scroll solo dentro la "nuvoletta"
                }}
            >



                <form onSubmit={(e) => {e.preventDefault()}} id={"tutor-info-page"}>
                    <div className="space-y-10">
                        <div className="border-b border-gray-900/10 pb-1">
                            <h1 className="text-base/7 font-semibold text-gray-900" style={{fontSize:35}}>{strings.title1} </h1>
                            <p className="mt-1 text-sm/6 text-gray-600">
                                {strings.par1}
                            </p>
                        </div>
                    </div>


                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                            <div className="sm:col-span-1">
                                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                    <b>{strings.name}</b>
                                </label>

                                <div className="mt-2 grid grid-cols-1">
                                    <input
                                        id="name"
                                        name="name"
                                        autoComplete="name"
                                        value={formData.name}
                                        onChange={handleDataChange}
                                        className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 sm:col-span-1">
                                <label htmlFor="surname" className="block text-sm/6 font-medium text-gray-900">
                                    <b>{strings.surname}</b>
                                </label>

                                <div className="mt-2 grid grid-cols-1">
                                    <input
                                        id="surname"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleDataChange}
                                        className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <label htmlFor="role" className="block text-sm/6 font-medium text-gray-900">
                                    <b>{strings.role}</b>
                                </label>

                                <div className="mt-2 grid grid-cols-1">
                                    <input
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleDataChange}
                                        className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>


                            <div className="sm:col-span-1">
                                <label htmlFor="last-activity" className="block text-sm/6 font-medium text-gray-900">
                                    <b>{strings.lastActivity}</b>
                                </label>

                                <div className="mt-2 grid grid-cols-1">
                                    <input
                                        id="last-activity"
                                        name="last-activity"
                                        value={formData.lastActivity}
                                        readOnly
                                        className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>
                        </div>


                    </div>


                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                            <div className="sm:col-span-1">
                                <h5 className="mt-5 text-sm/6 text-gray-600"><b>{strings.followed_students}</b></h5>

                                <div className="grid grid-cols-1">
                                    <div style={{ position: 'relative', width: '100%', margin: '0 auto'}}>
                                        {/* search bar */}
                                        <input
                                            type="text"
                                            id="search-stud-input"
                                            value={searchedStr}
                                            onChange={handleChange}
                                            className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                            placeholder="Cerca studente per cognome..."
                                        />

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
                                                width: '100%',
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
                                </div>


                                <p className="mt-1 text-sm/6 text-gray-600 pb-[20px]">
                                    {strings.par2}
                                </p>
                                {students.map((student, idx) => (
                                    <div key={idx} style={{display: 'flex', flexDirection:'row',  justifyContent:'space-between'}}>
                                        <div>
                                            <p style={{ display: 'inline', margin: 0, alignContent:'center', paddingRight:10}}><b>{idx + 1}:</b></p>
                                            <p style={{ display: 'inline', margin: 0, paddingRight: 20}}>{student.student_surname + " " + student.student_name }</p>
                                        </div>
                                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
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
                                {studentsToAdd.map((student, idx) => (
                                    <div key={idx} style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                        <div>
                                            <p style={{ display: 'inline', margin: 0, alignContent:'center', paddingRight:10, color:"red", fontSize:9}}><b>New {idx + 1}:</b></p>
                                            <p style={{ display: 'inline', margin: 0}}>{student.stud_surname + " " + student.stud_name}</p>

                                        </div>


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
                            </div>
                        </div>
                    </div>


                    <div className="mt-5 border-b border-gray-900/10 pb-6">
                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                            <div className="sm:col-span-1">
                                <h5 className="mt-1 text-sm/6 text-gray-600"><b>{strings.followed_courses}</b></h5>
                                <div className="grid grid-cols-1">
                                    <div style={{ position: 'relative', width: '100%', margin: '0 auto'}}>
                                        {/* search bar */}
                                        <input
                                            type="text"
                                            id="search-course-input"
                                            value={searchedCourseStr}
                                            onChange={handleCourseChange}
                                            placeholder="Cerca corso per nome..."
                                            className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                        />
                                        {/* dropdown con i risultati */}
                                        {searchedCourses.length > 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                top:"100%",
                                                left: 0,
                                                right: 0,
                                                backgroundColor: '#fff',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                                marginTop: '4px',
                                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                                zIndex: 10,
                                                maxHeight: '200px',
                                                width: '100%',
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


                                </div>


                                <p className="mt-1 text-sm/6 text-gray-600 pb-[20px]">
                                    {strings.par3}
                                </p>

                                {tutorCourses.map((course, idx) => (
                                    <div key={idx}>
                                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                                            <label htmlFor={"course-name-" + idx} className="block text-sm/6 font-medium text-gray-900">
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between', // ⭐ importante

                                                    }}
                                                >
                                                    <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                        <p style={{ margin: 0, paddingRight: 10 }}>
                                                            <b>{idx + 1}:</b>
                                                        </p>

                                                        {course.hasOwnProperty("isNew") && (
                                                            <p style={{ display: 'inline', margin: 0, color:"red", paddingRight:10}}>New</p>
                                                        )}

                                                        <p style={{ margin: 0, fontSize: 15 }}>
                                                            {course.name}
                                                        </p>
                                                    </div>


                                                    <ButtonWithIcon
                                                        icon={removeIcon}
                                                        action={async () => {
                                                            if (!course.hasOwnProperty("isNew")) {
                                                                await removeTutorCourseRelation(course.id_course, formData.uid);
                                                            }

                                                            const filtered = tutorCourses.filter(
                                                                item => item.id_course !== course.id_course
                                                            );

                                                            setTutorCourses(filtered);
                                                        }}
                                                    />
                                                </div>
                                            </label>

                                            <div className="relative">
                                                <input
                                                    type={"number"}
                                                    id={"course-name-" + idx}
                                                    name={"price_per_hour"}
                                                    value={course.price_per_hour}
                                                    onChange={(e) =>{
                                                        handleCourseDataChange(e, course.id_course)
                                                    }}
                                                    className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                            € / h
                                        </span>

                                            </div>
                                        </div>
                                        {/*
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
                                 */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="mt-5 border-b border-gray-900/10 pb-6">
                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                            <div className="sm:col-span-1">
                                <h5 className="mt-1 text-sm/6 text-gray-600" style={{color:"red"}}><b>{strings.danger_zone}</b></h5>
                                <p className="mt-1 text-sm/6 text-gray-600">
                                    {strings.danger_par1}
                                </p>
                                <div style={{display: 'flex', flexDirection:'row', alignContent:"center", alignSelf:'center'}}>
                                    <label className="relative inline-block w-20 h-8 cursor-pointer">
                                        <input
                                            name="is_banned"
                                            type="checkbox"
                                            className="peer sr-only"
                                            checked={formData.is_banned}
                                            onChange={handleSliderDataChange}
                                        />

                                        {/* background */}
                                        <div className="w-full h-full bg-gray-300 rounded-full transition-colors peer-checked:bg-red-500" />
                                        {/* pallino */}
                                        <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-200 peer-checked:translate-x-12">

                                            {/* X icon */}
                                            <svg
                                                className={`w-4 h-4 text-gray-600 ${formData.is_banned? "hidden" : "block"}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                            </svg>

                                            {/* Check icon */}
                                            <svg
                                                className={`w-4 h-4 text-green-600 ${formData.is_banned? "block" : "hidden"}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                            </svg>

                                        </div>
                                    </label>
                                    {banIsChanged && (
                                        <p className="text-sm/6 text-gray-600" style={{paddingLeft:20}}>
                                            {formData.is_banned ? strings.ban : strings.unban}
                                        </p>
                                    )}
                                </div>

                                <p className="text-sm/6 text-gray-600 pt-[10px]">
                                    {strings.danger_par2}
                                </p>

                            </div>
                        </div>
                    </div>


                </form>


                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900" onClick={() => setIsOpen(false)}>
                        {strings.del}

                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-[#9BCECF] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-[#8EC0C1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9BCECF]"
                        onClick={async () => {
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
                                        //console.log(s)
                                    }


                                    for (let c of tutorCourses) {
                                        // console.log(c)
                                        if (c.hasOwnProperty("isNew")) {
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

                                    if (banIsChanged) {
                                        if (formData.is_banned) {
                                            await tutor_ban(formData.uid)
                                        } else {
                                            await tutor_activation(formData.uid)
                                        }
                                    }

                                    // alert(strings.success)
                                    setIsOpen(false)
                                    setText(strings.success)
                                    setShowAlert(true)

                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 2000); // 2 secondi
                                }
                            }
                        }}
                    >
                        {strings.confirm}
                    </button>
                </div>

                {/*
                <div style={{display: 'flex', flexDirection:'row', justifyContent:'center', paddingBottom:20}}>
                    <h1  style={{textAlign: 'center', margin: 0, fontSize:30, color:'green'}}> {strings.title}</h1>
                    <div style={{position: 'absolute', right: '15px', top: '10px',}}>
                        <ButtonWithIcon action={() => setIsOpen(false)} icon={closeIcon} />
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}>{strings.name}: </h1>
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
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}>{strings.surname}: </h1>
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
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}>{strings.role}: </h1>
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
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}>{strings.lastActivity}: </h1>
                    <p className="main-font" style={{textAlign: 'center', margin: 0, fontSize:22}}> {formData.lastActivity}</p>
                </div>
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                <div style={{display: 'flex', flexDirection:'row', paddingBottom:20, paddingTop:30}}>
                    <h1  style={{textAlign: 'left', paddingLeft:10, margin: 0, fontSize:25, color:"green"}}> {strings.followed_students}</h1>
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

                <div style={{display: 'flex', flexDirection:'row', paddingBottom:20, paddingTop:30}}>
                    <h1  style={{textAlign: 'left', paddingLeft:10, margin: 0, fontSize:25, color:'green'}}> {strings.new_students}</h1>
                </div>

                <div style={{ position: 'relative', width: '100%', margin: '0 auto' }}>
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

                <div style={{display: 'flex', flexDirection:'row', paddingBottom:20, paddingTop:40}}>
                    <h1  style={{textAlign: 'left', paddingLeft:10, margin: 0, fontSize:25, color:'green'}}> {strings.followed_courses}</h1>
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
                */}
            </div>

        </div>
    );
}

export default TutorInfoPage;