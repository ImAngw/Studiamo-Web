import React from "react";
import SecretHeader from "../secret-components/SecretHeader";
import MyStudents from "../secret-components/MyStudents";
import MyLessons from "../secret-components/MyLessons";

import {useUserData} from "../provider/AppDataContext";
import {useTutorData} from "../provider/AppTutorContext";

import NewSecretHeader from "../secret-components/NewSecretHeader";
import MyStudentsPageContent from "../secret-components/MyStudentsPageContent";
import MyLessonsContent from "../secret-components/MyLessonsContent";
import NewWaferContent from "../secret-components/NewWaferContent";
import NewFooter from "../components/NewFooter";
import ScrollToTop from "../admin-components/ScrollToTop";




function TutorDashboard() {
    const {profile} = useUserData()
    const {students, lessonTypes, lessonFormats} = useTutorData()

    /*
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
     */

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
                        pageName={"TutorDash"}
                    />

                    <MyStudents studentsList={students}/>

                    <MyLessons
                        studentsList={students}
                        lessonTypes={lessonTypes}
                        lessonFormats={lessonFormats}
                    />


                    */}



                    <MyStudentsPageContent
                        name={profile.tutor_name}
                        surname={profile.tutor_surname}
                        studentList={students}
                    />


                    <MyLessonsContent
                        studentsList={students}
                        lessonTypes={lessonTypes}
                        lessonFormats={lessonFormats}
                    />

                    <NewWaferContent/>

                    <NewFooter/>
                </div>

            )}
        </div>
    );
}


export default TutorDashboard;