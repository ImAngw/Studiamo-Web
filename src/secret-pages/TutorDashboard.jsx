import React from "react";
import SecretHeader from "../secret-components/SecretHeader";
import MyStudents from "../secret-components/MyStudents";
import MyLessons from "../secret-components/MyLessons";

import {GetTutorProfile, GetFollowedStudents, GetLessonsTypes, GetLessonsFormats} from "../supabase/DBFunctions";


function TutorDashboard() {
    const profile = GetTutorProfile()
    const students = GetFollowedStudents()
    const lessonsTypes = GetLessonsTypes()
    const lessonFormats = GetLessonsFormats()

    return (
        <div>
            {profile && (
                <div>
                    <SecretHeader
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                    />

                    <MyStudents studentsList={students} />
                    <MyLessons studentsList={students} lessonTypes={lessonsTypes} lessonFormats={lessonFormats}/>
                </div>

            )}
        </div>
    );
}


export default TutorDashboard;