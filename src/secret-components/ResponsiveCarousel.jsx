import React, { useState, useRef } from "react";
import gradIcon from "../assets/icons/graduated.png";
import teachIcon from "../assets/icons/teaching.png";
import folderIcon from "../assets/icons/empty-folder.png";

export default function ResponsiveCarousel({ items = [], initialActive = 0, areStudents = true}) {
    const [active, setActive] = useState(initialActive);
    const [isAnimating, setIsAnimating] = useState(false);

    const touchStartX = useRef(0);
    const touchStartTime = useRef(0);
    const dragX = useRef(0);
    const isDragging = useRef(false);

    // =========================
    // Touch / Drag Handlers
    // =========================
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartTime.current = performance.now();
        dragX.current = 0;
        isDragging.current = true;
    };

    const handleTouchEnd = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;

        // Reset transform visiva
        document.querySelector(".carousel-track").style.transform = "";

        const endX = e.changedTouches[0].clientX;
        const endTime = performance.now();

        const distance = touchStartX.current - endX;
        const time = endTime - touchStartTime.current;

        const absDistance = Math.abs(distance);
        const velocity = absDistance / time; // px/ms

        // Decidi quante cards muovere
        let cardsToMove = Math.max(1, Math.round(absDistance / 150)); // distanza base
        if (velocity > 0.8) cardsToMove = Math.max(cardsToMove, 2);
        if (velocity > 1.2) cardsToMove = Math.max(cardsToMove, 3);

        if (distance > 30) moveRight(cardsToMove);
        else if (distance < -30) moveLeft(cardsToMove);
    };

    // =========================
    // Animazione Step-By-Step
    // =========================
    const animateMove = (direction, steps) => {
        if (isAnimating) return;

        setIsAnimating(true);
        let count = 0;

        const interval = setInterval(() => {
            setActive((prev) => {
                if (direction === "right") {
                    return Math.min(prev + 1, items.length - 1);
                } else {
                    return Math.max(prev - 1, 0);
                }
            });

            count++;
            if (
                count >= steps ||
                (direction === "right" && active >= items.length - 1) ||
                (direction === "left" && active <= 0)
            ){
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 120); // velocità animazione, modifica per più veloce/lento
    };

    const moveRight = (steps = 1) => {
        if (active >= items.length - 1) return;
        animateMove("right", steps);
    };

    const moveLeft = (steps = 1) => {
        if (active <= 0) return;
        animateMove("left", steps);
    };

    // =========================
    // Genera card visibili
    // =========================
    const generateItems = () => {
        const visible = [];
        let j = 1;

        for (let i = -1; i <= 1; i++) {
            const index = active + i;

            if (index < 0 || index >= items.length) continue;

            const level = -i;

            if (areStudents) {
                visible.push(
                    <StudItem
                        key={index}
                        content={items[index]}
                        level={level}
                        index={index + 1}
                        totItems={items.length}
                    />
                );
            } else {
                visible.push(
                    <CourseItem
                        key={index}
                        content={items[index]}
                        level={level}
                        index={index + 1}
                        totItems={items.length}
                    />
                );
            }
            j++;
        }

        return visible;
    };

    return (
        <div className="carousel-container">
            <button
                className="arrow left"
                onClick={() => moveLeft(1)}
                disabled={active === 0}
            >
                ‹
            </button>

            {items.length > 0 ? (
                <div
                    className="carousel-track"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {generateItems()}
                </div>
            ) : (
                <div className="carousel-track">
                    <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                        <img src={folderIcon} alt="folder" className="w-42 h-42 md:w-42 md:h-42 lg:w-52 lg:h-52"/>
                        <p>Non segui {areStudents? "nessuno studente" : "nessun corso"} attualmente!</p>
                    </div>
                </div>
            )}




            <button
                className="arrow right"
                onClick={() => moveRight(1)}
                disabled={active === items.length - 1}
            >
                ›
            </button>
        </div>
    );
}

// =========================
// Card Component
// =========================
function StudItem({ content, level, index, totItems}) {
    const colors = [
        "#FFB3BA",
        "#BAFFC9",
        "#BAE1FF",
        "#FFFFBA",
        "#FFD6A5",
        "#E0BBE4"
    ];

    const color = index
        ? colors[index % colors.length]
        : colors[0];

    return (
        <div className={`item level${level}`} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            padding: '10px',
            backgroundColor: color
        }}>
            <p style={{fontSize:9}}> {index} / {totItems} </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                alignSelf: 'center',
                gap: "15px"
            }}>
                <img src={gradIcon} alt="graduation-cap" className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16"/>
                <p>Studente</p>
            </div>



            <div className="mt-auto main-font pb-[10px]">
                <div style={{display:"flex", flexDirection:"column", paddingBottom:10}}>
                    <span style={{fontSize:9}}><b>Nome:</b></span>
                    <span style={{fontSize:16}}>{content?.student_surname}</span>
                </div>

                <div style={{display:"flex", flexDirection:"column"}}>
                    <span style={{fontSize:9}}><b>Cognome:</b></span>
                    <span style={{fontSize:16}}>{content?.student_name}</span>
                </div>
            </div>
        </div>
    );
}


function CourseItem({ content, level, index, totItems}) {
    const colors = [
        "#BAE1FF",
        "#E0BBE4",
        "#FFB3BA",
        "#FFD6A5",
        "#BAFFC9",
        "#FFFFBA",
    ];

    const color = index
        ? colors[index % colors.length]
        : colors[0];

    return (
        <div className={`item level${level}`} style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            alignItems: 'start',
            padding: '10px',
            backgroundColor: color
        }}>
            <p style={{fontSize:9}}> {index} / {totItems} </p>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                alignSelf: 'center',
                gap: "15px"
            }}>
                <img src={teachIcon} alt="graduation-cap" className="w-12 h-12 md:w-12 md:h-12 lg:w-16 lg:h-16"/>
                <p>Corso</p>
            </div>



            <div className="mt-auto main-font pb-[10px]">
                <div style={{display:"flex", flexDirection:"column", paddingBottom:10}}>
                    <span style={{fontSize:9}}><b>Nome:</b></span>
                    <span style={{fontSize:16}}>{content?.name}</span>
                </div>
            </div>
        </div>
    );
}

