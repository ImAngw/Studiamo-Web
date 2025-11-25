import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {login, maintainLogin} from "../supabase/LogFunctions";
import {supabase} from "../supabase/supabaseClient";






function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();
    const { t } = useTranslation();
    const strings = t("TutorPage", { returnObjects: true });


    const handleSubmit = async (e) => {
        e.preventDefault(); // evita il refresh della pagina
        setLoading(true)
        setError('')

        await login({username, password}, navigate, setError, setLoading)
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
        <div className="d-flex justify-content-center align-items-center" style={{paddingBottom:70, paddingTop:30}}>
            <div className="card p-4 shadow" style={{ width: "95%", borderRadius: "10px"}}>
                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-3 main-font">
                        <label htmlFor="username" className="form-label">
                            <b>Username</b>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={strings.username}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3 main-font">
                        <label htmlFor="password" className="form-label">
                            <b>Password</b>
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={strings.password}
                            required
                            autoComplete="username"
                        />
                    </div>

                    {/* Bottone */}
                    <button type="submit" className="btn btn-primary w-100">
                        {strings.login}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;