import React, {useState}  from 'react';
import Image from "react-bootstrap/Image";
import { useTranslation } from 'react-i18next';
import posIcon from '../assets/icons/placeholder.png'
import mailIcon from '../assets/icons/email.png'
import phoneIcon from '../assets/icons/telephone.png'
import instaIcon from '../assets/icons/instagram.png'
import imAngIcon from '../assets/icons/imagw-logo.png'
import whatsappIcon from '../assets/icons/whatsapp.png'
import img from '../assets/logo/logo.jpg';
import Modal from 'react-bootstrap/Modal';



function CustomFooter() {

    const { t } = useTranslation();
    const strings = t("Footer", { returnObjects: true });
    const policy = t("privacyPolicy", { returnObjects: true });

    const [show, setShow] = useState(false);
    const handleOpen = () => setShow(true);
    const handleClose = () => setShow(false);

    return (

        <div style={{paddingTop:50}}>
            <footer style={{borderTop: "1px solid", color: "black"}}>
                <div style={{
                    backgroundImage: `url('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    position: 'relative',
                }} className={'footer-style'}>

                    <div style={{position: "absolute", inset: 0, backgroundColor: "rgba(255,255,255,0.45)"}}/>

                    <h2 style={{paddingBottom: '25px', fontSize: '35px', position: 'relative', paddingTop: '15px'}}
                        className={"title-font"}>
                        {strings.contacts}
                    </h2>

                    <div style={{display: 'flex', flexDirection: 'row', paddingLeft: '15px', paddingBottom: '5x', position: 'relative'}}>
                        <Image style={{height: '25px', width: '25px'}} src={posIcon}/>
                        <p className={'main-font'} style={{paddingLeft: '20px', fontSize: '17px'}}>{strings.first_address}</p>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', paddingLeft: '15px', paddingBottom: '5px', position: 'relative'}}>
                        <Image style={{height: '25px', width: '25px'}} src={posIcon}/>
                        <p className={'main-font'} style={{paddingLeft: '20px', fontSize: '17px'}}>{strings.second_address}</p>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', paddingLeft: '15px', paddingBottom: '5px', position: 'relative'}}>
                        <Image style={{height: '25px', width: '25px'}} src={mailIcon}/>
                        <p className={'main-font'} style={{paddingLeft: '20px', fontSize: '17px'}}>{strings.email}</p>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row', paddingLeft: '15px', paddingBottom: '5px', position: 'relative'}}>
                        <Image style={{height: '20px', width: '25px'}} src={phoneIcon}/>
                        <p className={'main-font'} style={{paddingLeft: '20px', fontSize: '17px'}}>{strings.phone}</p>
                    </div>

                    <h2 style={{paddingBottom: '5px', fontSize: '35px', position: 'relative', paddingTop:15}} className={"title-font"}>
                        {strings.social}
                    </h2>

                    <div style={{display: 'flex', alignItems: 'center', alignContent: 'center', paddingLeft: '15px', paddingBottom: '25px', position: 'relative'}}>

                        <a href="https://www.instagram.com/studi_amo_/" target="_blank"
                           rel="noopener noreferrer">
                            <img
                                style={{height: '26px', width: '35px', paddingRight: '10px', cursor: 'pointer'}}
                                src={instaIcon}
                                alt="Instagram"
                            />
                        </a>

                        <a href="https://wa.me/3892494117" target="_blank"
                           rel="noopener noreferrer">
                            <img
                                style={{height: '28px', width: '40px', paddingRight: '10px', cursor: 'pointer'}}
                                src={whatsappIcon}
                                alt="Instagram"
                            />
                        </a>
                    </div>

                    <div>
                        <button
                            onClick={handleOpen}
                            style={{
                                position: 'relative',
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                                backgroundColor: "transparent",
                                fontSize: '18px',
                                paddingBottom: '35px',
                                color:'black'
                            }}
                            className={'title-font'}
                        >
                            privacy policy
                        </button>

                        <Modal show={show} onHide={handleClose} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Privacy Policy</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <p style={{paddingBottom: '10px'}}>{policy.lastUpdate}</p>
                                <p style={{paddingBottom: '10px'}}>{policy.intro}</p>
                                <p style={{paddingBottom: '10px'}}><b>{policy.sections[0].heading}</b></p>
                                <p>{policy.sections[0].content0}<br />
                                    {policy.sections[0].content1}
                                </p>

                                <p style={{paddingBottom: '10px'}}><b>{policy.sections[1].heading}</b></p>
                                <p>{policy.sections[1].content0}<br />
                                    {policy.sections[1].content1}<br />
                                    {policy.sections[1].content2}<br />
                                    {policy.sections[1].content3}<br />
                                    {policy.sections[1].content4}
                                </p>

                                <p style={{paddingBottom: '10px'}}><b>{policy.sections[2].heading}</b></p>
                                <p><b>{policy.sections[2].subsections[0].subheading}</b><br />
                                    {policy.sections[2].subsections[0].content}
                                </p>

                                <p><b>{policy.sections[2].subsections[1].subheading}</b><br />
                                    {policy.sections[2].subsections[1].content}
                                </p>

                                <p><b>{policy.sections[2].subsections[2].subheading}</b><br />
                                    {policy.sections[2].subsections[2].content}
                                </p>

                                <p style={{paddingBottom: '10px'}}><b>{policy.sections[3].heading}</b></p>
                                <p>{policy.sections[3].content}</p>

                                <p style={{paddingBottom: '10px'}}><b>{policy.sections[4].heading}</b></p>
                                <p>{policy.sections[4].content}</p>
                            </Modal.Body>

                        </Modal>
                    </div>
                </div>

                <div
                    style={{
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        display: 'flex',
                        flexDirection: 'row',       // elementi affiancati
                        justifyContent: 'center',   // centra orizzontalmente
                        alignItems: 'center',       // centra verticalmente
                        gap: '5px'                  // spazio tra testo e immagine
                    }}
                >
                    <p style={{ margin: 0, fontSize:11}}>{strings.powered_by}</p>
                    <img src={imAngIcon} alt="Image" style={{ height: '40px', width: '40px' }} />
                </div>
            </footer>
        </div>


    );
}

export default CustomFooter;