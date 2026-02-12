import jsPDF from "jspdf";
import jsPDFAutoTable from "jspdf-autotable";




async function getBase64ImageFromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}




export async function generateStudentReport(user, firstDate, lastDate, lessons) {
    const doc = new jsPDF();

    // --- Logo 40x40 ---
    const logoDataUrl = await getBase64ImageFromUrl(
        "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png"
    );
    doc.addImage(logoDataUrl, "JPEG", 80, 10, 40, 40, undefined, "FAST");

    // --- Header ---
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
        "Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877",
        doc.internal.pageSize.getWidth() / 2,
        55, // spostato sotto il logo
        { align: "center" }
    );

    // --- Testo introduttivo ---
    const f_formatted = firstDate.split("-").reverse().join("-");
    const l_formatted = lastDate.split("-").reverse().join("-");

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
        `Si riportano le lezioni svolte da ${user.name} ${user.surname} dal ${f_formatted} al ${l_formatted}`,
        14,
        65
    );

    // --- Tabella delle lezioni ---
    const tableBody = lessons.map(lesson => {
        const date = new Date(lesson.lesson_date);
        const formattedDate = date.toLocaleDateString("it-IT").replace(/\//g, "-");
        return [
            formattedDate,
            `${lesson.tutor_surname} ${lesson.tutor_name}`,
            `${lesson.lesson_hours}h ${lesson.lesson_minutes}min`
        ];
    });

    jsPDFAutoTable(doc, {
        startY: 75, // spostato sotto testo
        head: [["Data", "Tutor", "Durata"]],
        body: tableBody,
        headStyles: { fillColor: [220, 220, 220], halign: "center", fontStyle: "bold" },
        bodyStyles: { halign: "center" },
        columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 100 }, 2: { cellWidth: 40 } }
    });

    // --- Informazioni aggiuntive ---
    let currentY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);

    doc.text(`Il costo delle lezioni svolte è di: ${user.bill} €`, 14, currentY);
    currentY += 10;

    doc.setFont(undefined, "bold");
    doc.text("Coordinate bancarie:", 14, currentY);
    currentY += 7;

    doc.setFont(undefined, "normal");
    doc.text("Iban: IT36A0307502200CC8501138427", 14, currentY);
    currentY += 7;
    doc.text("Intestato a STUDIAMO APS.", 14, currentY);
    currentY += 7;
    doc.text("Banca Generali.", 14, currentY);
    currentY += 7;
    doc.text("Indicare il nome dello studente nella causale.", 14, currentY);
    currentY += 12;

    doc.setFont(undefined, "bold");
    doc.text("Per maggiori informazioni contattaci al numero:", 14, currentY);
    currentY += 7;

    doc.setFont(undefined, "normal");
    doc.text("Segreteria Studiamo APS: 389 249 4117", 14, currentY);

    return doc;
}

export async function generateStudentCourseReport(user, month, year) {
    const doc = new jsPDF();

    // --- Logo ---
    const logoDataUrl = await getBase64ImageFromUrl(
        "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png"
    );
    doc.addImage(logoDataUrl, "JPEG", 80, 10, 40, 40, undefined, "FAST");

    // --- Header ---
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
        "Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877",
        doc.internal.pageSize.getWidth() / 2,
        55,
        { align: "center" }
    );

    // --- Testo principale ---
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
        `Il costo per la partecipazione al corso ${user.c_name} da parte di ${user.name} ${user.surname}`,
        14,
        65
    );

    doc.text(
        `nel mese di ${month} ${year} è di: ${user.bill} €`,
        14,
        75
    );

    // --- Coordinate bancarie ---
    let currentY = 90;
    doc.setFont(undefined, "bold");
    doc.text("Coordinate bancarie:", 14, currentY);
    currentY += 7;

    doc.setFont(undefined, "normal");
    doc.text("Iban: IT36A0307502200CC8501138427", 14, currentY);
    currentY += 7;
    doc.text("Intestato a STUDIAMO APS.", 14, currentY);
    currentY += 7;
    doc.text("Banca Generali.", 14, currentY);
    currentY += 7;
    doc.text("Indicare il nome dello studente nella causale.", 14, currentY);
    currentY += 12;

    // --- Contatti ---
    doc.setFont(undefined, "bold");
    doc.text("Per maggiori informazioni contattaci al numero:", 14, currentY);
    currentY += 7;

    doc.setFont(undefined, "normal");
    doc.text("Segreteria Studiamo APS: 389 249 4117", 14, currentY);

    // --- Restituisce l'oggetto jsPDF pronto per il download ---
    return doc;
}

export async function generateTutorReport(tutor_name, tutor_surname, gain, lessons, courseLessons, students, firstDate, lastDate) {
    const doc = new jsPDF();

    // --- Logo ---
    const logoDataUrl = await getBase64ImageFromUrl(
        "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png"
    );
    doc.addImage(logoDataUrl, "JPEG", 80, 10, 40, 40, undefined, "FAST");

    // --- Header ---
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
        "Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877",
        doc.internal.pageSize.getWidth() / 2,
        55,
        { align: "center" }
    );

    // --- Testo introduttivo ---
    const f_formatted = firstDate.split("-").reverse().join("-");
    const l_formatted = lastDate.split("-").reverse().join("-");

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
        `Si riportano le lezioni svolte da ${tutor_name} ${tutor_surname} dal ${f_formatted} al ${l_formatted}`,
        14,
        65
    );

    // --- Tabella delle lezioni ---
    const tableBody = [
        ...lessons.map((lesson, index) => [
            lesson.lesson_date,
            students[index],
            `${lesson.lesson_hours}h ${lesson.lesson_minutes}min`
        ]),
        ...courseLessons.map((lesson) => [
            lesson.l_date,
            lesson.course_name,
            `${lesson.l_hours}h ${lesson.l_minutes}min`
        ])
    ];

    jsPDFAutoTable(doc, {
        startY: 75,
        head: [["Data", "Studente / Corso", "Durata"]],
        body: tableBody,
        headStyles: { fillColor: [220, 220, 220], halign: "center", fontStyle: "bold" },
        bodyStyles: { halign: "center" },
        columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 100 }, 2: { cellWidth: 40 } }
    });

    // --- Guadagno ---
    let currentY = doc.lastAutoTable.finalY + 10;
    doc.setFont(undefined, "normal");
    doc.text(`Il guadagno per le lezioni svolte è di: ${gain} €`, 14, currentY);

    return doc;
}


export async function generateAllStudentReport(users, firstDate, lastDate) {
    const doc = new jsPDF();

    // --- Logo 40x40 ---
    const logoDataUrl = await getBase64ImageFromUrl(
        "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png"
    );
    doc.addImage(logoDataUrl, "JPEG", 80, 10, 40, 40, undefined, "FAST");

    // --- Header ---
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
        "Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877",
        doc.internal.pageSize.getWidth() / 2,
        55,
        { align: "center" }
    );

    // --- Testo introduttivo ---
    const f_formatted = firstDate.split("-").reverse().join("-");
    const l_formatted = lastDate.split("-").reverse().join("-");

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
        `Si riportano le lezioni svolte dal ${f_formatted} al ${l_formatted}`,
        14,
        65
    );

    // --- Tabella utenti ---
    const tableBody = users.map(user => [
        user.surname + " " + user.name,
        `${user.hours}h ${user.minutes}min`,
        user.bill.toString()
    ]);

    jsPDFAutoTable(doc, {
        startY: 75,
        head: [["Studente", "Tot Lez.", "Conto €"]],
        body: tableBody,
        headStyles: { fillColor: [220, 220, 220], halign: "center", fontStyle: "bold" },
        bodyStyles: { halign: "center" },
        columnStyles: {
            0: { cellWidth: 90, overflow: 'linebreak' },  // Studente
            1: { cellWidth: 50 },                          // Tot Lez.
            2: { cellWidth: 40 }                           // Conto €
        },
        styles: {
            fontSize: 10
        },
        theme: "striped",
        margin: { left: 14, right: 14 } // margini pagina
    });

    return doc;
}


export async function generateAllCourseStudentReport(users, month, year) {
    const doc = new jsPDF();

    // --- Logo 40x40 ---
    const logoDataUrl = await getBase64ImageFromUrl(
        "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png"
    );
    doc.addImage(logoDataUrl, "JPEG", 80, 10, 40, 40, undefined, "FAST");

    // --- Header ---
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
        "Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877",
        doc.internal.pageSize.getWidth() / 2,
        55,
        { align: "center" }
    );

    // --- Testo introduttivo ---
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
        `Si riportano le lezioni svolte nel mese di ${month} ${year}`,
        14,
        65
    );

    // --- Tabella studenti/corsi ---
    const tableBody = users.map(user => [
        user.surname + " " + user.name,
        user.course,
        user.bill.toString()
    ]);

    jsPDFAutoTable(doc, {
        startY: 75,
        head: [["Studente", "Corso", "Conto €"]],
        body: tableBody,
        headStyles: { fillColor: [220, 220, 220], halign: "center", fontStyle: "bold" },
        bodyStyles: { halign: "center" },
        columnStyles: {
            0: { cellWidth: 90, overflow: 'linebreak' },  // Studente
            1: { cellWidth: 50, overflow: 'linebreak' },  // Corso
            2: { cellWidth: 40 }                           // Conto €
        },
        styles: { fontSize: 10 },
        theme: "striped",
        margin: { left: 14, right: 14 } // margini pagina
    });

    return doc;
}


export async function generateAllTutorReport(users, firstDate, lastDate) {
    const doc = new jsPDF();

    // --- Logo 40x40 ---
    const logoDataUrl = await getBase64ImageFromUrl(
        "https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png"
    );
    doc.addImage(logoDataUrl, "JPEG", 80, 10, 40, 40, undefined, "FAST");

    // --- Header ---
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(
        "Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877",
        doc.internal.pageSize.getWidth() / 2,
        55,
        { align: "center" }
    );

    // --- Testo introduttivo ---
    const f_formatted = firstDate.split("-").reverse().join("-");
    const l_formatted = lastDate.split("-").reverse().join("-");

    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text(
        `Si riportano le lezioni svolte dal ${f_formatted} al ${l_formatted}`,
        14,
        65
    );

    // --- Tabella tutor ---
    const tableBody = users.map(user => [
        user.surname + " " + user.name,
        `${user.hours}h ${user.minutes}min`,
        user.gain.toString()
    ]);

    jsPDFAutoTable(doc, {
        startY: 75,
        head: [["Tutor", "Tot Lez.", "Guad. €"]],
        body: tableBody,
        headStyles: { fillColor: [220, 220, 220], halign: "center", fontStyle: "bold" },
        bodyStyles: { halign: "center" },
        columnStyles: {
            0: { cellWidth: 90, overflow: 'linebreak' },  // Tutor
            1: { cellWidth: 50 },                          // Tot Lez.
            2: { cellWidth: 40 }                           // Guad. €
        },
        styles: { fontSize: 10 },
        theme: "striped",
        margin: { left: 14, right: 14 }
    });

    return doc;
}



/*


async function loadFont(url) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    let binary = "";
    const bytes = new Uint8Array(buffer);

    const chunkSize = 0x8000;

    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }

    return btoa(binary);
}






export async function generateStudentReport1(user, firstDate, lastDate, lessons) {
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default;

    const robotoBase64 = await loadFont("fonts/Roboto-Regular.ttf");
    const robotBoldBase64 = await loadFont("fonts/Roboto-Bold.ttf");

    pdfMake.vfs = {
        "Roboto-Regular.ttf": robotoBase64,
        "Roboto-Bold.ttf": robotBoldBase64
    };

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Bold.ttf"
        }
    };


    const logoDataUrl = await getBase64ImageFromUrl('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png');
    const [f_year, f_month, f_day] = firstDate.split("-");
    const f_formatted = `${f_day}-${f_month}-${f_year}`;

    const [l_year, l_month, l_day] = lastDate.split("-");
    const l_formatted = `${l_day}-${l_month}-${l_year}`;



    const tableBody = [
        // Intestazione
        [
            { text: 'Data', bold: true, alignment: 'center' },
            { text: 'Tutor', bold: true, alignment: 'center' },
            { text: 'Durata', bold: true, alignment: 'center' }
        ],
        // Righe dinamiche
        ...lessons.map(lesson => {
            const date = new Date(lesson.lesson_date);
            const formattedDate = new Intl.DateTimeFormat('it-IT').format(date); // gg/mm/aaaa

            // se vuoi usare il "-" invece di "/", basta sostituire:
            const dateStr = formattedDate.replace(/\//g, '-');

            return [
                { text: dateStr, alignment: 'center', margin: [0, 5, 0, 5] },
                { text: lesson.tutor_surname + " " + lesson.tutor_name, alignment: 'center', margin: [0, 5, 0, 5] },
                { text: lesson.lesson_hours + "h " + lesson.lesson_minutes + "min", alignment: 'center', margin: [0, 5, 0, 5] }
            ];
        })
    ];

    const docDefinition = {
        content: [
            {
                image: logoDataUrl,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20] // left, top, right, bottom
            },
            { text: 'Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877', style: 'header', margin: [0, 0, 10, 0] },
            { text: `Si riportano le lezioni svolte da ${user.name} ${user.surname} dal ${f_formatted} al ${l_formatted}`, style: 'text', margin: [0, 30, 0, 0]},
            {
                table: {
                    headerRows: 1,
                    widths: [110, 270, 100],
                    body: tableBody,

                },
                layout: 'lightHorizontalLines',
                margin: [0, 30, 0, 0]
            },
            { text: `Il costo delle lezioni svolte è di: ${user.bill} €`, style: 'text', margin: [0, 30, 0, 0]},
            { text: `Coordinate bancarie:`, style: 'text', margin: [0, 30, 0, 0], bold:true},
            { text: `Iban: IT36A0307502200CC8501138427`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Intestato a STUDIAMO APS.`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Banca Generali.`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Indicare il nome dello studente nella causale.`, style: 'text', margin: [0, 5, 0, 0]},

            { text: `Per maggiori informazioni contattaci al numero:`, style: 'text', margin: [0, 20, 0, 0], bold:true},
            { text: `Segreteria Studiamo APS: 389 249 4117`, style: 'text', margin: [0, 5, 0, 0]},




        ],
        styles: {
            header: { fontSize: 10, bold: true, alignment: 'center' },
            text: { fontSize: 12 },
        },
    };

    return pdfMake.createPdf(docDefinition);
}

export async function generateStudentCourseReport1(user, month, year) {

    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default;

    const robotoBase64 = await loadFont("fonts/Roboto-Regular.ttf");
    const robotBoldBase64 = await loadFont("fonts/Roboto-Bold.ttf");

    pdfMake.vfs = {
        "Roboto-Regular.ttf": robotoBase64,
        "Roboto-Bold.ttf": robotBoldBase64
    };

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Bold.ttf",
            italics: "Roboto-Regular.ttf",
            bolditalics: "Roboto-Regular.ttf"
        }
    };

    const logoDataUrl = await getBase64ImageFromUrl('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png');

    const docDefinition = {
        content: [
            {
                image: logoDataUrl,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20] // left, top, right, bottom
            },
            { text: 'Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877', style: 'header', margin: [0, 0, 10, 0] },
            { text: `Il costo per la partecipazione al corso ${user.c_name} da parte di ${user.name} ${user.surname}`, style: 'text', margin: [0, 30, 0, 0]},
            { text: `nel mese di ${month} ${year}  è di: ${user.bill} €`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Coordinate bancarie:`, style: 'text', margin: [0, 30, 0, 0], bold:true},
            { text: `Iban: IT36A0307502200CC8501138427`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Intestato a STUDIAMO APS.`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Banca Generali.`, style: 'text', margin: [0, 5, 0, 0]},
            { text: `Indicare il nome dello studente nella causale.`, style: 'text', margin: [0, 5, 0, 0]},

            { text: `Per maggiori informazioni contattaci al numero:`, style: 'text', margin: [0, 20, 0, 0], bold:true},
            { text: `Segreteria Studiamo APS: 389 249 4117`, style: 'text', margin: [0, 5, 0, 0]},
        ],
        styles: {
            header: { fontSize: 10, bold: true, alignment: 'center' },
            text: { fontSize: 12 },
        },
    };

    return pdfMake.createPdf(docDefinition);
}


export async function generateTutorReport1(tutor_name, tutor_surname, gain, lessons, courseLessons, students, firstDate, lastDate) {
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default;

    const robotoBase64 = await loadFont("fonts/Roboto-Regular.ttf");
    const robotBoldBase64 = await loadFont("fonts/Roboto-Bold.ttf");

    pdfMake.vfs = {
        "Roboto-Regular.ttf": robotoBase64,
        "Roboto-Bold.ttf": robotBoldBase64
    };

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Bold.ttf",
            italics: "Roboto-Regular.ttf",
            bolditalics: "Roboto-Regular.ttf"
        }
    };


    const logoDataUrl = await getBase64ImageFromUrl('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png');
    const [f_year, f_month, f_day] = firstDate.split("-");
    const f_formatted = `${f_day}-${f_month}-${f_year}`;

    const [l_year, l_month, l_day] = lastDate.split("-");
    const l_formatted = `${l_day}-${l_month}-${l_year}`;


    const tableBody = [
        // Intestazione
        [
            { text: 'Data', bold: true, alignment: 'center' },
            { text: 'Studente', bold: true, alignment: 'center' },
            { text: 'Durata', bold: true, alignment: 'center' }
        ],
        // Righe dinamiche
        ...lessons.map((lesson, index) => [
            { text: lesson.lesson_date, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: students[index], alignment: 'center', margin: [0, 5, 0, 5] },
            { text: lesson.lesson_hours + "h " + lesson.lesson_minutes + "min", alignment: 'center', margin: [0, 5, 0, 5] }
        ]),

        // Righe dinamiche
        ...courseLessons.map((lesson, index) => [
            { text: lesson.l_date, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: lesson.course_name, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: lesson.l_hours + "h " + lesson.l_minutes + "min", alignment: 'center', margin: [0, 5, 0, 5] }
        ])
    ];

    const docDefinition = {
        content: [
            {
                image: logoDataUrl,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20] // left, top, right, bottom
            },
            { text: 'Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877', style: 'header', margin: [0, 0, 10, 0] },
            { text: `Si riportano le lezioni svolte da ${tutor_name} ${tutor_surname} dal ${f_formatted} al ${l_formatted}`, style: 'text', margin: [0, 30, 0, 0]},

            {
                table: {
                    headerRows: 1,
                    widths: [110, 270, 100],
                    body: tableBody,

                },
                layout: 'lightHorizontalLines',
                margin: [0, 30, 0, 0]
            },
            { text: `Il guadagno per le lezioni svolte è di: ${gain} €`, style: 'text', margin: [0, 30, 0, 0]},


        ],
        styles: {
            header: { fontSize: 10, bold: true, alignment: 'center' },
            text: { fontSize: 12 },
        },
    };

    return pdfMake.createPdf(docDefinition);
}

export async function generateAllStudentReport1(users, firstDate, lastDate) {
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default;

    const robotoBase64 = await loadFont("fonts/Roboto-Regular.ttf");
    const robotBoldBase64 = await loadFont("fonts/Roboto-Bold.ttf");

    pdfMake.vfs = {
        "Roboto-Regular.ttf": robotoBase64,
        "Roboto-Bold.ttf": robotBoldBase64
    };

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Bold.ttf",
            italics: "Roboto-Regular.ttf",
            bolditalics: "Roboto-Regular.ttf"
        }
    };



    const logoDataUrl = await getBase64ImageFromUrl('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png');
    const [f_year, f_month, f_day] = firstDate.split("-");
    const f_formatted = `${f_day}-${f_month}-${f_year}`;

    const [l_year, l_month, l_day] = lastDate.split("-");
    const l_formatted = `${l_day}-${l_month}-${l_year}`;



    const tableBody = [
        // Intestazione
        [
            { text: 'Studente', bold: true, alignment: 'center' },
            { text: 'Tot Lez.', bold: true, alignment: 'center' },
            { text: 'Conto €', bold: true, alignment: 'center' }

        ],
        // Righe dinamiche
        ...users.map(user => [
            { text: user.surname + " " + user.name, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: user.hours + "h " + user.minutes + "min", alignment: 'center', margin: [0, 5, 0, 5] },
            { text: user.bill, alignment: 'center', margin: [0, 5, 0, 5] },

        ])
    ];

    const docDefinition = {
        content: [
            {
                image: logoDataUrl,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20] // left, top, right, bottom
            },
            { text: 'Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877', style: 'header', margin: [0, 0, 10, 0] },
            { text: `Si riportano le lezioni svolte dal ${f_formatted} al ${l_formatted}`, style: 'text', margin: [0, 30, 0, 0]},
            {
                table: {
                    headerRows: 1,
                    widths: [270, 110, 100],
                    body: tableBody,

                },
                layout: 'lightHorizontalLines',
                margin: [0, 30, 0, 0]
            },


        ],
        styles: {
            header: { fontSize: 10, bold: true, alignment: 'center' },
            text: { fontSize: 12 },
        },
    };

    return pdfMake.createPdf(docDefinition);
}

export async function generateAllCourseStudentReport1(users, month, year) {
    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default;

    const robotoBase64 = await loadFont("fonts/Roboto-Regular.ttf");
    const robotBoldBase64 = await loadFont("fonts/Roboto-Bold.ttf");

    pdfMake.vfs = {
        "Roboto-Regular.ttf": robotoBase64,
        "Roboto-Bold.ttf": robotBoldBase64
    };

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Bold.ttf",
            italics: "Roboto-Regular.ttf",
            bolditalics: "Roboto-Regular.ttf"
        }
    };


    const logoDataUrl = await getBase64ImageFromUrl('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png');

    const tableBody = [
        // Intestazione
        [
            { text: 'Studente', bold: true, alignment: 'center' },
            { text: 'Corso', bold: true, alignment: 'center' },
            { text: 'Conto €', bold: true, alignment: 'center' }

        ],
        // Righe dinamiche
        ...users.map(user => [
            { text: user.surname + " " + user.name, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: user.course, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: user.bill, alignment: 'center', margin: [0, 5, 0, 5] },

        ])
    ];

    const docDefinition = {
        content: [
            {
                image: logoDataUrl,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20] // left, top, right, bottom
            },
            { text: 'Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877', style: 'header', margin: [0, 0, 10, 0] },
            { text: `Si riportano le lezioni svolte nel mese di ${month} ${year}`, style: 'text', margin: [0, 30, 0, 0]},
            {
                table: {
                    headerRows: 1,
                    widths: [270, 110, 100],
                    body: tableBody,

                },
                layout: 'lightHorizontalLines',
                margin: [0, 30, 0, 0]
            },


        ],
        styles: {
            header: { fontSize: 10, bold: true, alignment: 'center' },
            text: { fontSize: 12 },
        },
    };

    return pdfMake.createPdf(docDefinition);
}


export async function generateAllTutorReport1(users, firstDate, lastDate) {


    const pdfMakeModule = await import("pdfmake/build/pdfmake");
    const pdfMake = pdfMakeModule.default;

    const robotoBase64 = await loadFont("fonts/Roboto-Regular.ttf");
    const robotBoldBase64 = await loadFont("fonts/Roboto-Bold.ttf");

    pdfMake.vfs = {
        "Roboto-Regular.ttf": robotoBase64,
        "Roboto-Bold.ttf": robotBoldBase64
    };

    pdfMake.fonts = {
        Roboto: {
            normal: "Roboto-Regular.ttf",
            bold: "Roboto-Bold.ttf",
            italics: "Roboto-Regular.ttf",
            bolditalics: "Roboto-Regular.ttf"
        }
    };






    const logoDataUrl = await getBase64ImageFromUrl('https://kuhaudayosnvdhmgiaxg.supabase.co/storage/v1/object/public/StudiAmo-web-images/logo/logo.png');
    const [f_year, f_month, f_day] = firstDate.split("-");
    const f_formatted = `${f_day}-${f_month}-${f_year}`;

    const [l_year, l_month, l_day] = lastDate.split("-");
    const l_formatted = `${l_day}-${l_month}-${l_year}`;




    const tableBody = [
        // Intestazione
        [
            { text: 'Tutor', bold: true, alignment: 'center' },
            { text: 'Tot Lez.', bold: true, alignment: 'center' },
            { text: 'Guad. €', bold: true, alignment: 'center' }

        ],
        // Righe dinamiche
        ...users.map(user => [
            { text: user.surname + " " + user.name, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: user.hours + "h " + user.minutes + "min", alignment: 'center', margin: [0, 5, 0, 5] },
            { text: user.gain, alignment: 'center', margin: [0, 5, 0, 5] },

        ])
    ];

    const docDefinition = {
        content: [
            {
                image: logoDataUrl,
                width: 100,
                alignment: 'center',
                margin: [0, 0, 0, 20] // left, top, right, bottom
            },
            { text: 'Via Alcide De Gasperi 92, Mascalucia (CT). P.IVA: 06179280877', style: 'header', margin: [0, 0, 10, 0] },
            { text: `Si riportano le lezioni svolte dal ${f_formatted} al ${l_formatted}`, style: 'text', margin: [0, 30, 0, 0]},
            {
                table: {
                    headerRows: 1,
                    widths: [270, 110, 100],
                    body: tableBody,

                },
                layout: 'lightHorizontalLines',
                margin: [0, 30, 0, 0]
            },


        ],
        styles: {
            header: { fontSize: 10, bold: true, alignment: 'center' },
            text: { fontSize: 12 }
        },
        defaultStyle: {
            font: "Roboto"
        }
    };

    return pdfMake.createPdf(docDefinition);
}
*/










