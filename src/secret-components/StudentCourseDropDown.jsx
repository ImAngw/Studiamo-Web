import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';




function StudentCourseDropDown({ studentsList }) {
    const { t } = useTranslation();
    const strings = t("StudentsDropDown", { returnObjects: true });

    return (
        <Dropdown style={{width: '100%', height: '30px'}}>
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
                {/*<span className={'main-font'} style={{fontSize:12}}>{strings.in_class}</span>*/}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {studentsList.map((student, index) => (
                    index === studentsList.length - 1 ? (
                        <Dropdown.Item key={index}>
                            {student.surname + " " + student.name}
                        </Dropdown.Item>

                    ) : (
                        <div key={index}>
                            <Dropdown.Item>
                                {student.surname + " " + student.name}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </div>
                    )
                ))}
            </Dropdown.Menu>
        </Dropdown>

    );
}

export default StudentCourseDropDown;