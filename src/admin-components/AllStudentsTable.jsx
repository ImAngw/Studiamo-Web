import React, {useEffect, useState} from "react";
import {useTranslation} from 'react-i18next';
import {ButtonWithIcon} from "../components/CustomButtons";
import settingsIcon from "../assets/icons/settings.png";
import addUserIcon from "../assets/icons/add-user.png";
import {getAllStudInDB, getStudentsCount, getStudBySurname} from "../supabase/DBAdminFunctions";
import StudentInfoPage from "./StudentInfoPage";
import AddNewStudent from "./AddNewStudent";





function AllStudentsTable() {
    const { t } = useTranslation();
    const strings = t("AllStudentsTable", { returnObjects: true });

    const [allStudents, setAllStudents] = useState([]);
    const [studentCount, setStudentCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const [addStudentIsOpen, setAddStudentIsOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState({});
    const [searchStud, setSearchStud] = useState('');



    const [searchedStudents, setSearchedStudents] = useState([]);
    const [studentsToShow, setStudentsToShow] = useState([]);
    const [myOffset, setMyOffset] = useState(0);


    const studentsPerPage = 20;
    const totalPages = Math.ceil(studentCount / studentsPerPage);

    const handleChange = (event) => {
        setSearchStud(event.target.value);
    };


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const students = await getAllStudInDB(myOffset * studentsPerPage);
                setAllStudents(students);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudents();

        const fetchStudentCount = async () => {
            try {
                const count = await getStudentsCount();
                setStudentCount(count);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudentCount();
    }, [currentPage]);


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
            <div style={{paddingTop:10, display: 'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                <div style={{display: 'flex', flexDirection:'row', alignItems: 'center', gap:10, marginBottom:10}}>
                    <h1 className={'title-font'}> {strings.title}</h1>
                    <ButtonWithIcon
                        action={() => {setAddStudentIsOpen(true);}}
                        icon={addUserIcon}
                    />
                </div>


                {addStudentIsOpen && (
                    <AddNewStudent setIsOpen={setAddStudentIsOpen}/>
                )}


                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    width: '300px',
                    backgroundColor: '#fff'
                }}>
                    <img
                        src={"src/assets/icons/search.png"}
                        alt="search"
                        style={{ width: '18px', height: '18px', marginRight: '6px', opacity: 0.6 }}
                    />
                    <input
                        type="text"
                        value={searchStud}
                        onChange={handleChange}
                        placeholder="Cerca studente per cognome..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '15px'
                        }}
                    />
                </div>
            </div>


            <div style={{padding:20}}>
                <div
                    style={{
                        height: '505px',   // <- altezza fissa
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
                            <th className={'title-font'} style={{fontSize: '20px', width:'180px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.surname}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'180px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'45px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> ID </th>
                            <th className={'title-font'} style={{fontSize: '20px', width:'80px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}></th>

                        </tr>
                        </thead>
                        <tbody>


                        {studentsToShow && (studentsToShow.map((student, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_surname}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_name}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{student.stud_id}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <ButtonWithIcon
                                        action={() => {
                                            setSelectedStudent(student);
                                            setIsOpen(true);
                                        }}
                                        icon={settingsIcon}
                                    />

                                </td>
                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>

                {isOpen && (
                    <StudentInfoPage
                        setIsOpen={setIsOpen}
                        student={selectedStudent}
                    />
                )}


                {/* Controlli di paginazione */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>

                    <button
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(currentPage - 1);
                            setMyOffset(myOffset - 1);
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
                            setMyOffset(myOffset + 1);
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

export default AllStudentsTable;