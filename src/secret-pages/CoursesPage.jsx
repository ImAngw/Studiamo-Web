import React from "react";
import SecretHeader from "../secret-components/SecretHeader";
import {useUserData} from "../provider/AppDataContext";
import {useTutorData} from "../provider/AppTutorContext";

import MyCourses from "../secret-components/MyCourses";
import MyCourseLessons from "../secret-components/MyCourseLessons";

import NewSecretHeader from "../secret-components/NewSecretHeader";
import NewCoursePageContent from "../secret-components/NewCoursePageContent";
import MyCourseLessonsContent from "../secret-components/MyCourseLessonsContent";
import NewWaferCoursesContent from "../secret-components/NewWaferCoursesContent";
import NewFooter from "../components/NewFooter";
import ScrollToTop from "../admin-components/ScrollToTop";


function CoursesPage() {
    const {profile} = useUserData()
    const {courses} = useTutorData()

    return (
        <div className={'pt-[80px]'}>
            {profile && (
                <div>
                    <ScrollToTop/>
                    <NewSecretHeader/>
                    {/*
                    <SecretHeader
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                        pageName={"CoursesPage"}
                    />

                    <MyCourses courseList={courses}/>
                    <MyCourseLessons courseList={courses}/>
                    */}

                    <NewCoursePageContent
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                        courseList={courses}
                    />

                    <MyCourseLessonsContent
                        courseList={courses}
                    />

                    <NewWaferCoursesContent/>

                    <NewFooter/>


                </div>

            )}
        </div>
    );
}


export default CoursesPage;
