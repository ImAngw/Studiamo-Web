import React, { useContext, useState, useEffect } from 'react';
import {WindowSizeContext} from "../context/Context";
import {useTranslation} from "react-i18next";
import Image from "react-bootstrap/Image";

import {Carousel} from "react-bootstrap";
import Header from "../components/Header";
import CustomFooter from "../components/CustomFooter";
import {getBucketImages} from "../supabase/DBFunctions";



function Home() {
    const { width, height } = useContext(WindowSizeContext);
    const { t } = useTranslation();
    const strings = t("Home", { returnObjects: true });

    const [slides, setSlides] = useState([]);
    useEffect(() => {
        async function loadImages() {
            const imgs = await getBucketImages();
            setSlides(imgs);
        }
        loadImages();
    }, []);


    let img;
    if (width < 500) {
        img = "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/cover-images/home-page/vertical.jpg";
    } else {
        img = "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/cover-images/home-page/horizontal.jpg";
    }


    return (
        <div className={'home-style'} style={{ overflowX: 'hidden' }}>
            <Header img={img}/>
            <div style={{paddingRight:15, paddingLeft:15}}>
                <h1 className={'title-font'}>{strings.title1}</h1>
                <p className={'main-font'}>{strings.par1_1}</p>
                <p className={'main-font'}>{strings.par1_2}</p>

                <h1 className={'title-font'} style={{paddingTop:20}}>{strings.title2}</h1>
                <p className={'main-font'}>{strings.par2_1}</p>

                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: width < 500 ? '30px' : '100px',
                        paddingBottom: '30px',
                        justifyContent: 'center',
                        paddingTop: '30px',
                        overflow: 'hidden'

                    }}
                >
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: '450px',
                        display: 'flex',
                        justifyContent: "center"
                    }}>
                        <Carousel
                            style={{maxWidth: '350px', maxHeight:'800px'}}>
                            {slides.map((slide, index) => (
                                <Carousel.Item key={index}>
                                    <Image style={{
                                        width: '100%',
                                        height: '650px',
                                    }} src={slide.url} fluid className='rounded-0'/>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>

                    <div style={{maxWidth: '500px', width:'100%', justifyContent: 'flex-start', alignContent: 'center', position: 'relative'}}>
                        <p className={'main-font'}>{strings.par2_2}</p>
                        <ul
                            className={'main-font'}
                            style={{paddingTop: '10px', paddingLeft: '20px',}}
                        >
                            <li>{strings.priv_les}</li>
                            <li>{strings.school_help}</li>
                            <li>{strings.spec_help}</li>
                            <li>{strings.psycho}</li>
                            <li>{strings.art}</li>
                            <li>{strings.activity_1}</li>
                        </ul>

                        <p className={'main-font'}>{strings.help}</p>

                        <ul
                            className={'main-font'}
                            style={{paddingTop: '10px', paddingLeft: '20px',}}
                        >
                            <li>{strings.con1}</li>
                            <li>{strings.con2}</li>
                            <li>{strings.con3}</li>
                            <li>{strings.con4}</li>
                            <li>{strings.con5}</li>
                            <li>{strings.con6}</li>
                            <li>{strings.con7}</li>
                        </ul>

                    </div>
                </div>


                <h1 className={'title-font'}>{strings.title3}</h1>
                <p className={'main-font'}>{strings.par3_1}</p>
                <p className={'main-font'}>{strings.par3_2}</p>

                <ul
                    className={'main-font'}
                    style={{paddingLeft: '20px',}}
                >
                    <li>{strings.first_addr}</li>
                    <li>{strings.second_addr}</li>
                </ul>

                <p className={'main-font'}>{strings.par3_3}</p>


                <h1 className={'title-font'} style={{paddingTop:20}}>{strings.title4}</h1>
                <p className={'main-font'}>{strings.par4_1}</p>

            </div>
            <CustomFooter/>
        </div>
    );
}

export default Home;
