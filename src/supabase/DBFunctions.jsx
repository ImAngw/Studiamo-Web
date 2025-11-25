import React, { useEffect, useState } from 'react'
import {supabase} from "./supabaseClient";


export function GetTutorProfile() {

    const [profile, setProfile] = useState(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase.rpc('get_tutor_profile')
            if (error) {
                alert(error.message)
            } else {
                setProfile(data[0])
            }
        }

        fetchProfile()
    }, [])

    if (!profile) return null

    return profile
}


export async function GetFollowedStudents() {
    const { data, error } = await supabase.rpc('get_followed_students')

    if (error) {
        alert(error.message)
        return null;
    }
    return data;

}


export async function getStudentsCount() {
    const { data, error } = await supabase.rpc('get_followed_students_count')
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}



export function GetLessonsTypes() {
    const [types, setTypes] = useState(null)

    useEffect(() => {
        const fetchTypes = async () => {
            const { data, error } = await supabase.rpc('get_lesson_types')
            if (error) {
                alert(error.message)
            } else {
                setTypes(data.slice(0, data.length))
            }
        }
        fetchTypes()

    }, [])

    if (!types) return null

    return types
}

export function GetLessonsFormats() {
    const [formats, setFormats] = useState(null)

    useEffect(() => {
        const fetchFormats = async () => {
            const { data, error } = await supabase.rpc('get_lesson_formats')
            if (error) {
                alert(error.message)
            } else {
                setFormats(data.slice(0, data.length))
            }
        }
        fetchFormats()

    }, [])

    if (!formats) return null

    return formats
}



export async function getLessonsCount(start_date, stop_date) {
    const { data, error } = await supabase.rpc('get_lessons_count_in_range', {
        start_date: start_date,
        stop_date: stop_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}

export async function getLessons(first_date, last_date) {

    const { data, error } = await supabase.rpc('get_lessons_in_range', {
        start_date: first_date,
        stop_date: last_date
    })

    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function addNewLesson(
    date,
    hours,
    minutes,
    type_id,
    format_id,
    n_students,
    student_list,
    already_processed
) {
    const { data, error } = await supabase.rpc('insert_lesson_with_presences', {
        lesson_date: date,
        lesson_hours: hours,
        lesson_minutes: minutes,
        lesson_type_id: type_id,
        lesson_format_id: format_id,
        lesson_n_students: n_students,
        presences: student_list,
        lesson_processed: already_processed
    });

    if (error) {
        alert(error.message);
        return null;
    }

    return data[0]; // sarà probabilmente un array con { lesson_id, lesson_cost }
}




export async function deleteLesson(old_lesson_id) {
    const { error } = await supabase.rpc('delete_lesson_with_presences', {
        old_lesson_id,
    });

    if (error) {
        alert(error.message);
    } else {
        console.log('Lezione eliminata con successo');
    }
}



export async function getBucketImages() {
    const { data, error } = await supabase
        .storage
        .from("StudiAmo-web-images")
        .list("carousel-images", { limit: 100 });

    if (error) {
        console.error("Errore nel listare le immagini:", error);
        return [];
    }


    return data.map(file => ({
        name: file.name,
        url: `https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/carousel-images/${file.name}`,
    }));
}


export async function fetchTranslations(lang = "it") {
    const { data, error } = await supabase
        .from("text_table")
        .select("json_text")
        .eq("language", lang)
        .single();  // assume che ci sia una sola riga per lingua

    if (error) {
        console.error("Errore nel recupero dei testi:", error);
        return null;
    }

    return data.json_text; // il JSON dei testi
}

