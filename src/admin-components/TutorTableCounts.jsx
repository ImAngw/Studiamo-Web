import React, {useState} from "react";
import { useTranslation } from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import downloadIcon from '../assets/icons/download.png'
import {generateAllTutorReport, generateTutorReport} from "../pdf-functions/PdfGenerator";
import {getLessonsForTutor, getFollowedStudentsAdmin} from "../supabase/DBAdminFunctions";



function TutorTableCounts({activeTutors, firstData, lastData, allowedCounts, setTutorOffset, totPages}) {
    const { t } = useTranslation();
    const strings = t("TutorTableCounts", { returnObjects: true });
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div>
            <div style={{paddingTop:10, display: 'flex', flexDirection:'row', alignItems:'center', gap:50}}>
                <h1 className={'title-font'} style={{paddingTop:10}}> {strings.active_tutors}</h1>
                <ButtonWithIcon
                    icon={downloadIcon}
                    action={async () => {
                        const users = activeTutors.map(tutor => {
                            return {
                                name: tutor.tutor_name,
                                surname: tutor.tutorn_surname,
                                hours: tutor.total_hours,
                                minutes: tutor.total_minutes,
                                gain: tutor.total_cost
                            }
                        });
                        const pdfDoc = await generateAllTutorReport(users, firstData, lastData);
                        pdfDoc.download(`Resoconto Tutor dal ${firstData} al ${lastData}`)
                    }}
                />
            </div>

            <div style={{padding:20}}>
                <div
                    style={{
                        height: '375px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px'
                    }}
                >
                    <table
                        className="table table-striped table-bordered table-hover"
                        style={{ tableLayout: 'fixed'}}
                    >
                        <thead>
                        <tr>
                            <th className={'title-font'} style={{fontSize: '20px', width:'20px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'110px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.surname}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'110px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'100px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.level}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.hours}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.minutes}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'70px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.gain} €</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'80px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>Download</th>

                        </tr>
                        </thead>
                        <tbody>
                        {activeTutors && (activeTutors.map((tutor, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.tutorn_surname}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.tutor_name}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.tutor_level}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.total_hours}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.total_minutes}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.total_cost}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={downloadIcon}
                                            action={async () => {
                                                let lessons = await getLessonsForTutor(tutor.t_id, false, firstData, lastData);
                                                const students = await getFollowedStudentsAdmin(tutor.t_id);

                                                const studNames = lessons.map(lesson => {
                                                    const studentAtLesson = lesson.student_list;
                                                    if (studentAtLesson.length > 1) return "Classe"

                                                    const singleStud = studentAtLesson[0];
                                                    for (const student of students) {
                                                        if (student.student_id === singleStud.student_id) {
                                                            return student.student_surname + " " + student.student_name
                                                        }
                                                    }
                                                    return "Studente non trovato"
                                                })

                                                const pdfDoc = await generateTutorReport(tutor.tutor_name, tutor.tutorn_surname, tutor.total_cost, lessons, studNames, firstData, lastData);
                                                pdfDoc.download(`Resoconto di ${tutor.tutorn_surname} ${tutor.tutor_name} dal ${firstData} al ${lastData}`)
                                            }}
                                        />
                                    )}

                                </td>
                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Controlli di paginazione */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <button
                    disabled={currentPage === 1}
                    onClick={() => {
                        setCurrentPage(currentPage - 1);
                        setTutorOffset(prevOffset => prevOffset - 1);
                    }}
                    style={{ borderRadius:10 }}
                >
                    ←
                </button>

                <span style={{ margin: '0 10px', fontSize:22 }} className={'main-font'}>
                        Pagina {currentPage} di {totPages}
                    </span>

                <button
                    disabled={currentPage === totPages}
                    onClick={() => {
                        setCurrentPage(currentPage + 1);
                        setTutorOffset(prevOffset => prevOffset + 1);
                    }}
                    style={{ borderRadius:10 }}
                >
                    →
                </button>
            </div>
            <div style={{padding:30}}/>

        </div>


    );
}

export default TutorTableCounts;
