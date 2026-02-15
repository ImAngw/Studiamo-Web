import React from "react";
import {useTranslation} from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import wIcon from '../assets/icons/b-w-whatsapp.png'
import downloadIcon from '../assets/icons/download.png'
import {generateStudentCourseReport} from "../pdf-functions/PdfGenerator";
import {uploadPDF} from "../supabase/DBAdminFunctions";
import {useAdminData} from "../provider/AppAdminContext";
import folderIcon from '../assets/icons/empty-folder.png'




function CourseStudentsTableCounts({activeStudents, month, year, allowedCounts}) {
    const { t } = useTranslation();
    const strings = t("StudentTableCounts", { returnObjects: true });
    const monthStrings = t("Months", { returnObjects: true });
    const monthMap = {
        1: monthStrings.january,
        2: monthStrings.february,
        3: monthStrings.march,
        4: monthStrings.april,
        5: monthStrings.may,
        6: monthStrings.june,
        7: monthStrings.july,
        8: monthStrings.august,
        9: monthStrings.september,
        10: monthStrings.october,
        11: monthStrings.november,
        12: monthStrings.december
    }



    // const [currentPage, setCurrentPage] = useState(currPage);

    const {setCourseStudOffset, totalStudCoursePages, studCourseCurrentPage, setStudCourseCurrentPage} = useAdminData()

    return (
        <div>
            {/*
            <div style={{paddingTop:10, display: 'flex', flexDirection:'row', alignItems:'center', gap:50}}>
                <h1 className={'title-font'}> {strings.course_active_students}</h1>
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
                            <th className="w-8 px-2 py-3 text-left"> </th>
                            {/* <th className="w-56 px-2 py-3 text-sm table-fixed">{strings.surname}</th>*/}
                            <th className="w-56 px-2 py-3 text-sm table-fixed">{strings.name}</th>
                            <th className="w-32 px-2 py-3 text-sm table-fixed">{strings.bill}</th>
                            <th className="w-16 px-2 py-3 text-sm table-fixed"></th>
                            <th className="w-16 px-2 py-3 text-sm table-fixed"></th>

                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {activeStudents && (activeStudents.map((student, index) => (
                            <tr
                                key={index}
                                className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                            >
                                <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                                {/*<td className={'main-font'} style={{fontSize: '15px'}}>{student.s_name}</td>*/}
                                <td className="px-2 py-3" >{student.s_surname} {student.s_name}</td>
                                <td className="px-2 py-3" >{student.course_price} €</td>
                                <td className="px-2 py-3" >
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={wIcon}
                                            action={async () => {
                                                const win = window.open('', '_blank'); // apri subito la finestra
                                                try {
                                                    const user = { name: student.s_name, surname: student.s_surname, bill: student.course_price, c_name: student.course_name};
                                                    const pdfDoc = await generateStudentCourseReport(user, monthMap[month], year);
                                                    const pdfURL = await uploadPDF(pdfDoc, `Resoconto ${student.s_surname} ${student.s_name} del mese di ${monthMap[month]} ${year}`);

                                                    if (!pdfURL) throw new Error('Upload fallito');

                                                    const phone = student.s_phone;
                                                    const message = `Studiamo APS\n\nEcco il resoconto dei corsi di ${student.s_surname} ${student.s_name} del mese di ${monthMap[month]} ${year}.\n\nPuoi scaricare il tuo resoconto qui:\n\n ${pdfURL}`;
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

                                <td className="px-2 py-3" >
                                    {allowedCounts && (
                                        <ButtonWithIcon
                                            icon={downloadIcon}
                                            action={async () => {
                                                const user = { name: student.s_name, surname: student.s_surname, bill: student.course_price, c_name: student.course_name};
                                                const pdfDoc = await generateStudentCourseReport(user, monthMap[month], year);
                                                // pdfDoc.download(`Resoconto ${student.s_name} ${student.s_surname} del mese di ${monthMap[month]} ${year}`)
                                                pdfDoc.save(`Resoconto ${student.s_name} ${student.s_surname} del mese di ${monthMap[month]} ${year}`);
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