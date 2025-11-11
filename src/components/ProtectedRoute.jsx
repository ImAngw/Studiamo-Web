import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import {supabase} from "../supabase/supabaseClient";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)

    useEffect(() => {
        // Recupera la sessione attuale
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setLoading(false)
        })

        // Ascolta cambiamenti (es. login/logout)
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    if (loading) return null

    if (!session) return <Navigate to="/tutor_page" replace />

    return children
}



