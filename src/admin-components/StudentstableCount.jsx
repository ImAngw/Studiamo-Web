import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import wIcon from '../assets/icons/b-w-whatsapp.png'
import downloadIcon from '../assets/icons/download.png'
import {generateStudentReport} from "../pdf-functions/PdfGenerator";
import {getLessonsForStudents, uploadPDF} from "../supabase/DBAdminFunctions";
import folderIcon from "../assets/icons/empty-folder.png";



function StudentsTableCounts({activeStudents, firstData, lastData, allowedCounts, setStudOffset, totPages, currentPage, setCurrentPage}) {
    const { t } = useTranslation();
    const strings = t("StudentTableCounts", { returnObjects: true });
    // const [currentPage, setCurrentPage] = useState(currPage);

    return (
        <div>
            {/*
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
            */}


            <div>
                <div
                    style={{
                        height: '590px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        backgroundImage: activeStudents.length === 0
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
                            <th  className="w-8 px-2 py-3 text-left"> </th>
                            <th  className="w-56 px-2 py-3 text-sm table-fixed">{strings.name}</th>
                            {/*
                            <th className="w-56 text-sm table-fixed">{strings.surname}</th>
                            <th className="w-56 text-sm table-fixed">{strings.minutes}</th>
                            */}
                            <th  className="w-32 px-2 py-3 text-sm table-fixed">{strings.bill}</th>
                            <th  className="w-32 px-2 py-3 text-sm table-fixed">{strings.hours}</th>

                            <th  className="w-16 px-2 py-3 text-sm table-fixed"></th>
                            <th  className="w-16 px-2 py-3 text-sm table-fixed"></th>

                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {activeStudents && (activeStudents.map((student, index) => (
                            <tr
                                key={index}
                                className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                            >
                                <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                                <td className="px-2 py-3">{student.stud_surname} {student.stud_name}</td>
                                {/*
                                <td className="px-2 py-3">{student.stud_name}</td>
                                <td className="px-2 py-3">{student.total_minutes}</td>
                                */}
                                <td className="px-2 py-3">{student.total_cost} €</td>
                                <td className="px-2 py-3">{student.total_hours}h : {student.total_minutes}m</td>

                                <td className="px-2 py-3">
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

                                <td className="px-2 py-3">
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={downloadIcon}
                                            action={async () => {
                                                const user = { name: student.stud_name, surname: student.stud_surname, bill: student.total_cost };
                                                const lessons = await getLessonsForStudents(student.stud_id, false, firstData, lastData);
                                                const pdfDoc = await generateStudentReport(user, firstData, lastData, lessons);
                                                // pdfDoc.download(`Resoconto ${student.stud_surname} ${student.stud_name} dal ${firstData} al ${lastData}`)
                                                pdfDoc.save(`Resoconto ${student.stud_surname} ${student.stud_name} dal ${firstData} al ${lastData}`);
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