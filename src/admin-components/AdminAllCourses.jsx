import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {ButtonWithIcon} from "../components/CustomButtons";
import addButtonIcon from "../assets/icons/add-button.png";
import {useAdminData} from "../provider/AppAdminContext";
import infoIcon from "../assets/icons/info.png";
import {getStudentOfTheCourses, getTutorOfTheCourses, addStudentMonthResume} from "../supabase/DBAdminFunctions";



function CourseInfo({course_id, courseName, strings}) {
    const [students, setStudents] = useState([])
    const [tutors, setTutors] = useState([])
    const today = new Date();
    const {setNewQuoteAdded} = useAdminData()


    useEffect(() => {
        const fetchStudents = async () => {

            const stud = await getStudentOfTheCourses(
                course_id,
                Number(today.getMonth()) + 1,
                Number(today.getFullYear()),
            );
            setStudents(stud);

            const t = await getTutorOfTheCourses(course_id);
            setTutors(t);
        }
        fetchStudents();
    }, [course_id]);


    return (
        <div style={{paddingTop:30, display: 'flex', flexDirection:'column', alignItems:'center', gap:10}}>
            <h1 className={'title-font'} style={{fontSize: 30}}> {courseName}</h1>
            <div style={{
                height: '350px',   // <- altezza fissa
                width: '90%',
                overflowY: 'auto',    // <- scroll verticale se troppe righe
                border: '1px solid #ccc', // opzionale, per vedere il bordo
                borderRadius: '8px'
            }}>
                <table
                    className="table table-striped table-bordered table-hover"
                    style={{ tableLayout: 'fixed'}}
                >
                    <thead>
                    <tr>
                        <th className={'title-font'} style={{fontSize: '10px', width:'20px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                        <th className={'title-font'} style={{fontSize: '20px', width:'35px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.role}</th>
                        <th className={'title-font'} style={{fontSize: '20px', width:'120px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                        <th className={'title-font'} style={{fontSize: '20px', width:'40px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.price}</th>
                        <th className={'title-font'} style={{fontSize: '10px', width:'30px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>


                    </tr>
                    </thead>

                    <tbody>
                        {tutors && (tutors.map((tutor, index) => (
                            <tr key={index + 1}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>

                                <td className={'main-font'} style={{fontSize: '8px', color:'orange'}}>{strings.tutor}</td>
                                <td className={'main-font'} style={{fontSize: '10px'}}>{tutor.tutor_surname + " " + tutor.tutor_name}</td>
                                <td className={'main-font'} style={{fontSize: '10px'}}>{String(tutor.tutor_price) + " " + strings.tutor_price}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}></td>

                            </tr>)
                        ))}

                        <tr key={tutors.length} style={{height:30}} >
                            <td className={'main-font'} style={{fontSize: '15px'}}>{" "}</td>
                            <td className={'main-font'} style={{fontSize: '15px'}}></td>
                            <td className={'main-font'} style={{fontSize: '10px'}}></td>
                            <td className={'main-font'} style={{fontSize: '15px'}}></td>
                            <td className={'main-font'} style={{fontSize: '15px'}}></td>

                        </tr>

                        {students && (students.map((student, index) => (
                            <tr key={index + 1 + tutors.length}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '8px', color:'blue'}}>{strings.student}</td>
                                <td className={'main-font'} style={{fontSize: '10px'}}>{student.stud_surname + " " + student.stud_name}</td>
                                <td className={'main-font'} style={{fontSize: '10px'}}>{String(student.month_price) + " " + strings.stud_price}</td>

                                <td style={{ textAlign: 'center', verticalAlign: 'middle'}}>
                                    {!student.has_resume && (
                                        <ButtonWithIcon
                                            action={async () => {
                                                await addStudentMonthResume(
                                                    course_id,
                                                    student.stud_id,
                                                    Number(today.getMonth()) + 1,
                                                    Number(today.getFullYear()),
                                                    student.month_price
                                                );

                                                setNewQuoteAdded(prev => !prev);
                                                alert(strings.success);

                                                setStudents(prev =>
                                                    prev.map(s =>
                                                        s.stud_id === student.stud_id
                                                            ? { ...s, has_resume: true }
                                                            : s
                                                    )
                                                );
                                            }}
                                            icon={addButtonIcon}
                                        />
                                    )}
                                </td>


                            </tr>)
                        ))}
                    </tbody>
                </table>
            </div>




        </div>
    );
}




function AdminAllCourses() {
    const { t } = useTranslation();
    const strings = t("AdminAllCourses", { returnObjects: true });

    const [isOpen, setIsOpen] = useState(false);

    const [course_id, setCourseId] = useState(null);
    const [courseName, setCourseName] = useState('');

    const {courses} = useAdminData()



    return (
        <div>
            <div style={{paddingTop:20, display: 'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                <div style={{display: 'flex', flexDirection:'row', alignItems: 'center', gap:10, marginBottom:10}}>
                    <h1 className={'title-font'}> {strings.title}</h1>
                </div>


                <div
                    style={{
                        height: '250px',   // <- altezza fissa
                        width: '90%',
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px'
                    }}
                >
                    <table
                        className="table table-striped table-bordered table-hover"
                        style={{ tableLayout: 'fixed'}}
                    >
                        <thead>
                            <tr>
                                <th className={'title-font'} style={{fontSize: '10px', width:'40px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}> </th>
                                <th className={'title-font'} style={{fontSize: '20px', width:'200px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}>{strings.name}</th>
                                <th style={{fontSize: '20px', width:'50px', position: 'sticky', top: 0, background: '#fff', zIndex: 1}}></th>

                            </tr>
                        </thead>

                        <tbody>
                        {courses && (courses.map((course, index) => (
                            <tr key={index}>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{index + 1}</td>
                                <td className={'main-font'} style={{fontSize: '15px'}}>{course.name}</td>
                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                    <ButtonWithIcon
                                        action={() => {
                                            setCourseId(course.id_course);
                                            setCourseName(course.name);
                                            setIsOpen(true);
                                        }}
                                        icon={infoIcon}
                                    />
                                </td>
                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>


                {isOpen && (
                    <CourseInfo
                        course_id={course_id}
                        courseName={courseName}
                        strings={strings}
                    />
                )}


            </div>
        </div>
    );
}


export default AdminAllCourses;
