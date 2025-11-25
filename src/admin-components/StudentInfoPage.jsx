import React, {useEffect, useState} from "react";
import {ButtonWithIcon} from "../components/CustomButtons";
import closeIcon from "../assets/icons/close.png";
import confirmIcon from "../assets/icons/confirm.png";
import removeIcon from "../assets/icons/remove-user.png";
import searchIcon from "../assets/icons/search.png";
import { useTranslation } from 'react-i18next';
import {getTutorBySurname, getTutorsOfStudent, updateStudent, addTutorStudentRelation, removeTutorStudentRelation} from "../supabase/DBAdminFunctions";





function StudentInfoPage({setIsOpen, student}) {
    const { t } = useTranslation();
    const strings = t("studentInfoPage", { returnObjects: true });

    const [allTutors, setAllTutors] = useState([]);
    const [searchedStr, setSearchedStr] = useState('');
    const [searchedTutors, setSearchedTutors] = useState([]);
    const [tutorsToAdd, setTutorsToAdd] = useState([]);

    const [pushButton, setPushButton] = useState(false);


    const [formData, setFormData] = useState({
        name: student.stud_name,
        surname: student.stud_surname,
        date: student.stud_date,
        phone: student.telephone
    });



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


    useEffect(() => {
        const fetchTutorsBySurname = async () => {
            try {
                const tutorBySurname = await getTutorBySurname(searchedStr);
                let availableTutors = tutorBySurname.filter(
                    tutor => !allTutors.some(t => t.tutor_id === tutor.tutor_id)
                );

                availableTutors = availableTutors.filter(
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



    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const tutors = await getTutorsOfStudent(student.stud_id);
                setAllTutors(tutors);

            } catch (err) {
                console.error(err);
            }
        };
        fetchTutors();
    }, [pushButton]);

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


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:30, alignItems:'center'}}>
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
                    <h1 className="main-font" style={{textAlign: 'center', margin: 0, fontSize:25}}> {strings.data}:</h1>
                    <input
                        name={"date"}
                        value={formData.date}
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


                <div style={{display: 'flex', flexDirection:'row', justifyContent:'flex-start', gap:70, alignItems:'center', paddingTop:30, paddingBottom:10}}>
                    <h1 className="title-font" style={{textAlign: 'left', margin: 0, fontSize:25, alignItems:'center'}}> {strings.followed_by}</h1>
                </div>



                {allTutors.map((tutor, idx) => (
                    <div key={idx} style={{display: 'flex', flexDirection:'row', paddingTop:10, justifyContent:'space-between'}}>
                        <div>
                            <p style={{ display: 'inline', margin: 0, alignContent:'center'}} className={'main-font'}><b>{idx + 1}:</b></p>
                            <p style={{ display: 'inline', margin: 0, paddingRight: 20}} className={"main-font"}>{tutor.tutor_surname + " " + tutor.tutor_name }</p>
                        </div>
                        <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', paddingRight:40}}>
                            <ButtonWithIcon
                                icon={removeIcon}
                                action={async () => {
                                    await removeTutorStudentRelation(student.stud_id, tutor.tutor_id);
                                    setPushButton(!pushButton);
                                }}
                            />
                        </div>
                    </div>
                ))}

                <h1 className="title-font" style={{textAlign: 'left', margin: 0, fontSize:25, alignItems:'center', paddingTop:30, paddingBottom:10}}> {strings.new_tutors}</h1>
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
                    <div key={idx} style={{display: 'flex', flexDirection:'row', alignItems:'center', paddingTop:10}}>
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

                <div style={{display: 'flex', justifyContent:'center', paddingTop:30, paddingBottom:10}}>
                    <ButtonWithIcon
                        icon={confirmIcon}
                        action={async () => {
                            if (formData.name === "" || formData.surname === "" || formData.date === "" || formData.phone === "") {
                                alert(t(strings.alert_msg));
                            } else{
                                await updateStudent(student.stud_id, formData.name, formData.surname, formData.date, formData.phone);
                                for (let t of tutorsToAdd) {
                                    await addTutorStudentRelation(student.stud_id, t.tutor_id)
                                }

                                alert(strings.success)
                                setIsOpen(false)
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default StudentInfoPage;