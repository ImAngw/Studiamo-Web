import React from "react";
import SecretHeader from "../secret-components/SecretHeader";
import {useUserData} from "../provider/AppDataContext";
import {useTutorData} from "../provider/AppTutorContext";

import MyCourses from "../secret-components/MyCourses";
import MyCourseLessons from "../secret-components/MyCourseLessons";


function CoursesPage() {
    const {profile} = useUserData()
    const {courses} = useTutorData()

    return (
        <div>
            {profile && (
                <div>
                    <SecretHeader
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                        pageName={"CoursesPage"}
                    />

                    <MyCourses courseList={courses}/>
                    <MyCourseLessons courseList={courses}/>
                </div>

            )}
        </div>
    );
}


export default CoursesPage;
