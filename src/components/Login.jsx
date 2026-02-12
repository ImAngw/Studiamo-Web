import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, Link} from "react-router-dom";
import {login, maintainLogin} from "../supabase/LogFunctions";
import {supabase} from "../supabase/supabaseClient";
import {FailAlert} from "./AlertComponents";






function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const strings = t("TutorPage", { returnObjects: true });
    const header_strings = t("OffCanvas", { returnObjects: true });


    const handleSubmit = async (e) => {
        e.preventDefault(); // evita il refresh della pagina
        setLoading(true)
        setError('')

        const user = await login({username, password}, navigate, setError, setLoading)
        if (user === null) {
            setShowAlert(true)
        }
    }

    useEffect(() => {
        async function checkAuth() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                console.log('No Log');
            } else {
                await maintainLogin(session.user, navigate)
            }
        }

        checkAuth();
    }, []);





    return (
        <div className="d-flex justify-content-center align-items-center" style={{paddingBottom:50, paddingTop:30}}>
            {showAlert &&
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Sfondo semi-trasparente */}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <FailAlert show={showAlert} onClose={() => setShowAlert(false)} text={error}/>
                </div>
            }

            <div className="card p-4 shadow" style={{ width: "100%", borderRadius: "7px"}}>
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-3 main-font w-full lg:w-4/5 lg:mx-auto">
                        <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900"
                               style={{paddingBottom: 10}}>
                            Username
                        </label>
                        <input
                            type="text"
                            className="form-control main-font"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={strings.username}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3 main-font w-full lg:w-4/5 lg:mx-auto">
                        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900"
                               style={{paddingBottom: 10}}>
                            Password
                        </label>
                        <input
                            type="password"
                            className="form-control main-font"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={strings.password}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Bottone */}
                    <div className="flex justify-center" style={{padding: 10}}>
                        <button
                            type="submit"
                            className="w-full lg:w-4/5 flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {strings.login}
                        </button>
                    </div>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        {strings.not_a_member} {""}
                        <Link
                            to="/join_us_page"
                            className="font-semibold text-indigo-400 hover:text-indigo-300"
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            {header_strings.join_us}
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default LoginPage;