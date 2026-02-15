import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import searchIcon from "../assets/icons/search.png";
import {useAdminStudentsData} from "../provider/AppAdminContext";
import {getTutorBySurname} from "../supabase/DBAdminFunctions";
import {ButtonWithIcon} from "../components/CustomButtons";
import settingsIcon from "../assets/icons/settings.png";
import TutorInfoPage from "./TutorInfoPage";
import NewFooter from "../components/NewFooter";
import {SuccessAlert} from "../components/AlertComponents";
import folderIcon from "../assets/icons/empty-folder.png";






function TutorList({strings, tutorToShow, setIsOpened, setSelectedTutor, currentTutorPage, setCurrentTutorPage, tutorTotalPages, tutorOffset, setTutorOffset}) {
    return (
        <div>
            <div style={{alignItems: 'center'}}>
                <div
                    style={{
                        height: '580px',   // <- altezza fissa
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px',
                        backgroundColor: 'white',

                        backgroundImage: tutorToShow.length === 0
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
                            {/*<th style={{fontSize: '14px', width:'130px', position: 'sticky', top: 0, background: '#E9E1CD', zIndex: 1}}>{strings.name}</th>*/}
                            <th className="w-56 px-2 py-3 text-sm table-fixed">{strings.surname} {strings.name}</th>
                            <th className="w-16 px-2 py-3 text-sm table-fixed"></th>

                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {tutorToShow && (tutorToShow.map((tutor, index) => (
                            <tr
                                key={index}
                                className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                            >
                                <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                                {/*<td className={'main-font'} style={{fontSize: '15px'}}>{tutor.name}</td>*/}
                                <td className="px-2 py-3">{tutor.surname} {tutor.name}</td>
                                <td className="px-2 py-3">
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




                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10  }}>

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
    )
}




export default function TutorPageContent() {
    const {allTutors, tutorTotalPages, currentTutorPage, setCurrentTutorPage, tutorOffset, setTutorOffset} = useAdminStudentsData()
    const { t } = useTranslation();
    const strings = t("AllTutorsTable", { returnObjects: true });
    const [isOpened, setIsOpened] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState(null);

    const [searchedStr, setSearchedStr] = useState('');
    const [tutorToShow, setTutorToShow] = useState([]);

    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState('');

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

                const normList = tutBySurn.map(({ tutor_id, tutor_name, tutor_surname, tutor_role, lastdate, ban_condition }) => ({
                    uid: tutor_id,
                    name: tutor_name,
                    surname: tutor_surname,
                    role: tutor_role,
                    last_activity_date: lastdate,
                    ban_situation: ban_condition
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
                                </div>
                                <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg" style={{paddingBottom: 30}}>
                                    <p>
                                        {strings.par}
                                    </p>

                                    <div className="sm:col-span-1">
                                        <div className="mt-2 grid grid-cols-1">
                                            <input
                                                type="text"
                                                value={searchedStr}
                                                id="search"
                                                onChange={handleChange}
                                                className="col-start-1 row-start-1 w-full rounded-md bg-white py-1.5 pr-3 pl-3 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                                                placeholder="Cerca tutor per cognome..."
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
                        <TutorList
                            strings={strings}
                            tutorToShow={tutorToShow}
                            setIsOpened={setIsOpened}
                            setSelectedTutor={setSelectedTutor}
                            currentTutorPage={currentTutorPage}
                            setCurrentTutorPage={setCurrentTutorPage}
                            tutorTotalPages={tutorTotalPages}
                            tutorOffset={tutorOffset}
                            setTutorOffset={setTutorOffset}
                        />

                    </div>
                </div>
            </div>

            {isOpened && (
                <TutorInfoPage
                    setIsOpen={setIsOpened}
                    tutor={selectedTutor}
                    setText={setTextAlert}
                    setShowAlert={setShowAlert}
                />
            )}

            <NewFooter/>

        </div>

    )
}