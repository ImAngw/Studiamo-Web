'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    Popover,
    PopoverButton,
    PopoverGroup,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import {useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {logout} from "../supabase/LogFunctions";
import { useLocation } from "react-router-dom";




export default function NewAdminHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const navigate = useNavigate();
    const { t } = useTranslation();
    const strings = t("AdminOffCanvas", { returnObjects: true });

    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const location = useLocation();

    // reset quando cambia pagina
    useEffect(() => {
        setShowHeader(true);
        lastScrollY.current = window.scrollY;
    }, [location]);

    useEffect(() => {

        const handleScroll = () => {

            const currentScrollY = window.scrollY;

            // sempre visibile in alto
            if (currentScrollY < 10) {
                setShowHeader(true);
            }
            else if (currentScrollY < lastScrollY.current) {
                // scroll su
                setShowHeader(true);
            }
            else {
                // scroll giù
                setShowHeader(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };

    }, []);


    return (
        <header className={`fixed top-0 left-0 w-full bg-white z-[100] transition-transform duration-300 ${
            showHeader ? "translate-y-0" : "-translate-y-full"
        }`}>
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8" style={{height: '80px'}}>
                <div className="flex lg:flex-1">
                    <img
                        alt=""
                        src="https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo_str.png"
                        style={{width: '150px'}}
                    />
                </div>

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon aria-hidden="true" className="size-6" />
                    </button>
                </div>

                <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                    <Popover className="relative">
                        <PopoverButton
                            className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900"
                            onClick={() => {
                                navigate(("/admin_home"))
                                window.scrollTo(0, 0);
                            }}
                        >
                            {strings.general}
                        </PopoverButton>
                    </Popover>

                    <Popover className="relative">
                        <PopoverButton
                            className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900"
                            onClick={() => {
                                navigate(("/admin_tutor_page"))
                                window.scrollTo(0, 0);
                            }}
                        >
                            {strings.tutor}
                        </PopoverButton>
                    </Popover>

                    <Popover className="relative">
                        <PopoverButton
                            className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900"
                            onClick={() => {
                                navigate(("/students_page"))
                                window.scrollTo(0, 0);
                            }}
                        >
                            {strings.students}
                        </PopoverButton>
                    </Popover>

                    <Popover className="relative">
                        <PopoverButton
                            className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900"
                            onClick={() => {
                                navigate(("/admin_course_page"))
                                window.scrollTo(0, 0);
                            }}
                        >
                            {strings.courses}
                        </PopoverButton>
                    </Popover>


                </PopoverGroup>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a
                        href="#"
                        className="text-sm/6 font-semibold text-gray-900"
                        onClick={() => {
                            logout(navigate)
                            window.scrollTo(0, 0);
                        }}
                    >
                        Log out <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>



            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full bg-white px-6 lg:px-8 sm:max-w-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between" style={{height: '80px'}}>
                        <img
                            alt=""
                            src="https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo_str.png"
                            style={{width: '150px'}}
                        />

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                    </div>

                    <div className="mt-6 flow-root">
                        <div className="-my-6 divide-y divide-gray-500/10">
                            <div>
                                <Disclosure as="div" className="-mx-3 border-b border-gray-200">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => {
                                            navigate(("/admin_home"))
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        {strings.general}
                                    </DisclosureButton>
                                </Disclosure>

                                <Disclosure as="div" className="-mx-3 border-b border-gray-200">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => {
                                            navigate(("/admin_tutor_page"))
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        {strings.tutor}
                                    </DisclosureButton>
                                </Disclosure>

                                <Disclosure as="div" className="-mx-3 border-b border-gray-200">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => {
                                            navigate(("/students_page"))
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        {strings.students}
                                    </DisclosureButton>
                                </Disclosure>

                                <Disclosure as="div" className="-mx-3 border-b border-gray-200">
                                    <DisclosureButton
                                        className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                        onClick={() => {
                                            navigate(("/admin_course_page"))
                                            window.scrollTo(0, 0);
                                        }}
                                    >
                                        {strings.courses}
                                    </DisclosureButton>
                                </Disclosure>
                            </div>

                            <div style={{paddingTop:"50px"}}>
                                <a
                                    href="#"
                                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                                    onClick={() => {
                                        logout(navigate)
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Log out
                                </a>
                            </div>
                        </div>
                    </div>
                </DialogPanel>
            </Dialog>
        </header>
    )
}