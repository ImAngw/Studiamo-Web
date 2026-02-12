import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {ButtonWithIcon} from "../components/CustomButtons";
import downloadIcon from '../assets/icons/download.png'
import {generateAllTutorReport} from "../pdf-functions/PdfGenerator";
import TutorTableCounts from "./TutorTableCounts";








export default function TutorTableContent({activeTutors, firstData, lastData, allowedCounts, setTutorOffset, totPages, currentPage, setCurrentPage}) {
    const {t} = useTranslation();
    const strings = t("TutorTableCounts", { returnObjects: true });



    return (
        <div>
            <div className="relative isolate overflow-hidden bg-white px-6 py-1 sm:py-2 lg:overflow-visible lg:px-0">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <svg
                        aria-hidden="true"
                        className="absolute top-0 left-[max(50%,25rem)] h-256 w-512 -translate-x-1/2 mask-[radial-gradient(64rem_64rem_at_top,white,transparent)] stroke-gray-200"
                    >
                        <defs>
                            <pattern
                                x="50%"
                                y={-1}
                                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                                width={200}
                                height={200}
                                patternUnits="userSpaceOnUse"
                            >
                                <path d="M100 200V.5M.5 .5H200" fill="none"/>
                            </pattern>
                        </defs>
                        <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                            <path
                                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                                strokeWidth={0}
                            />
                        </svg>
                        <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%"
                              strokeWidth={0}/>
                    </svg>
                </div>
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                    <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                        <div className="lg:pr-4">
                            <div className="lg:max-w-lg">
                                <div className="flex gap-14">
                                    <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                        {strings.active_tutors}
                                    </h1>
                                    <ButtonWithIcon
                                        icon={downloadIcon}
                                        action={async () => {
                                            const users = activeTutors.map(tutor => {
                                                return {
                                                    name: tutor.tutor_name,
                                                    surname: tutor.tutorn_surname,
                                                    hours: tutor.total_hours,
                                                    minutes: tutor.total_minutes,
                                                    gain: tutor.total_cost
                                                }
                                            });
                                            const pdfDoc = await generateAllTutorReport(users, firstData, lastData);
                                            // pdfDoc.download(`Resoconto Tutor dal ${firstData} al ${lastData}`)
                                            pdfDoc.save(`Resoconto Tutor dal ${firstData} al ${lastData}`)

                                        }}
                                    />

                                </div>
                                <div className="max-w-xl text-base/7 text-gray-600 lg:max-w-lg" style={{paddingBottom: 30}}>
                                    <p>
                                        {strings.par1}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="-mt-12 lg:p-14 lg:-ml-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden"
                    >
                        <TutorTableCounts
                            activeTutors={activeTutors}
                            firstData={firstData}
                            lastData={lastData}
                            allowedCounts={allowedCounts}
                            setTutorOffset={setTutorOffset}
                            totPages={totPages}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />

                    </div>
                </div>
            </div>
        </div>

    )
}