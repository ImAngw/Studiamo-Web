import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import wIcon from '../assets/icons/b-w-whatsapp.png'
import downloadIcon from '../assets/icons/download.png'
import {generateStudentReport, generateAllStudentReport} from "../pdf-functions/PdfGenerator";
import {getLessonsForStudents, uploadPDF} from "../supabase/DBAdminFunctions";



function StudentsTableCounts({activeStudents, firstData, lastData, allowedCounts, setStudOffset, totPages}) {
    const { t } = useTranslation();
    const strings = t("StudentTableCounts", { returnObjects: true });
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div>
            <div style={{paddingTop:10, display: 'flex', flexDirection:'row', alignItems:'center', gap:50}}>
                <h1 className={'title-font'}> {strings.active_students}</h1>
                <ButtonWithIcon
                    icon={downloadIcon}
                    action={async () => {
                        const users = activeStudents.map(student => {
                            return {
                                name: student.stud_name,
                                surname: student.stud_surname,
                                hours: student.total_hours,
                                minutes: student.total_minutes,
                                bill: student.total_cost
                            }
                        });
                        const pdfDoc = await generateAllStudentReport(users, firstData, lastData);
                        pdfDoc.download(`Resoconto Studenti dal ${firstData} al ${lastData}`)
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
                            <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.hours}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.minutes}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'70px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.bill} €</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'70px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>Invia</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'80px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>Download</th>

                        </tr>
                        </thead>
                        <tbody>
                        {activeStudents && (activeStudents.map((student, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_surname}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_name}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.total_hours}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.total_minutes}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.total_cost}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={wIcon}
                                            action={async () => {
                                                const win = window.open('', '_blank'); // apri subito la finestra
                                                try {
                                                    const user = { name: student.stud_name, surname: student.stud_surname, bill: student.total_cost };
                                                    const lessons = await getLessonsForStudents(student.stud_id, false, firstData, lastData);
                                                    const pdfDoc = await generateStudentReport(user, firstData, lastData, lessons);
                                                    const pdfURL = await uploadPDF(pdfDoc, `Resoconto ${student.stud_surname} ${student.stud_name} dal ${firstData} al ${lastData}`);

                                                    if (!pdfURL) throw new Error('Upload fallito');

                                                    const phone = student.telephone;
                                                    const message = `Studiamo APS\n\nEcco il resoconto delle lezioni di ${student.stud_surname} ${student.stud_name} relativo al periodo che va dal ${firstData} al ${lastData}.\n\nPuoi scaricare il tuo resoconto qui:\n\n ${pdfURL}`;
                                                    const encodedMessage = encodeURIComponent(message);
                                                    win.location.href = `https://wa.me/${phone}?text=${encodedMessage}`; // aggiorna la finestra aperta
                                                } catch (err) {
                                                    console.error(err);
                                                    win.close(); // chiudi se fallisce
                                                }
                                            }}
                                        />
                                    )}


                                </td>

                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={downloadIcon}
                                            action={async () => {
                                                const user = { name: student.stud_name, surname: student.stud_surname, bill: student.total_cost };
                                                const lessons = await getLessonsForStudents(student.stud_id, false, firstData, lastData);
                                                const pdfDoc = await generateStudentReport(user, firstData, lastData, lessons);
                                                pdfDoc.download(`Resoconto ${student.stud_surname} ${student.stud_name} dal ${firstData} al ${lastData}`)
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
                        setStudOffset(prevOffset => prevOffset - 1);
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
                        setStudOffset(prevOffset => prevOffset + 1);
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

export default StudentsTableCounts;