import React from "react";
import SecretHeader from "../secret-components/SecretHeader";
import MyStudents from "../secret-components/MyStudents";
import MyLessons from "../secret-components/MyLessons";

import {useUserData} from "../provider/AppDataContext";
import {useTutorData} from "../provider/AppTutorContext";




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
        <div>
            {profile && (
                <div>
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
                </div>

            )}
        </div>
    );
}


export default TutorDashboard;