import React from "react";
import AdminHeader from "../admin-components/AdminHeader";
import AdminAllCourses from "../admin-components/AdminAllCourses";
import NewAdminHeader from "../admin-components/NewAdminHeader";

import CoursePageContent from "../admin-components/CoursePageContent";
import NewFooter from "../components/NewFooter";
import ScrollToTop from "../admin-components/ScrollToTop";


function AdminCoursePage() {

    return (
        <div className="pt-[80px]">
            <ScrollToTop/>
            <NewAdminHeader/>
            <CoursePageContent/>
            <NewFooter/>
            {/*
            <AdminHeader
                name={"Doposcuola / Corsi"}
                surname={""}
            />

            <AdminAllCourses/>
            */}



        </div>
    );
}


export default AdminCoursePage;