import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';




function getStudentName(student_dict, studentsList) {
    for (const s of studentsList ?? []) {
        if (s.student_id === student_dict.student_id) {
            return s.student_name + " " + s.student_surname;
        }
    }
}

function StudentsDropDown({students, studentsList}) {
    const { t } = useTranslation();
    const strings = t("StudentsDropDown", { returnObjects: true });

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
                <span className={'main-font'} style={{fontSize:15}}>{strings.in_class}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {students && studentsList?.length > 0 && students.map((stud_idx, index) => (
                    index === students.length - 1 ? (
                        <Dropdown.Item key={index}>
                            {getStudentName(stud_idx, studentsList)}
                        </Dropdown.Item>

                    ) : (
                        <div key={index}>
                            <Dropdown.Item>
                                {getStudentName(stud_idx, studentsList)}
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </div>
                    )
                ))}
            </Dropdown.Menu>
        </Dropdown>

    );
}

export default StudentsDropDown;