import React from "react";
import AdminHeader from "../admin-components/AdminHeader";
import AdminAllCourses from "../admin-components/AdminAllCourses";


function AdminCoursePage() {

    return (
        <div>
            <AdminHeader
                name={"Doposcuola / Corsi"}
                surname={""}
            />

            <AdminAllCourses/>
        </div>
    );
}


export default AdminCoursePage;