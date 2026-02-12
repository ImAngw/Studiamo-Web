import {Carousel} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import {useTranslation} from "react-i18next";
import homeworkIcon from "../assets/icons/homework.png";
import teachIcon from "../assets/icons/teacher.png";
import puzzleIcon from "../assets/icons/puzzle.png";
import engBookIcon from "../assets/icons/eng_book.png";
import paintIcon from "../assets/icons/paint.png";
import placeIcon from "../assets/icons/placeholder.png";
import {useEffect, useState} from "react";
import {getBucketImages} from "../supabase/DBFunctions";

export default function HomeContent() {
    const { t } = useTranslation();
    const header_strings = t("OffCanvas", { returnObjects: true });
    const strings = t("Home", { returnObjects: true });

    const [slides, setSlides] = useState([]);
    useEffect(() => {
        async function loadImages() {
            const imgs = await getBucketImages();
            setSlides(imgs);
        }
        loadImages();
    }, []);



    return (
        <div className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
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
                            <path d="M100 200V.5M.5 .5H200" fill="none" />
                        </pattern>
                    </defs>
                    <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                        <path
                            d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                            strokeWidth={0}
                        />
                    </svg>
                    <rect fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" width="100%" height="100%" strokeWidth={0} />
                </svg>
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
                <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="lg:max-w-lg">
                            <p className="text-base/7 font-semibold text-indigo-600">{header_strings.home}</p>
                            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                                {strings.title1}
                            </h1>
                            <p className="mt-6 text-xl/8 text-gray-700">
                                {strings.par1_1}
                            </p>
                        </div>
                    </div>
                </div>


                <div className="-mt-12 lg:p-14 lg:-ml-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
                    <Carousel
                        style={{maxWidth: '700px', maxHeight:'650px', alignContent: 'center'}}>
                        {slides.map((slide, index) => (
                            <Carousel.Item key={index}>
                                <Image style={{
                                    width: '100%',
                                    height: '70%',
                                }} src={slide.url} fluid className='rounded-0'/>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </div>

                <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
                    <div className="lg:pr-4">
                        <div className="w-full text-base/7 text-gray-600">
                            <p>
                                {strings.par2_1}
                            </p>

                            <p>
                                {strings.par2_2}
                            </p>

                            <ul role="list" className="mt-8 space-y-8 text-gray-600">
                                <li className="flex gap-x-3">
                                    <img src={homeworkIcon} style={{height:40, width:40}} alt={"homework"}/>
                                    <span>
                                        <strong className="font-semibold text-gray-900">{strings.activity1} </strong>
                                        {strings.desc_act1}
                                    </span>
                                </li>

                                <li className="flex gap-x-3">
                                    <img src={teachIcon} style={{height:40, width:40}} alt={"teacher"}/>
                                    <span>
                                        <strong className="font-semibold text-gray-900">{strings.activity2} </strong>
                                            {strings.desc_act2}
                                        </span>
                                </li>

                                <li className="flex gap-x-3">
                                    <img src={puzzleIcon} style={{height:40, width:40}} alt={"puzzle"}/>
                                    <span>
                                        <strong className="font-semibold text-gray-900">{strings.activity3}  </strong>
                                        {strings.desc_act3}
                                    </span>
                                </li>

                                <li className="flex gap-x-3">
                                    <img src={engBookIcon} style={{height:40, width:40}} alt={"english"}/>
                                    <span>
                                        <strong className="font-semibold text-gray-900">{strings.activity4} </strong>
                                        {strings.desc_act4}
                                    </span>
                                </li>

                                <li className="flex gap-x-3">
                                    <img src={paintIcon} style={{height:40, width:40}} alt={"art"}/>
                                    <span>
                                        <strong className="font-semibold text-gray-900">{strings.activity5} </strong>
                                        {strings.desc_act5}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 lg:col-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-1 lg:gap-x-8 lg:px-8">
                    <p className="mt-8">
                        {strings.par2_3}
                    </p>

                    <p>{strings.par2_4}</p>


                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con1} </strong>
                                {strings.desc_con1}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con2} </strong>
                                {strings.desc_con2}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con3} </strong>
                                {strings.desc_con3}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con4} </strong>
                                {strings.desc_con4}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con5} </strong>
                                {strings.desc_con5}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con6} </strong>
                                {strings.desc_con6}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <span>
                                <strong className="font-semibold text-gray-900">{strings.con7} </strong>
                                {strings.desc_con7}
                            </span>
                        </li>
                    </ul>



                    <div style={{height:30}}></div>
                    <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">{strings.title3}</h2>
                    <p className="mt-6">
                        {strings.par3_1} {strings.par3_2}
                    </p>

                    <ul role="list" className="mt-8 space-y-8 text-gray-600">
                        <li className="flex gap-x-3">
                            <img src={placeIcon} style={{height:25, width:25}} alt={"placeholder1"}/>
                            <span>
                                {strings.first_addr}
                            </span>
                        </li>

                        <li className="flex gap-x-3">
                            <img src={placeIcon} style={{height:25, width:25}} alt={"placeholder2"}/>
                            <span>
                                {strings.second_addr}
                            </span>
                        </li>
                    </ul>
                    <p>{strings.par3_3}</p>
                    <p>{strings.par4_1}</p>
                </div>

            </div>
        </div>
    )
}
