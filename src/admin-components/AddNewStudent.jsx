import React, {useEffect, useState} from "react";
import { useTranslation } from 'react-i18next';
import closeIcon from "../assets/icons/close.png";
import {ButtonWithIcon} from "../components/CustomButtons";
import addUser from "../assets/icons/add-button.png";
import searchIcon from "../assets/icons/search.png";
import removeIcon from "../assets/icons/remove-user.png";
import {getTutorBySurname, addNewStudent, addTutorStudentRelation, addStudentCourseRelation} from "../supabase/DBAdminFunctions";
import Dropdown from "react-bootstrap/Dropdown";
import {useAdminData} from "../provider/AppAdminContext";




function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}



function AddNewStudent({setIsOpen}) {
    const { t } = useTranslation();
    const strings = t("addNewStudentPage", { returnObjects: true });
    const allowedSex = ["M", "F"]

    const {courses} = useAdminData()

    const [coursesToAdd, setCoursesToAdd] = useState([]);
    const [searchedCourseStr, setSearchedCourseStr] = useState('');
    const [searchedCourses, setSearchedCourse] = useState([]);



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

                <h1 className="title-font" style={{textAlign: 'center', margin: 0, fontSize:25, paddingTop:40}}> {strings.select_tutor}</h1>
                <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingTop:20 }}>
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
                            placeholder="Cerca tutor per cognome..."
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                fontSize: '15px'
                            }}
                        />
                    </div>

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

                <h1 className="title-font" style={{textAlign: 'center', margin: 0, fontSize:25, paddingTop:50}}> {strings.select_course}</h1>
                <div style={{ position: 'relative', width: '100%', margin: '0 auto', paddingTop:20 }}>
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
            </div>
        </div>
    );
}


export default AddNewStudent;