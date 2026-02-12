import React, { useEffect, useState } from 'react'
import {supabase} from "./supabaseClient";



export async function getGeneralCounts(first_date, last_date) {
    // new_make_general_counts, make_general_counts
    const { data, error } = await supabase.rpc('new_make_general_counts', {
        first_date: first_date,
        last_date: last_date
    })
    if (error) {
        alert(error.message)
        return null;
    }

    return data[0];

}


export async function getActiveTutors(select_only_not_processed, first_date, last_date, my_offset) {
    // new_get_active_tutors, get_active_tutors
    const { data, error } = await supabase.rpc('new_get_active_tutors', {
        select_only_not_processed: select_only_not_processed,
        first_date: first_date,
        last_date: last_date,
        my_offset: my_offset
    })
    if (error) {
        alert(error.message)
        return null;
    }

    return data;

}


export async function getActiveStudents(select_only_not_processed, start_date, stop_date, my_offset) {
    // new_get_active_students, get_active_students
    const { data, error } = await supabase.rpc('new_get_active_students', {
        select_only_not_processed: select_only_not_processed,
        start_date: start_date,
        stop_date: stop_date,
        my_offset: my_offset
    })
    if (error) {
        alert(error.message)
        return null;
    }

    return data;

}


export async function getLessonsForStudents(stud_id, select_only_not_processed, start_date, stop_date) {
    const { data, error } = await supabase.rpc('read_student_lesson', {
        stud_id: stud_id,
        select_only_not_processed: select_only_not_processed,
        start_date: start_date,
        stop_date: stop_date
    })
    if (error) {
        alert(error.message)
        return null;
    }

    return data;

}


export async function getLessonsForTutor(t_id, select_only_not_processed, first_date, last_date) {
    const { data, error } = await supabase.rpc('read_tutor_lessons', {
        t_id: t_id,
        select_only_not_processed: select_only_not_processed,
        first_date: first_date,
        last_date: last_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getFollowedStudentsAdmin(teach_id) {
    const { data, error } = await supabase.rpc('get_followed_students_for_admin', {
        teach_id: teach_id
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}



export async function getStudentsCount() {
    const { data, error } = await supabase.rpc('get_total_students_count')
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getActiveStudentsCount(select_only_not_processed, start_date, stop_date) {
    const { data, error } = await supabase.rpc('get_active_students_count', {
        select_only_not_processed: select_only_not_processed,
        start_date: start_date,
        stop_date: stop_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}

export async function getActiveTutorsCount(select_only_not_processed, first_date, last_date) {
    // new_get_active_tutors_count, get_active_tutors_count
    const { data, error } = await supabase.rpc('new_get_active_tutors_count', {
        select_only_not_processed: select_only_not_processed,
        first_date: first_date,
        last_date: last_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}



export async function getTutorsOfStudent(student_id) {
    const { data, error } = await supabase.rpc('get_tutors_whom_follow_student', {
        my_student_id: student_id
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}



export async function getAllStudInDB(my_offset) {
    const { data, error } = await supabase.rpc('get_all_students_in_db', {
        my_offset: my_offset
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}

export async function getStudBySurname(surname) {
    const { data, error } = await supabase.rpc('get_all_students_with_surname', {
        my_surname: surname
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getTutorBySurname(surname) {
    const { data, error } = await supabase.rpc('get_all_tutors_with_surname', {
        my_surname: surname
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function updateStudent(student_id, student_name, student_surname, student_date, student_phone) {
    const { error } = await supabase.rpc('update_student', {
        student_id: student_id,
        student_name: student_name,
        student_surname: student_surname,
        student_date: student_date,
        student_phone: student_phone
    })
    if (error) {
        alert(error.message)
    }
}



export async function updateTutor(tutor_id, tutor_name, tutor_surname, tutor_role) {
    const { error } = await supabase.rpc('update_tutor', {
        tutor_id: tutor_id,
        tutor_name: tutor_name,
        tutor_surname: tutor_surname,
        tutor_role: tutor_role
    })
    if (error) {
        alert(error.message)
    }
}


export async function addTutorStudentRelation(stud_id, teach_id) {
    const { error } = await supabase.rpc('insert_tutor_student_relation', {
        stud_id: stud_id,
        teach_id: teach_id
    })
    if (error) {
        alert(error.message)
    }
}

export async function removeTutorStudentRelation(stud_id, teach_id) {
    const { error } = await supabase.rpc('remove_tutor_student_relation', {
        stud_id: stud_id,
        teach_id: teach_id
    })
    if (error) {
        alert(error.message)
    }
}


export async function addNewStudent(student_sex, student_name, student_surname, student_phone, student_date) {
    const { data, error } = await supabase.rpc('insert_new_student', {
        student_sex: student_sex,
        student_name: student_name,
        student_surname: student_surname,
        student_phone: student_phone,
        student_date: student_date
    })
    if (error) {
        alert(error.message)
        return null;
    }

    return data;
}



export async function uploadPDF(pdfDoc, filename) {
    const bucket = supabase.storage.from('PDF files');

    // Controlla se il file esiste già
    const { data: existingData, error: listError } = await bucket.list('', { search: filename });
    if (listError) {
        console.error('Errore controllo file esistente:', listError);
        return null;
    }

    // Se il file esiste, genera direttamente il signed URL
    if (existingData.length > 0) {
        const { data: signedUrlData, error: signedUrlError } = await bucket.createSignedUrl(filename, 60 * 60 * 24 * 7);
        if (signedUrlError) {
            console.error('Errore creazione URL firmato:', signedUrlError);
            return null;
        }
        return signedUrlData.signedUrl;
    }

    // Altrimenti esegui l'upload
    const pdfBlob = await new Promise((resolve) => {
        pdfDoc.getBlob((blob) => resolve(blob));
    });

    const { data, error } = await bucket.upload(filename, pdfBlob, {
        cacheControl: 60 * 60 * 24,
        upsert: true
    });

    if (error) {
        console.error('Errore upload:', error);
        return null;
    }

    const { data: signedUrlData, error: signedUrlError } = await bucket.createSignedUrl(filename, 60 * 60 * 24 * 7);
    if (signedUrlError) {
        console.error('Errore creazione URL firmato:', signedUrlError);
        return null;
    }

    return signedUrlData.signedUrl;
}


export async function cleanPDF() {
    const { data, error } = await supabase.functions.invoke('remove-old-pdf', {
        body: { name: 'Functions' },
    })

    if (error) {
        console.log(error)
        return null;
    }

    return data;
}


export async function getAllCourses() {
    const { data, error } = await supabase.rpc('get_all_courses')
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getStudentCourses(student_id) {
    const { data, error } = await supabase.rpc('get_courses_of_the_student', {
        student_id: student_id
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}

export async function getStudentOfTheCourses(course_id, selected_month, selected_year) {
    const { data, error } = await supabase.rpc('get_students_of_the_course', {
        course_id: course_id,
        selected_month: selected_month,
        selected_year: selected_year
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getTutorOfTheCourses(course_id) {
    const { data, error } = await supabase.rpc('get_tutors_of_the_course', {
        course_id: course_id
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getAllTutorInDB(my_offset) {
    const { data, error } = await supabase.rpc('get_all_tutors_in_db', {
        my_offset: my_offset
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}

export async function getAllTutorCountDB() {
    const { data, error } = await supabase.rpc('get_total_tutors_count')
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}

export async function getTutorCourse(tutor_id) {
    const { data, error } = await supabase.rpc('get_courses_of_the_tutor', {
        tutor_id: tutor_id
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getTutorRoles() {
    const { data, error } = await supabase.rpc('get_tutor_roles')
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}





export async function addStudentCourseRelation(course_id, stud_id, price, f_date, l_date) {
    const { error } = await supabase.rpc('insert_student_course_relation', {
        course_id: course_id,
        stud_id: stud_id,
        price: price,
        f_date: f_date,
        l_date: l_date
    })
    if (error) {
        alert(error.message)
    }
}

export async function removeStudentCourseRelation(course_id, stud_id) {
    const { error } = await supabase.rpc('remove_student_course_relation', {
        course_id: course_id,
        stud_id: stud_id
    })
    if (error) {
        alert(error.message)
    }
}

export async function updateStudentCourseRelation(course_id, stud_id, price, f_date, l_date) {
    const { error } = await supabase.rpc('update_student_course_relation', {
        course_id: course_id,
        stud_id: stud_id,
        price: price,
        f_date: f_date,
        l_date: l_date
    })
    if (error) {
        alert(error.message)
    }
}





export async function addTutorCourseRelation(course_id, tutor_id, price) {
    const { error } = await supabase.rpc('insert_tutor_course_relation', {
        course_id: course_id,
        tutor_id: tutor_id,
        price: price
    })
    if (error) {
        alert(error.message)
    }
}

export async function removeTutorCourseRelation(course_id, tutor_id) {
    const { error } = await supabase.rpc('remove_tutor_course_relation', {
        course_id: course_id,
        tutor_id: tutor_id
    })
    if (error) {
        alert(error.message)
    }
}

export async function updateTutorCourseRelation(course_id, tutor_id, price) {
    const { error } = await supabase.rpc('update_tutor_course_relation', {
        course_id: course_id,
        tutor_id: tutor_id,
        price: price
    })
    if (error) {
        alert(error.message)
    }
}





export async function addStudentMonthResume(course_id, studen_id, selected_month, selected_year, price) {
    const { error } = await supabase.rpc('insert_student_month_resume', {
        course_id: course_id,
        studen_id: studen_id,
        selected_month: selected_month,
        selected_year: selected_year,
        price: price


    })
    if (error) {
        alert(error.message)
    }
}

export async function removeStudentMonthResume(course_id, student_id, selected_month, selected_year) {
    const { error } = await supabase.rpc('remove_student_month_resume', {
        course_id: course_id,
        student_id: student_id,
        selected_month: selected_month,
        selected_year: selected_year
    })
    if (error) {
        alert(error.message)
    }
}


export async function getCourseCounts(selected_month, selected_year) {
    const { data, error } = await supabase.rpc('get_total_course_quote_and_gain', {
        selected_month: selected_month,
        selected_year: selected_year
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data[0];
}


export async function getCourseHoursAndCosts(first_date, last_date) {
    const { data, error } = await supabase.rpc('get_total_course_hours_and_costs', {
        first_date: first_date,
        last_date: last_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data[0];
}



export async function getCourseNStuds(selected_month, selected_year) {
    const { data, error } = await supabase.rpc('get_total_course_n_stud', {
        selected_month: selected_month,
        selected_year: selected_year
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data[0];
}


export async function getCourseNSTutors(first_date, last_date) {
    const { data, error } = await supabase.rpc('get_total_course_n_tutor', {
        first_date: first_date,
        last_date: last_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data[0];
}


export async function getCourseLessonsForTutor(t_id, first_date, last_date) {
    const { data, error } = await supabase.rpc('get_tutor_course_lessons_info', {
        t_id: t_id,
        first_date: first_date,
        last_date: last_date
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function getCourseStudentInfo(selected_month, selected_year, my_offset) {
    const { data, error } = await supabase.rpc('get_student_course_resume_info', {
        selected_month: selected_month,
        selected_year: selected_year,
        my_offset: my_offset
    })
    if (error) {
        alert(error.message)
        return null;
    }
    return data;
}


export async function tutor_ban(tutor_id) {
    const { error } = await supabase.rpc('tutor_ban', {
        tutor_id: tutor_id
    })
    if (error) {
        alert(error.message)
    }
}


export async function tutor_activation(tutor_id) {
    const { error } = await supabase.rpc('tutor_activation', {
        tutor_id: tutor_id
    })
    if (error) {
        alert(error.message)
    }
}




