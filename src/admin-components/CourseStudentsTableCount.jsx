import React from "react";
import {useTranslation} from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import wIcon from '../assets/icons/b-w-whatsapp.png'
import downloadIcon from '../assets/icons/download.png'
import {generateStudentCourseReport} from "../pdf-functions/PdfGenerator";
import {uploadPDF} from "../supabase/DBAdminFunctions";
import {useAdminData} from "../provider/AppAdminContext";



function CourseStudentsTableCounts({activeStudents, month, year, allowedCounts}) {
    const { t } = useTranslation();
    const strings = t("StudentTableCounts", { returnObjects: true });
    // const [currentPage, setCurrentPage] = useState(currPage);

    const {setCourseStudOffset, totalStudCoursePages, studCourseCurrentPage, setStudCourseCurrentPage} = useAdminData()

    return (
        <div>
            <div style={{paddingTop:10, display: 'flex', flexDirection:'row', alignItems:'center', gap:50}}>
                <h1 className={'title-font'}> {strings.course_active_students}</h1>
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
                            <th className={'title-font'} style={{fontSize: '10px', width:'40px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'110px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.surname}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'110px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'70px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.bill} €</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'70px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>Invia</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'80px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>Download</th>

                        </tr>
                        </thead>
                        <tbody>
                        {activeStudents && (activeStudents.map((student, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.s_surname}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.s_name}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.course_price}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={wIcon}
                                            action={async () => {
                                                const win = window.open('', '_blank'); // apri subito la finestra
                                                try {
                                                    const user = { name: student.s_name, surname: student.s_surname, bill: student.course_price, c_name: student.course_name};
                                                    const pdfDoc = await generateStudentCourseReport(user, month, year);
                                                    const pdfURL = await uploadPDF(pdfDoc, `Resoconto ${student.s_surname} ${student.s_name} del ${month}_${year}`);

                                                    if (!pdfURL) throw new Error('Upload fallito');

                                                    const phone = student.s_phone;
                                                    const message = `Studiamo APS\n\nEcco il resoconto dei corsi di ${student.s_surname} ${student.s_name} del ${month}/${year}.\n\nPuoi scaricare il tuo resoconto qui:\n\n ${pdfURL}`;
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
                                                const user = { name: student.s_name, surname: student.s_surname, bill: student.course_price, c_name: student.course_name};
                                                const pdfDoc = await generateStudentCourseReport(user, month, year);
                                                pdfDoc.download(`Resoconto ${student.s_name} ${student.s_surname} del ${month}_${year}`)
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
                    disabled={studCourseCurrentPage === 1}
                    onClick={() => {
                        setStudCourseCurrentPage(studCourseCurrentPage - 1);
                        setCourseStudOffset(prevOffset => prevOffset - 1);
                    }}
                    style={{ borderRadius:10 }}
                >
                    ←
                </button>

                <span style={{ margin: '0 10px', fontSize:22 }} className={'main-font'}>
                        Pagina {studCourseCurrentPage} di {totalStudCoursePages}
                    </span>

                <button
                    disabled={studCourseCurrentPage === totalStudCoursePages}
                    onClick={() => {
                        setStudCourseCurrentPage(studCourseCurrentPage + 1);
                        setCourseStudOffset(prevOffset => prevOffset + 1);
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

export default CourseStudentsTableCounts;