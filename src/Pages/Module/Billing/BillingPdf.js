import React from 'react';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Import your logo image as a base64 encoded string
import logo from './logo.png'; // adjust the path to your logo file

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const BillPdfView = () => {
    // const { patient_name, patient_address, patient_district, patient_mobile, patient_age } = patient;
    // const { clinic_name, clinic_address, clinic_mobile, clinic_mail } = printingdata[0];
    const xx = format(new Date(), 'dd-MM-yyyy');

    const generatePdf = () => {
        const docDefinition = {
            background: function (currentPage, pageSize) {
                return {
                    table: {
                        widths: [pageSize.width - 70],
                        heights: [pageSize.height - 70],
                        body: [['']],
                        bold: true,
                    },
                    margin: 30,
                };
            },
            pageMargins: [50, 80, 130, 40],

            header: {
                columns: [
                    {
                        image: logo, // Your logo image as a base64 encoded string
                        width: 80, // Width of the logo
                    },
                    // {
                    //     text: clinic_name,
                    //     style: 'header',
                    //     bold: true,
                    //     alignment: 'center',
                    //     margin: [10, 10],
                    // },
                ],
            },

            footer: function (currentPage, pageCount) {
                return {
                    margin: 10,
                    columns: [
                        {
                            fontSize: 9,
                            text: [
                                {
                                    text: currentPage.toString() + ' of ' + pageCount,
                                },
                            ],
                            alignment: 'center',
                        },
                    ],
                };
            },

            // content: [
            //     // Your existing content goes here
            //     {
            //         text: 'Bill',
            //         style: 'header',
            //         bold: true,
            //         fontSize: 15,
            //         alignment: 'center',
            //         margin: [0, 10],
            //     },
            //     {
            //         margin: [15, 0, 0, 10],
            //         style: 'tableExample',
            //         table: {
            //             widths: [100, 150, 100, 150],
            //             body: [
            //                 [
            //                     { text: 'Patient Id', fontSize: 12 },
            //                     { text: pateintid, fontSize: 12 },
            //                     { text: 'Bill No', fontSize: 12 },
            //                     { text: lastVisitId, fontSize: 12 },
            //                 ],
            //                 [
            //                     { text: 'Patient Name', fontSize: 12 },
            //                     { text: patient_name, fontSize: 12 },
            //                     { text: 'Bill Date', fontSize: 12 },
            //                     { text: xx, fontSize: 12 },
            //                 ],
            //                 [
            //                     { text: 'Address', fontSize: 12 },
            //                     { text: patient_address, fontSize: 12 },
            //                     { text: 'Age', fontSize: 12 },
            //                     { text: patient_age, fontSize: 12 },
            //                 ],
            //                 [
            //                     { text: 'District', fontSize: 12 },
            //                     { text: patient_district, fontSize: 12 },
            //                     { text: 'Mobile', fontSize: 12 },
            //                     { text: patient_mobile, fontSize: 12 },
            //                 ],
            //             ],
            //         },
            //         layout: 'noBorders',
            //     },
            //     {
            //         margin: [0, 3, 0, 0],
            //         style: 'tableExample',
            //         table: {
            //             widths: [60, 330, 70],
            //             body: [
            //                 [
            //                     { text: 'Sl no', fontSize: 12, bold: true },
            //                     { text: ' Description', fontSize: 12, bold: true },
            //                     { text: 'Rate', fontSize: 12, bold: true },
            //                 ],
            //                 ...dataset.map(val => [
            //                     { text: val.bill_proc_slno, fontSize: 12 },
            //                     { text: val.procedure_name, fontSize: 12 },
            //                     { text: val.procedure_rate, fontSize: 12 },
            //                 ]),
            //             ],
            //         },
            //     },
            //     {
            //         margin: [325, 20, 0, 0],
            //         style: 'tableExample',
            //         table: {
            //             widths: [80, 60],
            //             body: [[{ text: 'Total Amount', fontSize: 12, bold: true }, { text: sumProcedureRate, fontSize: 15, bold: true }]],
            //         },
            //         layout: 'noBorders',
            //     },
            //     {
            //         margin: [0, 45, 0, 0],
            //         style: 'tableExample',
            //         table: {
            //             widths: [350, 130],
            //             body: [
            //                 [{}, { text: 'Seal & Signature', fontSize: 12 }],
            //                 [{ table: { widths: [350, 130], body: [[{}, {}], [{}, {}], [{}, {}]] }, layout: 'noBorders' }, { table: { widths: [350, 130], body: [[{}, {}], [{}, {}], [{}, {}]] }, layout: 'noBorders' }],
            //             ],
            //         },
            //         layout: 'noBorders',
            //     },
            // ],
        };

        pdfMake.createPdf(docDefinition).open();
    };

    return (
        <div>
            <button onClick={generatePdf}>Generate PDF</button>
        </div>
    );
};

export default BillPdfView;
