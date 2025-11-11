import React from "react";
import AdminHeader from "../admin-components/AdminHeader";
import AllStudentsTable from "../admin-components/AllStudentsTable";

function StudentsPage() {

    return (
        <div>
            <AdminHeader
                name={"Area Studenti"}
                surname={""}
            />

            <AllStudentsTable/>
        </div>
    );
}


export default StudentsPage;