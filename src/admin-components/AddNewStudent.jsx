import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import closeIcon from "../assets/icons/close.png";
import {ButtonWithIcon} from "../components/CustomButtons";
import addUser from "../assets/icons/add-button.png";
import searchIcon from "../assets/icons/search.png";
import removeIcon from "../assets/icons/remove-user.png";
import {
    getTutorBySurname,
    addNewStudent,
    addTutorStudentRelation,
    addStudentCourseRelation,
    removeTutorStudentRelation, removeStudentCourseRelation, updateStudent, updateStudentCourseRelation
} from "../supabase/DBAdminFunctions";
import Dropdown from "react-bootstrap/Dropdown";
import {useAdminData} from "../provider/AppAdminContext";
import {ChevronDownIcon} from "@heroicons/react/16/solid";
import {FailAlert} from "../components/AlertComponents";




function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}



function AddNewStudent({setIsOpen, setShowAlert, setText}) {
    const { t } = useTranslation();
    const strings = t("addNewStudentPage", { returnObjects: true });
    const allowedSex = ["M", "F"]

    const {courses} = useAdminData()

    const [coursesToAdd, setCoursesToAdd] = useState([]);
    const [searchedCourseStr, setSearchedCourseStr] = useState('');
    const [searchedCourses, setSearchedCourse] = useState([]);

    const [showFail, setShowFail] = useState(false);



    const [tutorsToAdd, setTutorsToAdd] = useState([]);
    const [searchedStr, setSearchedStr] = useState('');
    const [searchedTutors, setSearchedTutors] = useState([]);

    const today = new Date();


    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        date: formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
        phone: "",
        sex: "M"
    });

    const [courseData, setCourseData] = useState([])


    const handleDataChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCourseDataChange = (event, id_course) => {
        const { name, value } = event.target;
        setCourseData(prev =>
            prev.map(item =>
                item.course_id === id_course
                    ? { ...item, [name]: value }
                    : item
            )
        );
    }


    const handleChange = (event) => {
        setSearchedStr(event.target.value);
    };


    const handleCourseChange = (event) => {
        setSearchedCourseStr(event.target.value);
        const filtered = courses.filter(c =>
            c.name.toLowerCase().includes(event.target.value.toLowerCase())
        );
        setSearchedCourse(filtered);

        if (event.target.value.trim() === '') {
            setSearchedCourse([]);
        }
    };


    useEffect(() => {
        const fetchTutorsBySurname = async () => {
            try {
                const tutorBySurname = await getTutorBySurname(searchedStr);

                let availableTutors = tutorBySurname.filter(
                    tutor => !tutorsToAdd.some(t => t.tutor_id === tutor.tutor_id)
                );

                setSearchedTutors(availableTutors);
            } catch (err) {
                console.error(err);
            }
        };

        if (searchedStr.trim() === '') {
            setSearchedTutors([]);
            return;
        }
        fetchTutorsBySurname();

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
            {showFail &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Sfondo semi-trasparente */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <FailAlert show={showFail} onClose={() => setShowFail(false)} text={strings.alert_msg}/>
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
                    maxHeight: "700px", // 👈 limita l’altezza
                    overflowY: "auto", // 👈 scroll solo dentro la "nuvoletta"
                }}
            >

                <form onSubmit={(e) => {e.preventDefault()}} id={"add-student-page"}>
                    <div className="space-y-10">
                        <div className="border-b border-gray-900/10 pb-1">
                            <h1 className="text-base/7 font-semibold text-gray-900" style={{fontSize:35}}>{strings.title} </h1>
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
                                        autoComplete={"name"}
                                        type="text"
                                        name={"name"}
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
                                        name={"surname"}
                                        value={formData.surname}
                                        onChange={handleDataChange}
                                        className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <label htmlFor="phone" className="block text-sm/6 font-medium text-gray-900">
                                        <b>{strings.phone}</b>
                                    </label>

                                    <div className="mt-2 grid grid-cols-1">
                                        <input
                                            id="phone"
                                            name={"phone"}
                                            autoComplete={"phone"}
                                            value={formData.phone}
                                            onChange={handleDataChange}
                                            className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                        />
                                    </div>
                                </div>



                                <div className="sm:col-span-1">
                                    <label htmlFor="sex" className="block text-sm/6 font-medium text-gray-900">
                                        <b>{strings.sex}</b>
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="sex"
                                            name="sex"
                                            onChange={(e) => {
                                                setFormData({...formData, sex: e.target.value})
                                            }}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            {allowedSex.map((sex, index) => (
                                                <option key={index} value={sex}>
                                                    {sex}
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
                        </div>
                    </div>


                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                            <div className="sm:col-span-1">
                                <h5 className="mt-5 text-sm/6 text-gray-600"><b>{strings.select_tutor}</b></h5>

                                <div className="grid grid-cols-1">
                                    <div style={{ position: 'relative', width: '100%', margin: '0 auto'}}>
                                        {/* search bar */}
                                        <input
                                            type="text"
                                            id={"tutor-searchbar"}
                                            value={searchedStr}
                                            onChange={handleChange}
                                            className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                            placeholder="Cerca studente per cognome..."
                                        />

                                        {/* dropdown con i risultati */}
                                        {searchedTutors.length > 0 && (
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
                                                {searchedTutors.map((tutor, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setTutorsToAdd([...tutorsToAdd, tutor]);
                                                            setSearchedTutors([]);
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
                                                        {tutor.tutor_surname} {tutor.tutor_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-1 text-sm/6 text-gray-600 pb-[20px]">
                                    {strings.par2}
                                </p>
                                {tutorsToAdd.map((tutor, idx) => (
                                    <div key={idx} style={{display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                                        <div>
                                            <p style={{ display: 'inline', margin: 0, alignContent:'center', paddingRight:10}}><b>{idx + 1}:</b></p>
                                            <p style={{ display: 'inline', margin: 0}}>{tutor.tutor_surname + " " + tutor.tutor_name}</p>
                                        </div>


                                        <ButtonWithIcon
                                            icon={removeIcon}
                                            action={() => {
                                                const availableTutors = tutorsToAdd.filter(
                                                    t => t.tutor_id !== tutor.tutor_id
                                                );
                                                setTutorsToAdd(availableTutors);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="border-b border-gray-900/10 pb-6">
                        <div className="mt-3 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-1">
                            <div className="sm:col-span-1">
                                <h5 className="mt-5 text-sm/6 text-gray-600"><b>{strings.select_course}</b></h5>

                                <div className="grid grid-cols-1">
                                    <div style={{ position: 'relative', width: '100%', margin: '0 auto'}}>
                                        {/* search bar */}
                                        <input
                                            type="text"
                                            id={"course-searchbar"}
                                            value={searchedCourseStr}
                                            onChange={handleCourseChange}
                                            className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                            placeholder="Cerca studente per cognome..."
                                        />

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
                                                width: '100%',
                                                overflowY: 'auto',
                                                margin: '0 auto'
                                            }}>
                                                {searchedCourses.map((course, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setCoursesToAdd(prev =>
                                                                prev.some(c => c.id_course === course.id_course)
                                                                    ? prev
                                                                    : [...prev, course]
                                                            );


                                                            setCourseData(prev => {
                                                                // se esiste già un elemento con lo stesso id, non aggiungere
                                                                if (prev.some(item => item.course_id === course.id_course)) {
                                                                    return prev; // restituisce la lista invariata
                                                                }

                                                                // altrimenti aggiungi il nuovo dizionario
                                                                return [
                                                                    ...prev,
                                                                    {
                                                                        course_id: course.id_course,
                                                                        price: "0",
                                                                        f_date: formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
                                                                        l_date: formatDate(today.getFullYear(), today.getMonth() + 1, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate())
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
                                {coursesToAdd.map((course, idx) => (
                                    <div key={idx} style={{paddingBottom: 65}}>
                                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                                            <div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                                <p style={{ margin: 0, paddingRight: 10 }}>
                                                    <b>{idx + 1}:</b>
                                                </p>

                                                <p style={{ margin: 0, fontSize: 15 }}>
                                                    {course.name}
                                                </p>
                                            </div>


                                            <ButtonWithIcon
                                                icon={removeIcon}
                                                action={async () => {
                                                    const availableCourses = coursesToAdd.filter(
                                                        c => c.id_course !== course.id_course
                                                    );
                                                    const filtered = courseData.filter(item => item.course_id !== course.id_course);
                                                    setCourseData(filtered);
                                                    setCoursesToAdd(availableCourses);
                                                }}
                                            />
                                        </div>

                                        <div className="mt-3 grid grid-cols-1 gap-x-1 sm:grid-cols-1">
                                            <label
                                                htmlFor={"course-name-" + idx}
                                                className="block text-sm font-medium text-gray-900 mb-1"
                                            >
                                                {strings.price}
                                            </label>

                                            <div className="relative">
                                                <input
                                                    id={"course-name-" + idx}
                                                    name={"price"}
                                                    value={courseData.find(c => c.course_id === course.id_course)?.price || ""}
                                                    onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                                    className="w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                                />

                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none">
                                            € / h
                                        </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                                            <div className="sm:col-span-1">
                                                <label
                                                    htmlFor={"course-first-" + idx}
                                                    className="block text-sm font-medium text-gray-900 mb-1"
                                                >
                                                    {strings.firstDay}
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        name={"f_date"}
                                                        value={courseData.find(c => c.course_id === course.id_course)?.f_date || ""}
                                                        onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                                        className="w-full rounded-md bg-white py-1.5  pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                                    />
                                                </div>
                                            </div>

                                            <div className="sm:col-span-1">
                                                <label
                                                    htmlFor={"course-last-" + idx}
                                                    className="block text-sm font-medium text-gray-900 mb-1"
                                                >
                                                    {strings.lastDay}
                                                </label>

                                                <div className="relative">
                                                    <input
                                                        id={"course-last-" + idx}
                                                        name={"l_date"}
                                                        value={courseData.find(c => c.course_id === course.id_course)?.l_date || ""}
                                                        onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                                        className="w-full rounded-md bg-white py-1.5  pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/*
                                <div style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:10}}>
                                    <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                                    <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{course.name}</p>
                                    <ButtonWithIcon
                                        icon={removeIcon}
                                        action={() => {
                                            const availableCourses = coursesToAdd.filter(
                                                c => c.id_course !== course.id_course
                                            );
                                            const filtered = courseData.filter(item => item.course_id !== course.id_course);
                                            setCourseData(filtered);
                                            setCoursesToAdd(availableCourses);
                                        }}
                                    />
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />

                                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.price}:</h1>
                                    <input
                                        name={"price"}
                                        value={courseData.find(c => c.course_id === course.id_course)?.price || ""}
                                        onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                        placeholder=" "
                                        className={'main-font'}
                                        style={{ width: '100px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                                    />
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />

                                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.firstDay}:</h1>
                                    <input
                                        name={"f_date"}
                                        value={courseData.find(c => c.course_id === course.id_course)?.f_date || ""}
                                        onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                        placeholder=" "
                                        className={'main-font'}
                                        style={{ width: '150px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                                    />
                                </div>
                                <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />

                                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.lastDay}:</h1>
                                    <input
                                        name={"l_date"}
                                        value={courseData.find(c => c.course_id === course.id_course)?.l_date || ""}
                                        onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                        placeholder=" "
                                        className={'main-font'}
                                        style={{ width: '150px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                                    />
                                </div>

                                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                                */}
                                    </div>
                                ))}
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
                        className="rounded-md bg-gradient-to-r from-[#9AD0EC] to-[#9BCECF] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:from-[#89C2E0] hover:to-[#8EC0C1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9BCECF]"
                        onClick={async () => {
                            const isNumber = (str) => {
                                const strin = String(str);
                                return !isNaN(strin) && strin.trim() !== "";
                            };

                            const isValidDateFormat = (str) => {
                                return /^\d{4}-\d{2}-\d{2}$/.test(str);
                            };

                            let newId = 0;
                            let errorStr = ""


                            if (formData.name === "" || formData.surname === "" || formData.date === "" || formData.phone === "") {
                                //alert(t(strings.alert_msg));
                                setShowFail(true);
                            } else {
                                if (courseData.length !== 0) {
                                    for (let c of courseData) {
                                        if (!isNumber(c.price)){
                                            errorStr += "- Il prezzo deve essere un numero.\n"
                                        }
                                        if (isValidDateFormat(c.f_date) && isValidDateFormat(c.l_date)){
                                            const date1 = new Date(c.f_date);
                                            const date2 = new Date(c.l_date);
                                            if (date1 > date2) {
                                                errorStr += "La data di inizio è più avanti nel tempo della data di fine.\n"
                                            }
                                        } else {
                                            errorStr += "- Le date devono essere nel formato AAAA-MM-GG.\n"
                                        }
                                    }
                                }

                                if (errorStr !== "") {
                                    alert(errorStr)
                                } else {
                                    newId = await addNewStudent(formData.sex, formData.name, formData.surname, formData.phone, formData.date);
                                    for (let t of tutorsToAdd) {
                                        await addTutorStudentRelation(newId, t.tutor_id)
                                    }

                                    for (let c of courseData) {
                                        await addStudentCourseRelation(
                                            c.course_id,
                                            newId,
                                            Number(c.price),
                                            c.f_date,
                                            c.l_date
                                        )
                                    }

                                    // alert(strings.success)
                                    setIsOpen(false);

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
                    <h1 style={{textAlign: 'center', margin: 0, color:"green", fontSize:30}}> {strings.title}</h1>
                    <div style={{position: 'absolute', right: '15px', top: '10px',}}>
                        <ButtonWithIcon action={() => setIsOpen(false)} icon={closeIcon} />
                    </div>
                </div>

                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}> {strings.name}:</h1>
                    <input
                        type="text"
                        name={"name"}
                        value={formData.name}
                        onChange={handleDataChange}
                        placeholder=" "
                        className={'main-font'}
                        style={{ width: '200px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 25}}
                    />
                </div>
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:10, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}> {strings.surname}:</h1>
                    <input
                        name={"surname"}
                        value={formData.surname}
                        onChange={handleDataChange}
                        placeholder=" "
                        className={'main-font'}
                        style={{ width: '200px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 25}}
                    />
                </div>
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}> {strings.phone}:</h1>
                    <input
                        name={"phone"}
                        value={formData.phone}
                        onChange={handleDataChange}
                        placeholder=" "
                        className={'main-font'}
                        style={{ width: '200px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 25}}
                    />
                </div>
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}> {strings.sex}:</h1>
                    <Dropdown>
                        <Dropdown.Toggle style={{
                            backgroundColor: 'transparent',  // nessun colore di sfondo
                            border: '1px solid black',     // bordo verde (o quello che vuoi)
                            color: 'black',                // testo verde per coerenza
                            boxShadow: 'none',                // rimuove l’ombra del focus
                            width:'50px',
                        }}>
                            <p style={{ display: 'inline', margin: 0, paddingRight:0 }}>{formData.sex}</p>

                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{
                            minWidth: '100px',   // larghezza minima
                            maxHeight: '200px',  // altezza massima
                            overflowY: 'auto',   // scroll se troppi elementi
                        }}>
                            {allowedSex.map((sex, index) => (
                                index === allowedSex.length - 1 ? (
                                    <Dropdown.Item
                                        key={index}
                                        onClick={() => {
                                            setFormData({...formData, sex: sex})
                                        }}
                                    >
                                        {sex}
                                    </Dropdown.Item>

                                ) : (
                                    <div key={index}>
                                        <Dropdown.Item onClick={() => {}}>{sex}</Dropdown.Item>
                                        <Dropdown.Divider />
                                    </div>
                                )
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                <h1 style={{textAlign: 'center', margin: 0, fontSize:25, paddingTop:40, color:"green"}}> {strings.select_tutor}</h1>

                <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingTop:20 }}>
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
                            placeholder="Cerca tutor per cognome..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '15px'
                            }}
                        />
                    </div>

                    {searchedTutors.length > 0 && (
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
                            {searchedTutors.map((tutor, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setTutorsToAdd([...tutorsToAdd, tutor]);
                                        setSearchedTutors([]);
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
                                    {tutor.tutor_surname} {tutor.tutor_name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {tutorsToAdd.map((tutor, idx) => (
                    <div key={idx} style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:30}}>
                        <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                        <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{tutor.tutor_surname + " " + tutor.tutor_name}</p>
                        <ButtonWithIcon
                            icon={removeIcon}
                            action={() => {
                                const availableTutors = tutorsToAdd.filter(
                                    t => t.tutor_id !== tutor.tutor_id
                                );
                                setTutorsToAdd(availableTutors);
                            }}
                        />
                    </div>
                ))}

                <h1 style={{textAlign: 'center', margin: 0, fontSize:25, paddingTop:50, color:"green"}}> {strings.select_course}</h1>
                <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingTop:20 }}>
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
                                        setCoursesToAdd(prev =>
                                            prev.some(c => c.id_course === course.id_course)
                                                ? prev
                                                : [...prev, course]
                                        );


                                        setCourseData(prev => {
                                            // se esiste già un elemento con lo stesso id, non aggiungere
                                            if (prev.some(item => item.course_id === course.id_course)) {
                                                return prev; // restituisce la lista invariata
                                            }

                                            // altrimenti aggiungi il nuovo dizionario
                                            return [
                                                ...prev,
                                                {
                                                    course_id: course.id_course,
                                                    price: "0",
                                                    f_date: formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate()),
                                                    l_date: formatDate(today.getFullYear(), today.getMonth() + 1, new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate())
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

                {coursesToAdd.map((course, idx) => (
                    <div style={{paddingTop:20}} key={idx}>
                        <div style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:10}}>
                            <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                            <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{course.name}</p>
                            <ButtonWithIcon
                                icon={removeIcon}
                                action={() => {
                                    const availableCourses = coursesToAdd.filter(
                                        c => c.id_course !== course.id_course
                                    );
                                    const filtered = courseData.filter(item => item.course_id !== course.id_course);
                                    setCourseData(filtered);
                                    setCoursesToAdd(availableCourses);
                                }}
                            />
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />

                        <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                            <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.price}:</h1>
                            <input
                                name={"price"}
                                value={courseData.find(c => c.course_id === course.id_course)?.price || ""}
                                onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                placeholder=" "
                                className={'main-font'}
                                style={{ width: '100px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                            />
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />

                        <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                            <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.firstDay}:</h1>
                            <input
                                name={"f_date"}
                                value={courseData.find(c => c.course_id === course.id_course)?.f_date || ""}
                                onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                placeholder=" "
                                className={'main-font'}
                                style={{ width: '150px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                            />
                        </div>
                        <hr style={{ border: 'none', borderTop: '1px solid black', paddingBottom: '2px 0', paddingTop: '2px 0' }} />

                        <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
                            <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:15}}> {strings.lastDay}:</h1>
                            <input
                                name={"l_date"}
                                value={courseData.find(c => c.course_id === course.id_course)?.l_date || ""}
                                onChange={(e) => handleCourseDataChange(e, course.id_course)}
                                placeholder=" "
                                className={'main-font'}
                                style={{ width: '150px', border: '0px solid black', borderRadius: '8px', padding: '5px', fontSize: 18}}
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '3px solid black', paddingBottom: '5px 0', paddingTop: '5px 0' }} />

                    </div>
                ))}

                <div style={{display: 'flex', flexDirection:'row', margin:'0 auto', justifyContent:'center', paddingTop:40}}>
                    <ButtonWithIcon
                        action={async () => {
                            const isNumber = (str) => {
                                const strin = String(str);
                                return !isNaN(strin) && strin.trim() !== "";
                            };

                            const isValidDateFormat = (str) => {
                                return /^\d{4}-\d{2}-\d{2}$/.test(str);
                            };

                            let newId = 0;
                            let errorStr = ""


                            if (formData.name === "" || formData.surname === "" || formData.date === "" || formData.phone === "") {
                                alert(t(strings.alert_msg));
                            } else {
                                if (courseData.length !== 0) {
                                    for (let c of courseData) {
                                        if (!isNumber(c.price)){
                                            errorStr += "- Il prezzo deve essere un numero.\n"
                                        }
                                        if (isValidDateFormat(c.f_date) && isValidDateFormat(c.l_date)){
                                            const date1 = new Date(c.f_date);
                                            const date2 = new Date(c.l_date);
                                            if (date1 > date2) {
                                                errorStr += "La data di inizio è più avanti nel tempo della data di fine.\n"
                                            }
                                        } else {
                                            errorStr += "- Le date devono essere nel formato AAAA-MM-GG.\n"
                                        }
                                    }
                                }

                                if (errorStr !== "") {
                                    alert(errorStr)
                                } else {
                                    newId = await addNewStudent(formData.sex, formData.name, formData.surname, formData.phone, formData.date);
                                    for (let t of tutorsToAdd) {
                                        await addTutorStudentRelation(newId, t.tutor_id)
                                    }

                                    for (let c of courseData) {
                                        await addStudentCourseRelation(
                                            c.course_id,
                                            newId,
                                            Number(c.price),
                                            c.f_date,
                                            c.l_date
                                        )
                                    }
                                    window.location.reload();
                                    alert(strings.success)
                                    setIsOpen(false);
                                }
                            }
                        }}
                        icon={addUser}
                    />
                </div>

                */}

            </div>
        </div>
    );
}


export default AddNewStudent;