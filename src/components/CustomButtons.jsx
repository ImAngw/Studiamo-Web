import React from 'react';
import Image from "react-bootstrap/Image";

import {supabase} from "../supabase/supabaseClient";
import { useNavigate } from 'react-router-dom'



export function ButtonWithIcon({action, icon}) {
    return (
        <div>
            <button
                onClick={action}
                style={{
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    padding: 0,
                }}
            >
                <Image style={{height: '30px', width: '30px'}} src={icon}/>
            </button>
        </div>
    );
}


export function ButtonWithText({action, text}) {
    return (
        <div>
            <button
                onClick={action}
                style={{
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                    padding: 0,
                }}
            >
                <p className={'main-font'} style={{fontSize: '30px', textAlign: 'center'}}>{text}</p>
            </button>
        </div>
    );
}
