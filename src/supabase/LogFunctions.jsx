import {supabase} from "./supabaseClient";


export async function logout(navigate) {
    const { error } = await supabase.auth.signOut()

    if (error) {
        alert(error.message)
        console.error('Errore logout:', error)
        return false
    } else {
        navigate('/tutor_page')
        return true
    }
}


export async function maintainLogin(user, navigate) {
    const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('uid', user.id)
        .single()

    if (userInfo.role === 4) {
        navigate('/admin_tutor_page', { state: { user } })
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

    setLoading(false)

    if (error) {
        setError(error.message)
        alert(error.message)
        return null
    }

    // Se il login va bene, otteniamo l'id dell'utente
    const user = data.user

    const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('uid', user.id)
        .single()


    if (userError) {
        setError(userError.message)
        alert(userError.message)
        return null
    }

    if (userInfo.role === 4) {
        navigate('/admin_tutor_page', { state: { user } })
    } else {
        navigate('/tutor_dashboard', { state: { user } })
    }

    window.scrollTo(0, 0)
    return user




}