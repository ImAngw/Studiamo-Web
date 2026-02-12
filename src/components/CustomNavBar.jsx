import React, {useContext} from 'react';
import CustomOffCanvas  from './CustomOffCanvas';
import {WindowSizeContext} from "../context/Context";



function CustomNavBar() {
    const { width, height } = useContext(WindowSizeContext);

    return (

        <div
            style={{height: 100, width: width, display: 'flex', position: 'relative', alignItems: 'center'}}
            className={'custom-navbar'}
        >
            <div style={{ position: 'absolute', left: '0%', top: '50%' }}>
                <CustomOffCanvas/>
            </div>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <img
                    style={{height: 250, width: 280}}
                    src={"https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo_str.png"}
                    alt={"Logo"}
                />
            </div>

        </div>


    );
}

export default CustomNavBar;