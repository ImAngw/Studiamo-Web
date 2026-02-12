import {useTranslation} from "react-i18next";
import {ButtonWithIcon} from "../components/CustomButtons";
import React, {useEffect, useState,} from "react";
import Dropdown from "react-bootstrap/Dropdown";
import SecretDropDown from "../secret-components/SecretDropDown";
import goIcon from "../assets/icons/confirm.png";
import tutorIcon from "../assets/icons/tutor.png";
import studIcon from "../assets/icons/stud.png";
import timerIcon from "../assets/icons/timer.png";
import billIcon from "../assets/icons/bill.png";
import salaryIcon from "../assets/icons/salary.png";
import moneyIcon from "../assets/icons/money-bag.png";
import calendarIcon from "../assets/icons/calendar.png";
import {ChevronDownIcon} from "@heroicons/react/16/solid";








function AdminPeriodCard({strings, firstDay, setFirstDay, daysF, lastDay, setLastDay,
                             daysL, allowedMonths, currentMonth, setCurrentMonth, allowedYears, currentYear,
                             setCurrentYear, setPushButton, setSelectedMonth, setSelectedYear, setSelectedFDay, setSelectedLDay}) {
    const { t } = useTranslation();
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



    return(
        <div>
            <div className="mx-auto  bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <label htmlFor="firstDay" className="block text-sm/6 font-medium text-gray-900">
                            <b>{strings.first_day}</b>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="firstDay"
                                name="firstDay"
                                value={firstDay}
                                onChange={(e) => setFirstDay(Number(e.target.value))}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                {daysF.map((day, index) => (
                                    <option key={index} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />


                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <label htmlFor="lastDay" className="block text-sm/6 font-medium text-gray-900">
                            <b>{strings.last_day}</b>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="lastDay"
                                name="lastDay"
                                value={lastDay}
                                onChange={(e) => setLastDay(Number(e.target.value))}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                {daysL.map((day, index) => (
                                    <option key={index} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </div>
                    </div>

                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <label htmlFor="month" className="block text-sm/6 font-medium text-gray-900">
                            <b>{strings.month}</b>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="month"
                                name="month"
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                {allowedMonths.map((month, index) => (
                                    <option key={index} value={month}>
                                        {monthMap[month]}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />


                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <label htmlFor="year" className="block text-sm/6 font-medium text-gray-900">
                            <b>{strings.year}</b>
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="year"
                                name="year"
                                value={currentYear}
                                onChange={(e) => setCurrentYear(Number(e.target.value))}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                {allowedYears.map((year, index) => (
                                    <option key={index} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </div>
                    </div>

                </div>
                {/*
                <div style={{display: 'flex', flexDirection: 'column', justifyContent:'center', gap:'10px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', gap:'10px'}}>
                        <p style={{ display: 'inline', margin: 0, paddingBottom:30 }} className={'main-font'}><b>{strings.lessons_from}: </b></p>
                        <Dropdown>
                            <Dropdown.Toggle style={{
                                backgroundColor: 'transparent',  // nessun colore di sfondo
                                border: '1px solid black',     // bordo verde (o quello che vuoi)
                                color: 'black',                // testo verde per coerenza
                                boxShadow: 'none',                // rimuove l’ombra del focus
                                width:'50px',
                            }}>
                                <p style={{ display: 'inline', margin: 0, paddingRight:0 }}>{firstDay}</p>

                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{
                                minWidth: '100px',   // larghezza minima
                                maxHeight: '200px',  // altezza massima
                                overflowY: 'auto',   // scroll se troppi elementi
                            }}>
                                {daysF.map((day, index) => (
                                    index === daysF.length - 1 ? (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => {setFirstDay(day)}
                                            }>
                                            {day}
                                        </Dropdown.Item>

                                    ) : (
                                        <div key={index}>
                                            <Dropdown.Item onClick={() => {setFirstDay(day)}}>{day}</Dropdown.Item>
                                            <Dropdown.Divider />
                                        </div>
                                    )
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <p style={{ display: 'inline', margin: 0 }} className={'main-font'}><b>{strings.lessons_to}: </b></p>
                        <Dropdown>
                            <Dropdown.Toggle style={{
                                backgroundColor: 'transparent',  // nessun colore di sfondo
                                border: '1px solid black',     // bordo verde (o quello che vuoi)
                                color: 'black',                // testo verde per coerenza
                                boxShadow: 'none',                // rimuove l’ombra del focus
                                width:'50px',
                            }}>
                                <p style={{ display: 'inline', margin: 0, paddingRight:0 }}>{lastDay}</p>

                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{
                                minWidth: '100px',   // larghezza minima
                                maxHeight: '200px',  // altezza massima
                                overflowY: 'auto',   // scroll se troppi elementi
                            }}>
                                {daysL.map((day, index) => (
                                    index === daysL.length - 1 ? (
                                        <Dropdown.Item
                                            key={index}
                                            onClick={() => {setLastDay(day)}
                                            }>
                                            {day}
                                        </Dropdown.Item>

                                    ) : (
                                        <div key={index}>
                                            <Dropdown.Item onClick={() => {setLastDay(day)}}>{day}</Dropdown.Item>
                                            <Dropdown.Divider />
                                        </div>
                                    )
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', gap:'10px'}}>
                        <p style={{ display: 'inline', margin: 0, paddingBottom:30}} className={'main-font'}><b>{strings.month}: </b></p>
                        <SecretDropDown options={allowedMonths} defaultValue={currentMonth} setDefaultValue={setCurrentMonth}/>
                    </div>


                    <div style={{display: 'flex', flexDirection: 'row', gap:'10px'}}>
                        <p style={{ display: 'inline', margin: 0, paddingBottom:30 }} className={'main-font'}><b>{strings.year}: </b></p>
                        <SecretDropDown options={allowedYears} defaultValue={currentYear} setDefaultValue={setCurrentYear}/>
                    </div>
                </div>
                */}
            </div>
            <div className="mx-auto flex justify-center pt-3" style={{paddingTop: 10, width: '100%'}}>
                <button
                    type="submit"
                    onClick={async () => {
                        setPushButton(true);
                        setSelectedMonth(currentMonth);
                        setSelectedYear(currentYear);
                        setSelectedFDay(firstDay);
                        setSelectedLDay(lastDay);
                    }}
                    className="w-full flex justify-center rounded-md bg-[#9BCECF] py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-[#8EC0C1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9BCECF]"
                >
                    {strings.go_button}
                </button>
            </div>
        </div>
    )

}


function Counters({counts, courseCounts, nCourseTutors, nActiveCourseStudents, nActiveCourseTutors}){
    const { t } = useTranslation();
    const strings = t("AdminGeneral", { returnObjects: true });


    const [hours, setHours] = React.useState();
    const [minutes, setMinutes] = React.useState(0);

    const [pStr, setPStr] = React.useState({total: null, cost: null, gain: null});
    const [courseStr, setCourseStr] = React.useState({total: null, cost: null, gain: null});


    React.useEffect(() => {
        if (counts?.money_in ?? 0 !== 0) {
            const c = Math.round((counts.money_out / counts.money_in) * 100)
            setPStr({total: 100, cost: c, gain: 100 - c})
        } else {
            setPStr({total: null, cost: null, gain: null})
        }
    }, [counts])


    React.useEffect(() => {
        if (courseCounts?.total_money ?? 0 !== 0) {
            const c = Math.round((nCourseTutors.total_money / courseCounts.total_money) * 100)
            setCourseStr({total: 100, cost: c, gain: 100 - c})
        } else {
            setCourseStr({total: null, cost: null, gain: null})
        }
    }, [courseCounts.total_money, nCourseTutors.total_money])




    useEffect(  () => {
        if (nCourseTutors.total_minutes >= 60) {
            setHours(nCourseTutors.total_hours + Math.floor(nCourseTutors.total_minutes / 60))
            setMinutes(nCourseTutors.total_minutes - 60 * Math.floor(nCourseTutors.total_minutes / 60))
        } else {
            setHours(nCourseTutors.total_hours)
            setMinutes(nCourseTutors.total_minutes)
        }
    }, [nCourseTutors])

    return(
        <div style={{paddingTop: 40}}>
            <div className="w-full max-w-5xl py-12 mx-auto">
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                    {strings.priv_lessons}
                </h3>
                <div className="grid grid-cols-3 gap-6 sm:grid-cols-3 lg:grid-cols-6 justify-items-center">

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={tutorIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:20}}><b>{counts?.n_tutors ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.active_tutors}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={studIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:18}}><b>{counts?.n_students ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.active_students}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={timerIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:18}}><b>{counts?.tot_hours ?? 0}h:{counts?.tot_minutes ?? 0}m</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.tot_hours}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={billIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-gray-900 dark:text-gray-300 m-0" style={{fontSize:18, color:"green"}}><b>{counts?.money_in ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.money_in}</p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0" style={{fontSize:11}}>{pStr.total !== null ? pStr.total + "%" : ""}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={salaryIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-gray-900 dark:text-gray-300 m-0" style={{fontSize:18, color:"red"}}><b>{counts?.money_out ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.money_out}</p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0" style={{fontSize:11}}>{pStr.cost !== null ? pStr.cost + "%" : ""}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={moneyIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-gray-900 dark:text-gray-300 m-0"  style={{fontSize:18, color:"gold"}}><b>{Math.round(((counts?.money_in ?? 0) - (counts?.money_out ?? 0)) * 100 ) / 100}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.gain}</p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0" style={{fontSize:11}}>{pStr.gain !== null ? pStr.gain + "%" : ""}</p>
                    </div>
                </div>


                <h3 className="mt-2 text-4xl pt-3 font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                    {strings.courses}
                </h3>
                <div className="grid grid-cols-3 gap-6 sm:grid-cols-3 lg:grid-cols-6 justify-items-center">

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={tutorIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:20}}><b> {nActiveCourseTutors?.n_tutor ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.active_tutors}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={studIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:18}}><b>{nActiveCourseStudents?.n_stud ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.active_students}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={timerIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0"style={{fontSize:18}}><b>{hours}h:{minutes}m</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.tot_hours}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={billIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-gray-900 dark:text-gray-300 m-0" style={{fontSize:18, color:"green"}}><b>{courseCounts?.total_money ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.money_in}</p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0" style={{fontSize:11}}>{courseStr.total !== null ? courseStr.total + "%" : ""}</p>

                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={salaryIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-gray-900 dark:text-gray-300 m-0" style={{fontSize:18, color:"red"}}><b>{nCourseTutors?.total_money ?? 0}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.money_out}</p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0" style={{fontSize:11}}>{courseStr.cost !== null ? courseStr.cost + "%" : ""}</p>

                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={moneyIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-gray-900 dark:text-gray-300 m-0"  style={{fontSize:18, color:"gold"}}><b>{(courseCounts?.total_money ?? 0) - (nCourseTutors?.total_money ?? 0)}</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.gain}</p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0" style={{fontSize:11}}>{courseStr.gain !== null ? courseStr.gain + "%" : ""}</p>

                    </div>
                </div>
            </div>

        </div>
    )
}


export default function AdminPeriodSelector({name, surname, firstDay, setFirstDay, daysF, lastDay, setLastDay, daysL,
                                                allowedMonths, currentMonth, setCurrentMonth, allowedYears, currentYear, setCurrentYear,
                                                setPushButton, counts, courseCounts, nCourseTutors, nActiveCourseStudents, nActiveCourseTutors
                                            }) {
    const {t} = useTranslation();
    const strings = t("AdminTutor", {returnObjects: true});
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
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedFDay, setSelectedFDay] = useState(firstDay);
    const [selectedLDay, setSelectedLDay] = useState(lastDay);


    return (
        <div>
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
                                <p className="text-base/7 font-semibold" style={{color:"#9BCECF"}}>Admin: {name} {surname}</p>
                                <div className="flex gap-14">
                                    <div>
                                        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                            {strings.title}
                                        </h1>

                                        <div style={{display: "flex", flexDirection:"row", paddingBottom:15}}>
                                            <img src={calendarIcon} className="w-7 h-7 mr-2" alt="add user icon"/>
                                            <p style={{ display: 'inline', margin: 0, paddingRight:5, paddingLeft:5, fontSize:16 }}>
                                                {selectedFDay}-{selectedLDay} {monthMap[selectedMonth]} {selectedYear}
                                            </p>
                                        </div>

                                    </div>




                                </div>
                                <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg" style={{paddingBottom: 30}}>
                                    <p>
                                        {strings.par1}
                                    </p>
                                </div>

                                <div className="lg:pr-4">
                                    <AdminPeriodCard
                                        strings={strings}
                                        firstDay={firstDay}
                                        setFirstDay={setFirstDay}
                                        daysF={daysF}
                                        lastDay={lastDay}
                                        setLastDay={setLastDay}
                                        daysL={daysL}
                                        allowedMonths={allowedMonths}
                                        currentMonth={currentMonth}
                                        setCurrentMonth={setCurrentMonth}
                                        allowedYears={allowedYears}
                                        currentYear={currentYear}
                                        setCurrentYear={setCurrentYear}
                                        setPushButton={setPushButton}
                                        setSelectedMonth={setSelectedMonth}
                                        setSelectedYear={setSelectedYear}
                                        setSelectedFDay={setSelectedFDay}
                                        setSelectedLDay={setSelectedLDay}

                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="-mt-12 lg:p-14 lg:-ml-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
                    >
                        <Counters
                            counts={counts}
                            courseCounts={courseCounts}
                            nCourseTutors={nCourseTutors}
                            nActiveCourseStudents={nActiveCourseStudents}
                            nActiveCourseTutors={nActiveCourseTutors}
                        />

                    </div>
                </div>
            </div>
        </div>

    )
}