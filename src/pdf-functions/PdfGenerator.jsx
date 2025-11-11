import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";




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



pdfMake.vfs = pdfFonts.vfs;

export async function generateStudentReport(user, firstDate, lastDate, lessons) {
    const logoDataUrl = await getBase64ImageFromUrl('/icons/logo.jpg');
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
        ...lessons.map(lesson => [
            { text: lesson.lesson_date, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: lesson.tutor_surname + " " + lesson.tutor_name, alignment: 'center', margin: [0, 5, 0, 5] },
            { text: lesson.lesson_hours + "h " + lesson.lesson_minutes + "min", alignment: 'center', margin: [0, 5, 0, 5] }
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


export async function generateTutorReport(tutor_name, tutor_surname, gain, lessons, students, firstDate, lastDate) {
    const logoDataUrl = await getBase64ImageFromUrl('/icons/logo.jpg');
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



export async function generateAllStudentReport(users, firstDate, lastDate) {
    const logoDataUrl = await getBase64ImageFromUrl('/icons/logo.jpg');
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



export async function generateAllTutorReport(users, firstDate, lastDate) {
    const logoDataUrl = await getBase64ImageFromUrl('/icons/logo.jpg');
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
            text: { fontSize: 12 },
        },
    };

    return pdfMake.createPdf(docDefinition);
}






