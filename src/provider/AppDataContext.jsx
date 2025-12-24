import React, { createContext, useContext, useEffect, useState } from "react";
import {getTutorProfile} from "../supabase/DBFunctions";


const AppUserContext = createContext({});

export function AppUserProvider({ children }) {
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        async function loadData() {
            setProfile(await getTutorProfile());
        }
        loadData();
    }, []); // <-- viene eseguito SOLO UNA VOLTA


    return (
        <AppUserContext.Provider value={{profile}}>
            {children}
        </AppUserContext.Provider>
    );
}

export function useUserData() {
    return useContext(AppUserContext);
}

