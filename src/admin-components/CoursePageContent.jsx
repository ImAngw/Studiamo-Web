import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useAdminData} from "../provider/AppAdminContext";
import {ButtonWithIcon} from "../components/CustomButtons";
import arrowIcon from "../assets/icons/arrow.png";
import {addStudentMonthResume, removeStudentMonthResume, getStudentOfTheCourses, getTutorOfTheCourses} from "../supabase/DBAdminFunctions";
import folderIcon from "../assets/icons/empty-folder.png";


function AllCourses({strings, courses, setIsOpen, setCourseId, setCourseName}) {
    return(
        <div>
            <div style={{paddingTop:20, display: 'flex', flexDirection:'column', alignItems:'center', gap:10}}>
                <div
                    style={{
                        height: '385px',   // <- altezza fissa
                        width: '100%',
                        overflowY: 'auto',    // <- scroll verticale se troppe righe
                        border: '1px solid #ccc', // opzionale, per vedere il bordo
                        borderRadius: '8px'
                    }}
                >
                    <table className="w-full text-sm table-fixed">
                        <thead className="sticky top-0 w-full bg-[#E9E1CD] z-10 text-xs uppercase tracking-wide text-gray-700">
                        <tr>
                            <th className="w-8 px-2 py-3 text-left"> </th>
                            <th className="w-56 px-2 py-3 text-sm table-fixed">{strings.course}</th>
                            <th className="w-16 px-2 py-3 text-sm table-fixed"></th>

                        </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                        {courses && (courses.map((course, index) => (
                            <tr
                                key={index}
                                className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                            >
                                <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                                <td className="px-2 py-3" >{course.name}</td>
                                <td className="px-2 py-3" >
                                    <ButtonWithIcon
                                        action={() => {
                                            setCourseId(course.id_course);
                                            setCourseName(course.name);
                                            setIsOpen(true);
                                        }}
                                        icon={arrowIcon}
                                    />
                                </td>
                            </tr>)
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}


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
        <div style={{paddingTop:30, paddingBottom:40, display: 'flex', flexDirection:'column', gap:10}}>
            <h1 style={{fontSize: 24}}> {courseName ?? strings.select_course}</h1>
            <div style={{
                height: '600px',   // <- altezza fissa
                width: '100%',
                overflowY: 'auto',    // <- scroll verticale se troppe righe
                border: '1px solid #ccc', // opzionale, per vedere il bordo
                borderRadius: '8px',
                backgroundColor: 'white'
            }}>
                <table className="w-full text-sm table-fixed">
                    <thead className="sticky top-0 w-full bg-[#E9E1CD] z-10 text-xs uppercase tracking-wide text-gray-700">
                    <tr>
                        <th className="w-8 px-2 py-3 text-left"> </th>
                        {/*<th  style={{fontSize: '14px', width:'5px', position: 'sticky', top: 0, background: '#fff', zIndex: 1, backgroundColor:"gold"}}>{strings.role}</th>*/}
                        <th  className="w-56 px-2 py-3 text-sm table-fixed">{strings.name}</th>
                        <th  className="w-32 px-2 py-3 text-sm table-fixed"></th>
                        <th  className="w-24 px-2 py-3 text-sm table-fixed"> </th>
                    </tr>
                    </thead>



                    <tbody className="divide-y divide-gray-100">

                    <tr key={1000}>
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}>{" "}</td>
                        {/*<td className={'main-font'} style={{fontSize: '15px'}}></td>*/}
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}><b>{strings.tutor}</b></td>
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}></td>
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}></td>

                    </tr>
                    {tutors && (tutors.map((tutor, index) => (
                        <tr
                            key={index + 1}
                            className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                        >
                            <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                            {/*<td className={'main-font'} style={{fontSize: '8px', color:'orange'}}>{strings.tutor}</td>*/}
                            <td className="px-2 py-3">{tutor.tutor_surname + " " + tutor.tutor_name}</td>
                            <td className="px-2 py-3">{String(tutor.tutor_price) + " " + strings.tutor_price}</td>
                            <td className="px-2 py-3"></td>

                        </tr>)
                    ))}

                    <tr key={tutors.length}>
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}>{" "}</td>
                        {/*<td className={'main-font'} style={{fontSize: '15px'}}></td>*/}
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}><b>{strings.student}</b></td>
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}></td>
                        <td className="px-2 py-1" style={{backgroundColor:"#9BCECF"}}></td>

                    </tr>

                    {students && (students.map((student, index) => (
                        <tr
                            key={index + 1 + tutors.length}
                            className={`transition-colors hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}
                        >
                            <td className="px-2 py-3" style={{fontSize:7, color:"green"}}>{index + 1}</td>
                            {/*<td className={'main-font'} style={{fontSize: '8px', color:'blue'}}>{strings.student}</td>*/}
                            <td className="px-2 py-3">{student.stud_surname + " " + student.stud_name}</td>
                            <td className="px-2 py-3">{String(student.month_price) + " " + strings.stud_price}</td>

                            <td className="px-2 py-3">

                                <label className="relative inline-block w-14 h-8 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={student.has_resume}
                                        onChange={async (e) =>{
                                            if(!student.has_resume) {
                                                await addStudentMonthResume(
                                                    course_id,
                                                    student.stud_id,
                                                    Number(today.getMonth()) + 1,
                                                    Number(today.getFullYear()),
                                                    student.month_price
                                                );
                                            } else {
                                                await removeStudentMonthResume(
                                                    course_id,
                                                    student.stud_id,
                                                    Number(today.getMonth()) + 1,
                                                    Number(today.getFullYear()),
                                                )
                                            }

                                            setNewQuoteAdded(prev => !prev);
                                            // alert(strings.success);

                                            setStudents(prev =>
                                                prev.map(s =>
                                                    s.stud_id === student.stud_id
                                                        ? { ...s, has_resume: !student.has_resume}
                                                        : s
                                                )
                                            );

                                        }}
                                    />

                                    {/* background */}
                                    <div className="w-full h-full bg-gray-300 rounded-full transition-colors peer-checked:bg-green-500" />
                                    {/* pallino */}
                                    <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all duration-200 peer-checked:left-7">

                                        {/* X icon */}
                                        <svg
                                            className={`w-4 h-4 text-gray-600 ${student.has_resume? "hidden" : "block"}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                        </svg>

                                        {/* Check icon */}
                                        <svg
                                            className={`w-4 h-4 text-green-600 ${student.has_resume? "block" : "hidden"}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                        </svg>

                                    </div>
                                </label>

                                {/*

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
                                */}
                            </td>


                        </tr>)
                    ))}
                    </tbody>
                </table>
            </div>




        </div>
    );
}




export default function CoursePageContent() {
    const {t} = useTranslation();
    const strings = t("AdminAllCourses", { returnObjects: true });

    const [isOpen, setIsOpen] = useState(true);

    const [course_id, setCourseId] = useState(null);
    const [courseName, setCourseName] = useState(null);

    const {courses} = useAdminData()




    return (
        <div>
            <div className="relative isolate overflow-hidden bg-white px-6 py-1 sm:py-2 lg:overflow-visible lg:px-0">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <svg
                        aria-hidden="true"
                        className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200"
                    >
                        <defs>
                            <pattern
                                x="50%"
                                y={-1}
                                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                                width={200}
                                height={200}
                                patternUnits="userSpaceOnUse"
                            >
                                <path d="M100 200V.5M.5 .5H200" fill="none"/>
                            </pattern>
                        </defs>
                        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                            <path
                                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                                strokeWidth={0}
                            />
                        </svg>
                        <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%"
                              strokeWidth={0}/>
                    </svg>
                </div>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="lg:max-w-lg">
                                <div className="flex gap-14">
                                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                        {strings.title}
                                    </h1>

                                </div>
                                <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg" style={{paddingBottom: 30}}>
                                    <p>
                                        {strings.par}
                                    </p>

                                    <AllCourses
                                        strings={strings}
                                        courses={courses}
                                        setIsOpen={setIsOpen}
                                        setCourseId={setCourseId}
                                        setCourseName={setCourseName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="-mt-12 lg:p-14 lg:-ml-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
                    >
                        {course_id ? (
                            <CourseInfo
                                course_id={course_id}
                                courseName={courseName}
                                strings={strings}
                            />
                        ): (
                            <div className="lg:h-[718px] h-[400px] lg:pt-[150px]">
                                <div style={{
                                    height: '350px',   // <- altezza fissa
                                    overflowY: 'auto',    // <- scroll verticale se troppe righe
                                    backgroundImage:`url(${folderIcon})`,
                                    backgroundSize: '240px',        // copre tutto il div
                                    backgroundPosition: 'center',   // centrata
                                    backgroundRepeat: 'no-repeat',
                                    justifyContent: 'center',
                                }}>
                                </div>

                            </div>
                            )
                        }

                    </div>
                </div>
            </div>
        </div>

    )
}