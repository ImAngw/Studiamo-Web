import React from "react";
import {useTranslation} from "react-i18next";





const currentYear = new Date().getFullYear();

export default function NewFooter() {
    const { t } = useTranslation();
    const strings = t("Footer", { returnObjects: true });

    return (
        <footer className="w-full border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-6 py-6">
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">

                    {/* Social */}
                    <div className="flex gap-4">
                        <a href="https://www.instagram.com/studi_amo_/" target="_blank"
                           rel="noopener noreferrer">
                            <img
                                style={{height: '26px', width: '35px', paddingRight: '10px', cursor: 'pointer'}}
                                src={"src/assets/icons/black_instagram.png"}
                                alt="Instagram"
                            />
                        </a>

                        <a href="https://wa.me/3892494117" target="_blank"
                           rel="noopener noreferrer">
                            <img
                                style={{height: '28px', width: '40px', paddingRight: '10px', cursor: 'pointer'}}
                                src={"src/assets/icons/blacK_whatsapp.png"}
                                alt="Instagram"
                            />
                        </a>


                        <a
                            href="mailto:info@studiamo.it"
                            className="text-gray-500 hover:text-gray-700 transition"
                            aria-label="Email"
                        >
                            <img
                                style={{height: '28px', width: '40px', paddingRight: '10px', cursor: 'pointer'}}
                                src={"src/assets/icons/email.png"}
                                alt="Instagram"
                            />
                        </a>

                        <a
                            href="tel:+393892494117"
                            className="text-gray-500 hover:text-gray-700 transition"
                            aria-label="Telefono"
                        >
                            <img
                                style={{height: '28px', width: '40px', paddingRight: '10px', cursor: 'pointer'}}
                                src={"src/assets/icons/telephone.png"}
                                alt="Instagram"
                            />
                        </a>

                    </div>

                    {/* Copyright */}
                    <p className="text-sm text-gray-500 text-center">
                        © {currentYear} {strings.reserved}
                    </p>

                    {/* Developed by */}
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                        <p style={{ margin: 0, fontSize:12, paddingRight: '10px'}}>
                            {strings.powered_by}
                        </p>


                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-700 hover:underline"
                        >
                            <img
                                src={"https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/imagw-logo.png"}
                                alt="Image" style={{ height: '40px', width: '40px' }} />
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}