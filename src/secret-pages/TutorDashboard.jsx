import React, {useEffect, useState} from "react";
import SecretHeader from "../secret-components/SecretHeader";
import MyStudents from "../secret-components/MyStudents";
import MyLessons from "../secret-components/MyLessons";

import {GetTutorProfile, GetFollowedStudents, GetLessonsTypes, GetLessonsFormats} from "../supabase/DBFunctions";


function TutorDashboard() {
    const profile = GetTutorProfile()
    const [students, setStudents] = useState([])
    const lessonsTypes = GetLessonsTypes()
    const lessonFormats = GetLessonsFormats()


    useEffect(() => {
        async function fetchStuds() {
            const studs = await GetFollowedStudents();
            setStudents(studs);
        }
        fetchStuds();
    }, [])



    return (
        <div>
            {profile && (
                <div>
                    <SecretHeader
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                    />

                    <MyStudents studentsList={students}/>
                    <MyLessons
                        studentsList={students}
                        lessonTypes={lessonsTypes}
                        lessonFormats={lessonFormats}
                    />
                </div>

            )}
        </div>
    );
}


export default TutorDashboard;