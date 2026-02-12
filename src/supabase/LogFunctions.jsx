import {supabase} from "./supabaseClient";


export async function logout(navigate) {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error);
        return;
    }
    navigate("/tutor_page");
}


export async function maintainLogin(user, navigate) {
    const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('role, force_logout_after')
        .eq('uid', user.id)
        .single()

    // controlla se il token è stato emesso prima del logout forzato
    const session = await supabase.auth.getSession()

    const issuedAt = new Date(session.data.session.user.last_sign_in_at)
    const forceLogoutAfter = new Date(userInfo.force_logout_after)


    if (issuedAt < forceLogoutAfter) {
        await supabase.auth.signOut()
        navigate("/tutor_page")
        return
    }

    if (userInfo.role === 4) {
        navigate('/admin_home', { state: { user } })
    } else {
        navigate('/tutor_dashboard', { state: { user } })
    }
}


export async function login({ username, password }, navigate, setError, setLoading) {
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
        email: username.trim(),
        password: password.trim()
    })

    if (error) {
        setLoading(false)
        setError(error.message)
        // alert(error.message)
        return null
    }

    // Se il login va bene, otteniamo l'id dell'utente
    const user = data.user

    const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('role, is_banned')
        .eq('uid', user.id)
        .single()


    if (userError) {
        setLoading(false)
        setError(userError.message)
        //alert(userError.message)
        return null
    }

    // ✅ CONTROLLO BAN
    if (userInfo.is_banned) {
        console.log("BANNED")
        await supabase.auth.signOut()
        setLoading(false)
        setError("Your account has been suspended.")
        return null
    }

    setLoading(false)

    if (userInfo.role === 4) {
        navigate('/admin_home', { state: { user } })
    } else {
        navigate('/tutor_dashboard', { state: { user } })
    }

    window.scrollTo(0, 0)
    return user
}