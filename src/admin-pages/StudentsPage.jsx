import React from "react";
import AdminHeader from "../admin-components/AdminHeader";
import AllStudentsTable from "../admin-components/AllStudentsTable";
import NewAdminHeader from "../admin-components/NewAdminHeader";
import StudentPageContent from "../admin-components/StudentPageContent";
import ScrollToTop from "../admin-components/ScrollToTop";


function StudentsPage() {

    return (
        <div className="pt-[80px]">
            <ScrollToTop/>
            <NewAdminHeader/>
            <StudentPageContent/>
            {/*
            <AdminHeader
                name={"Area Studenti"}
                surname={""}
            />
            <AllStudentsTable/>
            */}



        </div>
    );
}


export default StudentsPage;