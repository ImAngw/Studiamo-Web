import React from "react";
import { useTranslation } from 'react-i18next';
import billIcon from "../assets/icons/bill.png";
import timerIcon from "../assets/icons/timer.png";



function CourseCountsWafer({counts}) {
    const { t } = useTranslation();
    const strings = t("CourseCountsWafer", { returnObjects: true });
    return (
        <div>
            <div className="w-full max-w-5xl mx-auto">
                <h3 className=" text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                    {strings.priv_lessons}
                </h3>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-2 justify-items-center">

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={billIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:20}}><b>{counts.bill} €</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.gain}</p>
                    </div>

                    <div className="flex flex-col w-[110px] h-[160px] pt-3  text-center bg-white border-2 border-gray-600 rounded-lg shadow-lg dark:bg-gray-800">
                        <img src={timerIcon} alt="tutor icon" className="w-11 h-11 mx-auto"/>
                        <p className="text-sm pt-4 text-black dark:text-white m-0" style={{fontSize:18}}><b>{counts.hours}h:{counts.minutes}m</b></p>
                        <p className="leading-tight pt-1 dark:text-gray-400 m-0">{strings.lessons}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseCountsWafer;