import React from "react";
import { useTranslation } from 'react-i18next';



function MyStudents( { studentsList}) {
    const { t } = useTranslation();
    const strings = t("MyStudents", { returnObjects: true });

    return (
        <div style={{padding:20}}>
            <div>
                <h1 className={'title-font'} style={{fontSize:40}}>{strings.title}</h1>
            </div>

            <div
                style={{
                    height: '145px',   // <- altezza fissa
                    overflowY: 'auto',    // <- scroll verticale se troppe righe
                    border: '1px solid #ccc' // opzionale, per vedere il bordo
                }}
            >
                <table

                    className="table table-striped table-bordered table-hover"
                    style={{maxHeight: '140px'}}
                >
                    <thead>
                    <tr>
                        <th className={'title-font'} style={{fontSize: '25px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                        <th className={'title-font'} style={{fontSize: '25px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.surname}</th>
                        <th className={'title-font'} style={{fontSize: '25px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {studentsList && (studentsList.map((student, index) => (
                        <tr key={student.student_id || index}>
                            <td className={'main-font'} style={{fontSize: '18px'}}>{index + 1}</td>
                            <td className={'main-font'} style={{fontSize: '18px'}}>{student.student_surname}</td>
                            <td className={'main-font'} style={{fontSize: '18px'}}>{student.student_name}</td>
                        </tr>)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyStudents;