import React from "react";
import { useTranslation } from 'react-i18next';



function MyStudents( { studentsList}) {
    const { t } = useTranslation();
    const strings = t("MyStudents", { returnObjects: true });


    return (
        <div>
            {/*
            <div>
                <h1 className={'title-font'} style={{fontSize:40}}>{strings.title}</h1>
            </div>
            */}

            <div
                style={{
                    height: '270px',   // <- altezza fissa
                    overflowY: 'auto',    // <- scroll verticale se troppe righe
                    border: '1px solid #ccc', // opzionale, per vedere il bordo
                    backgroundColor: 'white'
                }}
            >
                <table
                    className="table table-striped table-bordered table-hover"
                    style={{maxHeight: '140px'}}
                >
                    <thead>
                    <tr>
                        <th  style={{fontSize: '16px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}> </th>
                        <th  style={{fontSize: '16px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.surname}</th>
                        <th  style={{fontSize: '16px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.name}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {studentsList && (studentsList.map((student, index) => (
                        <tr key={student.student_id || index} style={{height: '25px'}}>
                            <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                            <td className={'main-font'} style={{fontSize: '15px'}}>{student.student_surname}</td>
                            <td className={'main-font'} style={{fontSize: '15px'}}>{student.student_name}</td>
                        </tr>)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyStudents;