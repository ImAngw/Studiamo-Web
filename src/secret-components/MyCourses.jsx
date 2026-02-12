import React from "react";
import { useTranslation } from 'react-i18next';



function MyCourses( { courseList }) {
    const { t } = useTranslation();
    const strings = t("MyCourses", { returnObjects: true });

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
                    maxWidth: '450px',
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
                        <th style={{fontSize: '16px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}> </th>
                        <th style={{fontSize: '16px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.course}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courseList && (courseList.map((course, index) => (
                        <tr key={course.id_course || index}>
                            <td className={'main-font'} style={{fontSize: '11px'}}>{index + 1}</td>
                            <td className={'main-font'} style={{fontSize: '11px'}}>{course.name}</td>
                        </tr>)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyCourses;