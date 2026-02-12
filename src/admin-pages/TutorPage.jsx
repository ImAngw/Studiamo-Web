import React, {useEffect, useState} from "react";
import AdminHeader from "../admin-components/AdminHeader";
import {useAdminStudentsData} from "../provider/AppAdminContext";
import {ButtonWithIcon} from "../components/CustomButtons";
import settingsIcon from "../assets/icons/settings.png";
import {useTranslation} from "react-i18next";
import TutorInfoPage from "../admin-components/TutorInfoPage";
import searchIcon from "../assets/icons/search.png";
import {getTutorBySurname} from "../supabase/DBAdminFunctions";

import NewAdminHeader from "../admin-components/NewAdminHeader";
import TutorPageContent from "../admin-components/TutorPageContent";
import ScrollToTop from "../admin-components/ScrollToTop";





function AdminTutorPage() {

    /*

    const {allTutors, tutorTotalPages, currentTutorPage, setCurrentTutorPage, tutorOffset, setTutorOffset} = useAdminStudentsData()
    const { t } = useTranslation();
    const strings = t("AllTutorsTable", { returnObjects: true });
    const [isOpened, setIsOpened] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);

    const [searchedStr, setSearchedStr] = useState('');
    const [tutorToShow, setTutorToShow] = useState([]);


    const handleChange = (event) => {
        setSearchedStr(event.target.value);
    };



    useEffect(() => {
        const fetchTutorsBySurname = async () => {
            try {
                if (searchedStr.trim() === '') {
                    setTutorToShow(allTutors);
                    return;
                }

                const tutBySurn = await getTutorBySurname(searchedStr);
                const normList = tutBySurn.map(({ tutor_id, tutor_name, tutor_surname, tutor_role, lastdate }) => ({
                    uid: tutor_id,
                    name: tutor_name,
                    surname: tutor_surname,
                    role: tutor_role,
                    last_activity_date: lastdate
                }));

                setTutorToShow(normList);
            } catch (err) {
                console.error(err);
            }
        };

        // Evita di chiamare il DB se la lista base non è ancora pronta
        if (allTutors.length > 0 || searchedStr.trim() !== '') {
            fetchTutorsBySurname();
        }
    }, [searchedStr, allTutors]);

     */




    return (
        <div className="pt-[80px]">
            <ScrollToTop/>
            <NewAdminHeader/>
            <TutorPageContent/>
            {/*
            <AdminHeader
                name={"Tutors"}
                surname={""}
            />

            <div style={{paddingTop:10, display: 'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                <div style={{display: 'flex', flexDirection:'row', alignItems: 'center', gap:10, marginBottom:10}}>
                    <h1 className={'title-font'}> {strings.title}</h1>
                </div>


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
                        src={searchIcon}
                        alt="search"
                        style={{ width: '18px', height: '18px', marginRight: '6px', opacity: 0.6 }}
                    />
                    <input
                        type="text"
                        value={searchedStr}
                        onChange={handleChange}
                        placeholder="Cerca tutor per cognome..."
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '15px'
                        }}
                    />
                </div>


                <div style={{width:'90%', alignItems: 'center'}}>
                    <div
                        style={{
                            height: '580px',   // <- altezza fissa
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
                                <th className={'title-font'} style={{fontSize: '10px', width:'30px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                                <th className={'title-font'} style={{fontSize: '20px', width:'140px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.surname}</th>
                                <th className={'title-font'} style={{fontSize: '20px', width:'140px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                                <th className={'title-font'} style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{}</th>

                            </tr>
                            </thead>
                            <tbody>


                            {tutorToShow && (tutorToShow.map((tutor, index) => (
                                <tr key={index}>
                                    <td className={'main-font'} style={{fontSize: '12px'}}>{index + 1}</td>
                                    <td className={'main-font'} style={{fontSize: '12px'}}>{tutor.surname}</td>
                                    <td className={'main-font'} style={{fontSize: '12px'}}>{tutor.name}</td>

                                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                        <ButtonWithIcon
                                            action={() => {
                                                setIsOpened(true);
                                                setSelectedTutor(tutor);
                                            }}
                                            icon={settingsIcon}
                                        />

                                    </td>
                                </tr>)
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {isOpened && (
                        <TutorInfoPage
                            setIsOpen={setIsOpened}
                            tutor={selectedTutor}
                        />
                    )}


                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>

                        <button
                            disabled={currentTutorPage === 1}
                            onClick={() => {
                                setCurrentTutorPage(currentTutorPage - 1);
                                setTutorOffset(tutorOffset - 1);
                            }}
                            style={{ borderRadius:10 }}
                        >
                            ←
                        </button>

                        <span style={{ margin: '0 10px', fontSize:22 }} className={'main-font'}>
                        Pagina {currentTutorPage} di {tutorTotalPages}
                    </span>

                        <button
                            disabled={currentTutorPage === tutorTotalPages}
                            onClick={() => {
                                setCurrentTutorPage(currentTutorPage + 1);
                                setTutorOffset(tutorOffset + 1);
                            }}
                            style={{ borderRadius:10 }}
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>
            */}
        </div>
    );
}


export default AdminTutorPage;