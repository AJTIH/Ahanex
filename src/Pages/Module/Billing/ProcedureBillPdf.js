import { format } from "date-fns";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const ProcedureBillPdfView = (pateintid, patient, lastVisitId, dataset, sumProcedureRate, printingdata) => {

    const { patient_name, patient_address, patient_district, patient_mobile, patient_age } = patient
    const { clinic_name, clinic_address, clinic_mobile } = printingdata[0]

    const xx = format(new Date(), "dd-MM-yyyy")

    var doc = {
        background: function (currentPage, pageSize) {
            return {
                table: {
                    widths: [pageSize.width - 70],
                    heights: [pageSize.height - 70],
                    bold: true,
                    body: [['']]
                },
                margin: 30
            };
        },
        pageMargins: [50, 80, 130, 40],
        footer: function (currentPage, pageCount) {
            return {
                margin: 5,
                columns: [
                    {
                        fontSize: 9,
                        text: [
                            {
                                text: currentPage.toString() + ' of ' + pageCount,
                            }
                        ],
                        alignment: 'center'
                    }
                ]
            };

        },
        header: {
            columns: [

                {
                    margin: [20, 15, 0, 0],
                    style: 'tableExample',
                    table: {
                        widths: [100, 250],
                        body: [
                            [{

                                image: 'snow', fit: [150, 150],
                                // margin: [25, 15, 0, 0],
                            },
                            ],


                        ]
                    },
                    layout: 'noBorders'
                },

            ],
        },
        content: [
            {
                fontSize: 15,
                margin: [90, 0, 0, 0],
                text: clinic_name,
                style: 'header', bold: true,
                alignment: 'center',
            },
            {
                fontSize: 13,
                margin: [50, 0, 0, 0],
                text: clinic_address,
                style: 'header',
                alignment: 'center',
            },

            {
                fontSize: 13,
                margin: [40, 0, 0, 0],
                text: clinic_mobile,
                style: 'header',
                alignment: 'center',
            },
            {
                fontSize: 15,
                margin: [15, 0, 0, 0],
                text: 'Bill',
                style: 'header', bold: true,
                alignment: 'center',
            },
            {
                margin: [15, 0, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [100, 150, 100, 150],
                    body: [
                        [{ text: 'Patient Id', fontSize: 12, font: 'Roboto' },
                        { text: pateintid, fontSize: 12, font: 'Roboto' },
                        { text: 'Bill No', fontSize: 12, font: 'Roboto' },
                        { text: lastVisitId, fontSize: 12, font: 'Roboto' },
                        ],
                        [{ text: 'Patient Name', fontSize: 12, font: 'Roboto' },
                        { text: patient_name, fontSize: 12, font: 'Roboto' },
                        { text: 'Bill Date', fontSize: 12, font: 'Roboto' },
                        { text: xx, fontSize: 12, font: 'Roboto' }

                        ],
                        [{ text: 'Address', fontSize: 12, font: 'Roboto' },
                        { text: patient_address, fontSize: 12, font: 'Roboto' },
                        { text: 'Age', fontSize: 12, font: 'Roboto' },
                        { text: patient_age, fontSize: 12, font: 'Roboto' },

                        ],
                        [{ text: 'District', fontSize: 12, font: 'Roboto' },
                        { text: patient_district, fontSize: 12, font: 'Roboto' },
                        { text: 'Mobile', fontSize: 12, font: 'Roboto' },
                        { text: patient_mobile, fontSize: 12, font: 'Roboto' }
                        ],


                    ]
                },
                layout: 'noBorders'
            },



            {
                margin: [0, 3, 0, 0,],
                style: 'tableExample',
                table: {
                    widths: [60, 330, 70],
                    body: [
                        [{ text: 'Sl no', fontSize: 12, bold: true, },
                        { text: ' Description', fontSize: 12, bold: true },
                        { text: 'Rate', fontSize: 12, bold: true },
                        ]
                    ]
                        .concat(dataset && dataset.map((val) => [
                            { text: val.bill_proc_slno, fontSize: 12 },
                            { text: val.procedure_name, fontSize: 12 },
                            { text: val.procedure_rate, fontSize: 12 }
                        ]))
                }
            },


            {
                margin: [325, 20, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [80, 60],
                    body: [

                        [{ text: 'Total Amount', fontSize: 12, font: 'Roboto', bold: true },
                        { text: sumProcedureRate, fontSize: 15, font: 'Roboto', bold: true }],

                    ]
                },
                layout: 'noBorders'
            },


            {
                margin: [0, 45, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [350, 130],
                    body: [

                        [{},
                        { text: 'Seal & Signature', fontSize: 12, font: 'Roboto' }],
                        [
                            {
                                table: {
                                    widths: [350, 130],
                                    body: [

                                        [{}, {}],
                                        [{}, {}],
                                        [{}, {}],

                                    ]
                                }, layout: 'noBorders'
                            },
                            {
                                table: {
                                    widths: [350, 130],
                                    body: [

                                        [{}, {}],
                                        [{}, {}],
                                        [{}, {}],



                                    ]
                                },
                                layout: 'noBorders'
                            }
                        ]

                    ]
                },
                layout: 'noBorders'
            },



        ]




    }
    pdfMake.createPdf(doc).open();





}