import React, { useEffect, useState } from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import {supabase} from "../supabase/supabaseClient";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        let subscription = null;
        let listener = null;

        async function init() {
            const { data } = await supabase.auth.getSession();
            const sessionData = data?.session;

            if (!sessionData) {
                setLoading(false);
                return;
            }

            const topic = `user:${sessionData.user.id}:sessions`;


            setSession(sessionData);
            setUser(sessionData.user);
            setLoading(false);

            // (optional) ensure realtime auth
            try {
                if (sessionData.access_token && supabase.realtime?.setAuth) {
                    await supabase.realtime.setAuth(sessionData.access_token);
                }
            } catch (err) {
                console.warn('setAuth error', err);
            }

            subscription = supabase.channel(topic, { config: { private: true } })
                .on('broadcast', { event: 'force_logout' }, (payload) => {
                    // console.log('force_logout received', payload);
                    supabase.auth.signOut();
                    navigate("/tutor_page")
                });


            const { error } = await subscription.subscribe();
            if (error) console.error('Subscription error', error);
        }

        init();

        const authSub = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) setUser(session.user);
            else setUser(null);
        });

        listener = authSub?.data;

        return () => {
            try { listener?.subscription?.unsubscribe?.(); } catch (e) {}
            if (subscription) {
                try { subscription.unsubscribe?.(); } catch (e) {}
                try { supabase.removeChannel(subscription); } catch (e) {}
            }
        };
    }, []);


    /*

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

     */

    if (loading) return null

    if (!session) return <Navigate to="/tutor_page" replace />

    return children
}



