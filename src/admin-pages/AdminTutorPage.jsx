import React, {useEffect, useState} from "react";
import TutorTableCounts from "../admin-components/TutorTableCounts";
import StudentsTableCounts from "../admin-components/StudentstableCount";
import GeneralTableCounts from "../admin-components/GeneralTableCounts";

import AdminHeader from "../admin-components/AdminHeader";
import {useTranslation} from "react-i18next";
import Dropdown from "react-bootstrap/Dropdown";
import SecretDropDown from "../secret-components/SecretDropDown";
import {ButtonWithIcon} from "../components/CustomButtons";
import goIcon from "../assets/icons/lets-go.png";
import {getActiveTutors, getActiveStudents, getGeneralCounts, getActiveStudentsCount, getActiveTutorsCount} from "../supabase/DBAdminFunctions";
import {GetTutorProfile} from "../supabase/DBFunctions";


function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}


function daysCheck(firstDay, lastDay, strings, allowedDays) {
    if (firstDay > lastDay) {
        alert(strings.day_alert)
        return false
    }

    if (!allowedDays.includes(lastDay)) {
        alert(strings.day_not_allowed)
        return false
    }
    return true
}


function AdminTutorPage() {
    const profile = GetTutorProfile()
    const { t } = useTranslation();
    const strings = t("AdminTutor", { returnObjects: true });

    const today = new Date();
    const [selectedFirstDay, setSelectedFirstDay] = useState(1);

    const allowedYears = [today.getFullYear(), today.getFullYear() - 1]
    const allowedMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const [pushButton, setPushButton] = useState(false)
    const [isFirstRun, setIsFirstRun] = useState(true)


    const [studOffset, setStudOffset] = useState(0);
    const [totalStudPages, setTotalStudPages] = useState(0);
    const studPerPage = 20;

    const [tutorOffset, setTutorOffset] = useState(0);
    const [totalTutorPages, setTotalTutorPages] = useState(0);
    const tutorPerPage = 20;

    const [activeTutors, setActiveTutors] = useState([])
    const [activeStudents, setActiveStudents] = useState([])
    const [generalCounts, setGeneralCounts] = useState({})

    useEffect(() => {
        if (isFirstRun) return
        const fetchActiveStudents = async () => {
            const students = await getActiveStudents(false, firstDataStr, lastDataStr, studOffset * studPerPage);
            setActiveStudents(students);
        }
        fetchActiveStudents()
    }, [pushButton, studOffset])


    useEffect(() => {
        if (isFirstRun) return
        const fetchActiveTutors = async () => {
            const tutors = await getActiveTutors(false, firstDataStr, lastDataStr, tutorOffset * tutorPerPage);
            setActiveTutors(tutors);
        }
        fetchActiveTutors()
    }, [pushButton, tutorOffset])






    let lastData = new Date(currentYear, currentMonth, 0);

    let lastAllowedDay = (currentYear < today.getFullYear() || currentMonth < today.getMonth()) ? lastData.getDate() : today.getDate();
    if (lastAllowedDay !== 1) {
        lastAllowedDay -= 1;
    }

    const [selectedLastDay, setSelectedLastDay] = useState(lastAllowedDay);


    let days = Array.from({ length: lastAllowedDay }, (_, i) => i + 1)

    let firstDataStr = formatDate(currentYear, currentMonth, selectedFirstDay)
    let lastDataStr = formatDate(currentYear, currentMonth, selectedLastDay)

    useEffect(() => {
        firstDataStr = formatDate(currentYear, currentMonth, selectedFirstDay)
        lastDataStr = formatDate(currentYear, currentMonth, selectedLastDay)
    }, [selectedLastDay, selectedFirstDay])



    return (
        <div>
            {profile && (
                <div>
                    <AdminHeader
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                    />

                    <h1 className={'title-font'} style={{paddingTop:10}}> {strings.title}:</h1>
                    <div style={{padding:20, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 0  rgba(0, 0, 0, 0.1)', width:'90%', margin: '20px  auto'}}>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center', gap:'10px'}}>
                            <p style={{ display: 'inline', margin: 0, paddingRight:10, paddingLeft:10 }} className={'main-font'}><b>{strings.lessons_from}: </b></p>
                            <Dropdown>
                                <Dropdown.Toggle style={{
                                    backgroundColor: 'transparent',  // nessun colore di sfondo
                                    border: '1px solid black',     // bordo verde (o quello che vuoi)
                                    color: 'black',                // testo verde per coerenza
                                    boxShadow: 'none',                // rimuove l’ombra del focus
                                    width:'50px',
                                }}>
                                    <p style={{ display: 'inline', margin: 0, paddingRight:0 }}>{selectedFirstDay}</p>

                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{
                                    minWidth: '100px',   // larghezza minima
                                    maxHeight: '200px',  // altezza massima
                                    overflowY: 'auto',   // scroll se troppi elementi
                                }}>
                                    {days.map((day, index) => (
                                        index === days.length - 1 ? (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => {setSelectedFirstDay(day)}
                                                }>
                                                {day}
                                            </Dropdown.Item>

                                        ) : (
                                            <div key={index}>
                                                <Dropdown.Item onClick={() => {setSelectedFirstDay(day)}}>{day}</Dropdown.Item>
                                                <Dropdown.Divider />
                                            </div>
                                        )
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <p style={{ display: 'inline', margin: 0, paddingRight:10, paddingLeft:30 }} className={'main-font'}><b>{strings.lessons_to}: </b></p>
                            <Dropdown>
                                <Dropdown.Toggle style={{
                                    backgroundColor: 'transparent',  // nessun colore di sfondo
                                    border: '1px solid black',     // bordo verde (o quello che vuoi)
                                    color: 'black',                // testo verde per coerenza
                                    boxShadow: 'none',                // rimuove l’ombra del focus
                                    width:'50px',
                                }}>
                                    <p style={{ display: 'inline', margin: 0, paddingRight:0 }}>{selectedLastDay}</p>

                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{
                                    minWidth: '100px',   // larghezza minima
                                    maxHeight: '200px',  // altezza massima
                                    overflowY: 'auto',   // scroll se troppi elementi
                                }}>
                                    {days.map((day, index) => (
                                        index === days.length - 1 ? (
                                            <Dropdown.Item
                                                key={index}
                                                onClick={() => {setSelectedLastDay(day)}
                                                }>
                                                {day}
                                            </Dropdown.Item>

                                        ) : (
                                            <div key={index}>
                                                <Dropdown.Item onClick={() => {setSelectedLastDay(day)}}>{day}</Dropdown.Item>
                                                <Dropdown.Divider />
                                            </div>
                                        )
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div style={{display: 'flex', flexDirection: 'row', justifyContent:'center', gap:'30px', paddingTop:20}}>
                            <SecretDropDown options={allowedMonths} defaultValue={currentMonth} setDefaultValue={setCurrentMonth}/>
                            <SecretDropDown options={allowedYears} defaultValue={currentYear} setDefaultValue={setCurrentYear}/>
                            <ButtonWithIcon
                                icon={goIcon}
                                action={ async () => {
                                    const check = daysCheck(selectedFirstDay, selectedLastDay, strings, days)
                                    if (check) {
                                        const nStuds = await getActiveStudentsCount(false, firstDataStr, lastDataStr)
                                        setTotalStudPages(Math.ceil(nStuds / studPerPage))

                                        const nTutors = await getActiveTutorsCount(false, firstDataStr, lastDataStr)
                                        setTotalTutorPages(Math.ceil(nTutors / tutorPerPage))

                                        const counts = await getGeneralCounts(firstDataStr, lastDataStr)
                                        setGeneralCounts(counts);

                                        setIsFirstRun(false)
                                        setPushButton(!pushButton)
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <GeneralTableCounts counts={generalCounts}/>
                    <TutorTableCounts
                        activeTutors={activeTutors}
                        firstData={firstDataStr}
                        lastData={lastDataStr}
                        allowedCounts={today.getDate() !== 1}
                        setTutorOffset={setTutorOffset}
                        totPages={totalTutorPages}
                    />
                    <StudentsTableCounts
                        activeStudents={activeStudents}
                        firstData={firstDataStr}
                        lastData={lastDataStr}
                        allowedCounts={today.getDate() !== 1}
                        setStudOffset={setStudOffset}
                        totPages={totalStudPages}
                    />
                </div>
            )}
        </div>
    );
}

export default AdminTutorPage;

