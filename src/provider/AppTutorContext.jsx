import React, { createContext, useContext, useEffect, useState } from "react";
import {
    GetFollowedStudents,
    getLessonsTypes,
    getLessonsFormats,
    getLessons,
    getFollowedCourses,
    getCourseLessons
} from "../supabase/DBFunctions";



const AppTutorContext = createContext({});

export function AppTutorProvider({ children }) {
    const [students, setStudents] = useState([])
    const [lessonTypes, setLessonTypes] = useState([])
    const [lessonFormats, setLessonFormats] = useState([])
    const [courses, setCourses] = useState([])


    useEffect(() => {
        async function loadData() {
            setStudents(await GetFollowedStudents());
            setLessonTypes(await getLessonsTypes());
            setLessonFormats(await getLessonsFormats());
            setCourses(await getFollowedCourses());

        }
        loadData();
    }, []); // <-- viene eseguito SOLO UNA VOLTA

    return (
        <AppTutorContext.Provider value={{lessonTypes, lessonFormats, students, courses}}>
            {children}
        </AppTutorContext.Provider>
    );
}

export function useTutorData() {
    return useContext(AppTutorContext);
}





function formatDate(year, month, day) {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
}


const AppLessonsContext = createContext({});

export function AppLessonsProvider({ children }) {
    const [allLessons, setAllLessons] = useState([])
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());


    const firstDate = formatDate(currentYear, currentMonth, 1);
    let lastDate = new Date(currentYear, currentMonth, 0);
    lastDate = formatDate(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate());


    useEffect(() => {
        async function loadData() {
            setAllLessons(await getLessons(firstDate, lastDate));
        }
        loadData();
    }, [firstDate, lastDate]);

    return (
        <AppLessonsContext.Provider value={{currentMonth, setCurrentMonth, currentYear, setCurrentYear, allLessons, setAllLessons}}>
            {children}
        </AppLessonsContext.Provider>
    );
}

export function useLessonsData() {
    return useContext(AppLessonsContext);
}








const AppCourseLessonsContext = createContext({});

export function AppCourseLessonsProvider({ children }) {
    const [allLessons, setAllLessons] = useState([])
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(today.getFullYear());


    const firstDate = formatDate(currentYear, currentMonth, 1);
    let lastDate = new Date(currentYear, currentMonth, 0);
    lastDate = formatDate(lastDate.getFullYear(), lastDate.getMonth() + 1, lastDate.getDate());


    useEffect(() => {
        async function loadData() {
            setAllLessons(await getCourseLessons(firstDate, lastDate));
        }
        loadData();
    }, [firstDate, lastDate]);

    return (
        <AppCourseLessonsContext.Provider value={{currentMonth, setCurrentMonth, currentYear, setCurrentYear, allLessons, setAllLessons}}>
            {children}
        </AppCourseLessonsContext.Provider>
    );
}

export function useCourseLessonsData() {
    return useContext(AppCourseLessonsContext);
}


