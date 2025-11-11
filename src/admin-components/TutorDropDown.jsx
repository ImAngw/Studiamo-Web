import React, {useEffect, useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import {getTutorsOfStudent} from "../supabase/DBAdminFunctions";



function TutorsDropDown({studentId}) {
    const [allTutors, setAllTutors] = useState([]);
    useEffect(() => {
        const fetchTutors = async () => {
            try {
                const tutors = await getTutorsOfStudent(studentId);
                setAllTutors(tutors);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTutors();
    }, [studentId]);

    return (
        <Dropdown style={{width: '100px', height: '30px'}}>
            <Dropdown.Toggle
                style={{
                    backgroundColor: 'transparent',  // nessun colore di sfondo
                    border: 'transparent',     // bordo verde (o quello che vuoi)
                    color: 'black',                // testo verde per coerenza
                    boxShadow: 'none',                // rimuove l’ombra del focus
                    textAlign: 'left',           // 👈 allinea il testo a sinistra
                    display: 'flex',             // 👈 per controllare meglio layout interno
                    alignItems: 'center',
                    justifyContent: 'flex-start' //
                }}
            >
                <span className={'main-font'} style={{fontSize:15}}>Tutors</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {allTutors.length > 0 && allTutors.map((tutor, index) => (
                    index === allTutors.length - 1 ? (
                        <Dropdown.Item key={index}>
                            {tutor.tutor_name + " " +  tutor.tutor_surname}
                        </Dropdown.Item>

                    ) : (
                        <div key={index}>
                            <Dropdown.Item>
                                {tutor.tutor_name + " " +  tutor.tutor_surname}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </div>
                    )
                ))}

                <Dropdown.Divider />
            </Dropdown.Menu>
        </Dropdown>

    );
}

export default TutorsDropDown;