import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getActiveTutors,
    getActiveStudents,
    getGeneralCounts,
    getActiveStudentsCount,
    getActiveTutorsCount,
    getAllStudInDB,
    getStudentsCount,
    getAllCourses,
    getAllTutorInDB,
    getAllTutorCountDB,
    getTutorRoles, getCourseCounts, getCourseHoursAndCosts, getCourseNStuds, getCourseNSTutors, getCourseStudentInfo
} from "../supabase/DBAdminFunctions";
import {getTutorProfile} from "../supabase/DBFunctions";




const AppAdminProfileContext = createContext({});

export function AppAdminProfileProvider({ children }) {
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        async function loadData() {
            setProfile(await getTutorProfile());
        }
        loadData();
    }, []); // <-- viene eseguito SOLO UNA VOLTA


    return (
        <AppAdminProfileContext.Provider value={{profile}}>
            {children}
        </AppAdminProfileContext.Provider>
    );
}

export function useAdminProfileData() {
    return useContext(AppAdminProfileContext);
}





function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}

const AppAdminContext = createContext({});

export function AppAdminProvider({ children }) {
    const today = new Date();
    const userPerPage = 20;

    const [firstDate, setFirstDate] = useState(
        formatDate(today.getFullYear(), today.getMonth() + 1, 1)
    );
    const [lastDate, setLastDate] = useState(
        formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate() - 1 !== 0 ? today.getDate() - 1 : today.getDate())
    );

    const [dateBefore, setDateBefore] = useState({year: today.getFullYear(), month: today.getMonth() + 1})



     // STUDENTS
    const [studOffset, setStudOffset] = useState(0);
    const [studCourseOffset, setCourseStudOffset] = useState(0);
    const [activeStudents, setActiveStudents] = useState([])
    const [totalStudPages, setTotalStudPages] = useState(1);
    const [studCurrentPage, setStudCurrentPage] = useState(1);
    const [nActiveStudCourses, setNActiveStudCourses] = useState(0)
    const [activeCourseStudents, setActiveCourseStudents] = useState([])



    // TUTORS
    const [tutorOffset, setTutorOffset] = useState(0);
    const [activeTutors, setActiveTutors] = useState([])
    const [totalTutorPages, setTotalTutorPages] = useState(1);
    const [tutorCurrentPage, setTutorCurrentPage] = useState(1);
    const [nActiveTutorCourses, setNActiveTutorCourses] = useState(0)
    const [totalStudCoursePages, setTotalStudCoursePages] = useState(1);
    const [studCourseCurrentPage, setStudCourseCurrentPage] = useState(1);



    // GENERAL
    const [generalCounts, setGeneralCounts] = useState({})
    const [courseCounts, setCourseCounts] = useState({})
    const [newQuoteAdded, setNewQuoteAdded] = useState(false)
    const [nCourseTutors, setNCourseTutors] = useState([])

    // COURSES
    const [courses, setCourses] = useState([])
    const [addCourse, setAddCourse] = useState(false)



    useEffect(() => {
        async function loadData() {
            const c = await getCourseCounts(
                dateBefore.month,
                dateBefore.year
            )
            setCourseCounts(c)


            const nPages = Math.ceil(c.total_quote / userPerPage)
            setTotalStudCoursePages(c.total_quote === 0 ? 1 : nPages)


            setNActiveStudCourses(await getCourseNStuds(
                dateBefore.month,
                dateBefore.year
            ))

            setNActiveTutorCourses(await getCourseNSTutors(
                firstDate,
                lastDate
            ))

        }
        loadData();
    }, [newQuoteAdded, dateBefore])



    useEffect(() => {
        async function loadData() {

            const courseStuds = await getCourseStudentInfo(
                dateBefore.month,
                dateBefore.year,
                studCourseOffset * userPerPage
            )
            setActiveCourseStudents(courseStuds)
            setStudCourseCurrentPage(studCourseOffset + 1);
        }
        loadData();

    }, [studCourseOffset, newQuoteAdded])



    useEffect(() => {
        async function loadData() {
            setCourses(await getAllCourses())
        }
        loadData();
    }, [addCourse])


    useEffect(() => {
        async function loadData() {

            const [year, month, day] = firstDate.split("-");
            if (Number(year) !== dateBefore.year || Number(month) !== dateBefore.month) {
                setDateBefore({year: Number(year), month: Number(month)})
            }


            // STUDENTS
            const nStuds = await getActiveStudentsCount(false, firstDate, lastDate)
            const nStudPages = Math.ceil(nStuds / userPerPage)
            setTotalStudPages(nStuds === 0 ? 1 : nStudPages)

            // TUTORS
            const nTutors = await getActiveTutorsCount(false, firstDate, lastDate)
            const nTutorPages = Math.ceil(nTutors / userPerPage)
            setTotalTutorPages(nTutors=== 0 ? 1 : nTutorPages)

            setNCourseTutors(await getCourseHoursAndCosts(
                firstDate,
                lastDate
            ))


            // GENERAL
            const counts = await getGeneralCounts(firstDate, lastDate)
            setGeneralCounts(counts);
        }
        loadData();
    }, [firstDate, lastDate]);


    useEffect(() => {
        async function loadData() {
            setActiveStudents(await getActiveStudents(false, firstDate, lastDate, studOffset * userPerPage));
            setStudCurrentPage(studOffset + 1);
        }
        loadData();
    }, [firstDate, lastDate, studOffset]);


    useEffect(() => {
        async function loadData() {
            setActiveTutors(await getActiveTutors(false, firstDate, lastDate, tutorOffset * userPerPage));
            setTutorCurrentPage(tutorOffset + 1);
        }
        loadData();
    }, [firstDate, lastDate, tutorOffset]);

    return (
        <AppAdminContext.Provider value={{
            firstDate, setFirstDate, lastDate, setLastDate,
            totalStudPages, activeStudents, setStudOffset, studCurrentPage, setStudCurrentPage,
            totalTutorPages, activeTutors, setTutorOffset, tutorCurrentPage, setTutorCurrentPage,
            generalCounts,
            courses, setAddCourse, activeCourseStudents,
            courseCounts, setNewQuoteAdded, nCourseTutors, nActiveTutorCourses, nActiveStudCourses,
            setCourseStudOffset, totalStudCoursePages, studCourseCurrentPage, setStudCourseCurrentPage

        }}>
            {children}
        </AppAdminContext.Provider>
    );
}

export function useAdminData() {
    return useContext(AppAdminContext);
}








const AppAdminStudentsContext = createContext({});

export function AppAdminStudentsProvider({ children }) {
    const [allStudents, setAllStudents] = useState([])
    const [studOffset, setStudOffset] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [allTutors, setAllTutors] = useState([])
    const [tutorOffset, setTutorOffset] = useState(0);
    const [tutorTotalPages, setTutorTotalPages] = useState(1);
    const [currentTutorPage, setCurrentTutorPage] = useState(1);
    const [tutorRoles, setTutorRoles] = useState([])


    const userPerPage = 20;

    useEffect(() => {
        async function loadData() {
            const nStuds = await getStudentsCount()
            const nStudPages = Math.ceil(nStuds / userPerPage)
            setTotalPages(nStuds === 0 ? 1 : nStudPages)

            const nTutors = await getAllTutorCountDB()
            const nTutorPages = Math.ceil(nTutors / userPerPage)
            setTutorTotalPages(nTutors=== 0 ? 1 : nTutorPages)

            const roles = await getTutorRoles()
            setTutorRoles(roles)
        }
        loadData();
    }, [])


    useEffect(() => {
        async function loadData() {
            setAllStudents(await getAllStudInDB(studOffset * userPerPage))
            setCurrentPage(studOffset + 1)
        }
        loadData();
    }, [studOffset]);


    useEffect(() => {
        async function loadData() {
            setAllTutors(await getAllTutorInDB(tutorOffset * userPerPage))
            setCurrentTutorPage(tutorOffset + 1)
        }
        loadData();
    }, [tutorOffset]);


    return (
        <AppAdminStudentsContext.Provider value={{
            totalPages, allStudents, tutorRoles,
            studOffset, setStudOffset,
            currentPage, setCurrentPage,
            tutorOffset, setTutorOffset,
            tutorTotalPages, allTutors,
            currentTutorPage, setCurrentTutorPage
        }}>
            {children}
        </AppAdminStudentsContext.Provider>
    );
}

export function useAdminStudentsData() {
    return useContext(AppAdminStudentsContext);
}
