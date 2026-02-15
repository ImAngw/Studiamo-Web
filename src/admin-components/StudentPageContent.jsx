import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";

import addUserIcon from "../assets/icons/add-user.png";
import {useAdminStudentsData} from "../provider/AppAdminContext";
import {getStudBySurname} from "../supabase/DBAdminFunctions";
import {ButtonWithIcon} from "../components/CustomButtons";
import settingsIcon from "../assets/icons/settings.png";
import NewFooter from "../components/NewFooter";
import AddNewStudent from "./AddNewStudent";
import StudentInfoPage from "./StudentInfoPage";

import {SuccessAlert} from "../components/AlertComponents";
import folderIcon from "../assets/icons/empty-folder.png";







function StudentList({strings, setIsOpen, setSelectedStudent, studentsToShow, currentPage, setCurrentPage, studOffset, setStudOffset, totalPages}) {
    return (
        <div>
            <div>
                <div
                    style={{
                        height: '580px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px',

                        backgroundColor: 'white',

                        backgroundImage: studentsToShow.length === 0
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
                            {/*<th style={{fontSize: '14px', width:'130px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.name}</th>*/}
                            <th className="w-16 px-2 py-3 text-sm table-fixed"></th>
                            {/*<th style={{fontSize: '14px', width:'45px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}> ID </th>*/}

                        </tr>
                        </thead>


                        <tbody className="divide-y divide-gray-100">
                        {studentsToShow && (studentsToShow.map((student, index) => (
                            <tr
                                key={index}
                                className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                            >
                                <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                                <td className="px-2 py-3">{student.stud_surname} {student.stud_name}</td>
                                {/*<td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_name}</td>*/}
                                <td className="px-2 py-3">
                                    <ButtonWithIcon
                                        action={() => {
                                            setSelectedStudent(student);
                                            setIsOpen(true);
                                        }}
                                        icon={settingsIcon}
                                    />
                                </td>
                                {/*<td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_id}</td>*/}
                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>

                    <button
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                            setStudOffset(studOffset - 1);
                        }}
                        style={{ borderRadius:10 }}
                    >
                        ←
                    </button>

                    <span style={{ margin: '0 10px', fontSize:22 }} className={'main-font'}>
                        Pagina {currentPage} di {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage(currentPage + 1);
                            setStudOffset(studOffset + 1);
                        }}
                        style={{ borderRadius:10 }}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    )
}




export default function StudentPageContent() {
    const { t } = useTranslation();
    const strings = t("AllStudentsTable", { returnObjects: true });

    const [isOpen, setIsOpen] = useState(false);
    const [addStudentIsOpen, setAddStudentIsOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({});
    const [searchStud, setSearchStud] = useState('');

    const [searchedStudents, setSearchedStudents] = useState([]);
    const [studentsToShow, setStudentsToShow] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('');


    const handleChange = (event) => {
        setSearchStud(event.target.value);
    };


    const {totalPages, allStudents, studOffset, setStudOffset, currentPage, setCurrentPage} = useAdminStudentsData()



    useEffect(() => {
        const fetchStudentsBySurname = async () => {
            try {
                // Se la stringa è vuota, mostra direttamente tutti gli studenti (solo se li hai già)
                if (searchStud.trim() === '') {
                    setStudentsToShow(allStudents);
                    return;
                }

                // Altrimenti, filtra dal DB
                const studBySurn = await getStudBySurname(searchStud);
                setSearchedStudents(studBySurn);
                setStudentsToShow(studBySurn);
            } catch (err) {
                console.error(err);
            }
        };

        // Evita di chiamare il DB se la lista base non è ancora pronta
        if (allStudents.length > 0 || searchStud.trim() !== '') {
            fetchStudentsBySurname();
        }
    }, [searchStud, allStudents]);



    return (
        <div>
            {showAlert &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Sfondo semi-trasparente */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <SuccessAlert show={showAlert} onClose={() => setShowAlert(false)} text={textAlert}/>
                </div>
            }

            <div className="relative isolate overflow-hidden bg-white px-6 py-12 sm:py-24 lg:overflow-visible lg:px-0">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <svg
                        aria-hidden="true"
                        className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200"
                    >
                        <defs>
                            <pattern
                                x="50%"
                                y={-1}
                                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                                width={200}
                                height={200}
                                patternUnits="userSpaceOnUse"
                            >
                                <path d="M100 200V.5M.5 .5H200" fill="none"/>
                            </pattern>
                        </defs>
                        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                            <path
                                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                                strokeWidth={0}
                            />
                        </svg>
                        <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%"
                              strokeWidth={0}/>
                    </svg>
                </div>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="lg:max-w-lg">
                                <div className="flex gap-14">
                                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                        {strings.title}
                                    </h1>

                                    <ButtonWithIcon
                                        action={() => {setAddStudentIsOpen(true);}}
                                        icon={addUserIcon}
                                    />
                                </div>
                                <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg" style={{paddingBottom: 30}}>
                                    <p>
                                        {strings.par}
                                    </p>


                                    <div className="sm:col-span-1">
                                        <div className="mt-2 grid grid-cols-1">
                                            <input
                                                type="text"
                                                value={searchStud}
                                                id="searchStud"
                                                onChange={handleChange}
                                                placeholder="Cerca studente per cognome..."
                                                className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                                style={{
                                                    border: 'none',
                                                    width: '100%',
                                                    fontSize: '16px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="-mt-12 lg:p-14 lg:-ml-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
                    >
                        <StudentList
                            strings={strings}
                            setIsOpen={setIsOpen}
                            setSelectedStudent={setSelectedStudent}
                            studentsToShow={studentsToShow}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            studOffset={studOffset}
                            setStudOffset={setStudOffset}
                            totalPages={totalPages}
                        />

                    </div>
                </div>
            </div>

            {addStudentIsOpen && (
                <AddNewStudent
                    setIsOpen={setAddStudentIsOpen}
                    setShowAlert={setShowAlert}
                    setText={setTextAlert}
                />
            )}

            {isOpen && (
                <StudentInfoPage
                    setIsOpen={setIsOpen}
                    student={selectedStudent}
                    setText={setTextAlert}
                    setShowAlert={setShowAlert}
                />
            )}

            <NewFooter/>

        </div>

    )
}