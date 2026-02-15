import React from "react";
import { useTranslation } from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import downloadIcon from '../assets/icons/download.png'
import {generateTutorReport} from "../pdf-functions/PdfGenerator";
import {getLessonsForTutor, getFollowedStudentsAdmin, getCourseLessonsForTutor} from "../supabase/DBAdminFunctions";
import folderIcon from "../assets/icons/empty-folder.png";



function TutorTableCounts({activeTutors, firstData, lastData, allowedCounts, setTutorOffset, totPages, currentPage, setCurrentPage}) {
    const { t } = useTranslation();
    const strings = t("TutorTableCounts", { returnObjects: true });

    return (
        <div>
            {/*
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
            */}

            <div>
                <div
                    style={{
                        height: '590px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px',
                        backgroundColor: 'white',

                        backgroundImage: activeTutors.length === 0
                            ? `url(${folderIcon})`
                            : 'none',
                        backgroundSize: '240px',        // copre tutto il div
                        backgroundPosition: 'center',   // centrata
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <table className="w-full text-sm table-fixed">
                        <thead className="sticky top-0 w-full bg-[#E9E1CD] z-10 text-xs uppercase tracking-wide text-gray-700">
                        <tr>
                            <th className="w-8 px-2 py-3 text-left"> </th>
                            <th className="w-56 px-2 py-3 text-sm table-fixed">{strings.name}</th>
                            <th className="w-32 px-2 py-3 text-sm table-fixed">{strings.gain}</th>
                            {/*
                            <th style={{fontSize: '14px', width:'100px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.level}</th>

                            <th style={{fontSize: '14px', width:'70px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.minutes}</th>
                            <th style={{fontSize: '14px', width:'70px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.c_minutes}</th>
                            */}
                            <th className="w-32 px-2 py-3 text-sm table-fixed">{strings.hours}</th>
                            <th className="w-32 px-2 py-3 text-sm table-fixed">{strings.course_hours}</th>
                            <th className="w-16 px-2 py-3 text-sm table-fixed"></th>

                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {activeTutors && (activeTutors.map((tutor, index) => (
                            <tr
                                key={index}
                                className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                            >
                                <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                                <td className="px-2 py-3">{tutor.tutorn_surname} {tutor.tutor_name}</td>
                                <td className="px-2 py-3">{tutor.total_cost} €</td>
                                {/*
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.tutor_name}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.tutor_level}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.total_minutes}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{tutor.total_course_minutes}</td>
                                */}
                                <td className="px-2 py-3">{tutor.total_hours}h : {tutor.total_minutes} m</td>
                                <td className="px-2 py-3">{tutor.total_course_hours} h : {tutor.total_course_minutes} m </td>
                                <td className="px-2 py-3">
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={downloadIcon}
                                            action={async () => {
                                                let lessons = await getLessonsForTutor(tutor.t_id, false, firstData, lastData);
                                                const students = await getFollowedStudentsAdmin(tutor.t_id);

                                                let courseLessons = await getCourseLessonsForTutor(tutor.t_id, firstData, lastData);

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

                                                const pdfDoc = await generateTutorReport(tutor.tutor_name, tutor.tutorn_surname, tutor.total_cost, lessons, courseLessons, studNames, firstData, lastData);
                                                //pdfDoc.download(`Resoconto di ${tutor.tutorn_surname} ${tutor.tutor_name} dal ${firstData} al ${lastData}`)
                                                pdfDoc.save(`Resoconto di ${tutor.tutorn_surname} ${tutor.tutor_name} dal ${firstData} al ${lastData}`)
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
