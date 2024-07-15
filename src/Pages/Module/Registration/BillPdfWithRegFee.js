import { WrapText } from "@mui/icons-material";
import { format } from "date-fns";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const TokenBillPdfViewWithRegFee = (data, printingdata) => {
    const { patient_id, token_no, fee,
        patient_name, patient_address, patient_pincode, patient_district,
        patient_mobile, patient_age, doctor_name } = data[0]
    const { clinic_name, clinic_address, clinic_mobile, clinic_mail } = printingdata[0]
    const xx = format(new Date(), "dd-MM-yyyy")
    const regFee = 100
    const total = regFee + fee
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

        // header: {
        //     margin: 20,
        //     columns: [
        //         {
        //             table: {
        //                 widths: ['50%'],
        //                 heights: ['auto'],
        //                 body: [

        //                     [
        //                         {
        //                             margin: [30, 50],
        //                             text: 'Ahanex',
        //                             fontSize: 11, italics: true,
        //                             font: 'Roboto'
        //                         },
        //                         // {}
        //                     ],
        //                 ]
        //             },
        //             layout: 'noBorders'
        //         }

        //     ]
        // },
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
                fontSize: 17,
                margin: [45, 0, 0, 0],
                text: 'Visit Bill',
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
                        { text: patient_id, fontSize: 12, font: 'Roboto' },
                        { text: 'Date', fontSize: 12, font: 'Roboto' },
                        { text: xx, fontSize: 12, font: 'Roboto' }
                        ],
                        [{ text: 'Patient Name', fontSize: 12, font: 'Roboto' },
                        { text: patient_name, fontSize: 12, font: 'Roboto' },
                        { text: 'Age', fontSize: 12, font: 'Roboto' },
                        { text: patient_age, fontSize: 12, font: 'Roboto' },
                        ],
                        [{ text: 'Address', fontSize: 12, font: 'Roboto' },
                        { text: patient_address, fontSize: 12, font: 'Roboto' },
                        { text: 'Mobile', fontSize: 12, font: 'Roboto' },
                        { text: patient_mobile, fontSize: 12, font: 'Roboto' }
                        ],
                        [{ text: 'Pin Code', fontSize: 12, font: 'Roboto' },
                        { text: patient_pincode, fontSize: 12, font: 'Roboto' },
                        { text: 'Doctor Name', fontSize: 12, font: 'Roboto' },
                        { text: doctor_name, fontSize: 12, font: 'Roboto', WrapText: "true" },
                        ],
                        [{ text: 'District', fontSize: 12, font: 'Roboto' },
                        { text: patient_district, fontSize: 12, font: 'Roboto' },
                        { text: 'Token No', fontSize: 12, font: 'Roboto' },
                        { text: token_no, fontSize: 12, font: 'Roboto' }
                        ],

                    ]
                },
                layout: 'noBorders'
            },

            {
                margin: [0, 10, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [60, 330, 70],
                    body: [
                        [{ text: 'Sl No', fontSize: 12, font: 'Roboto' },
                        { text: 'Description', fontSize: 12, font: 'Roboto' },
                        { text: 'Amount', fontSize: 12, font: 'Roboto' }],
                        [{ text: '1', fontSize: 12, font: 'Roboto' },
                        { text: 'Registration Charge', fontSize: 12, font: 'Roboto' },
                        { text: regFee, fontSize: 12, font: 'Roboto' }],
                        [{ text: '2', fontSize: 12, font: 'Roboto' },
                        { text: 'Consultation Charge', fontSize: 12, font: 'Roboto' },
                        { text: fee, fontSize: 12, font: 'Roboto' }],

                    ]
                },

            },


            {
                margin: [210, 20, 0, 0],
                style: 'tableExample',
                table: {
                    widths: [110, 60],
                    body: [

                        [{ text: 'Total Amount', fontSize: 12, font: 'Roboto' },
                        { text: total, fontSize: 12, font: 'Roboto' }],

                    ]
                },
                layout: 'noBorders'
            },
        ]




    }
    pdfMake.createPdf(doc).open();
}