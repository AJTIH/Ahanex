import React from 'react';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import logo from './logo.png'; // adjust the path to your logo file

import ahanex from '../../../../src/assets/images/ahanex.png'
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const ProcedureBillPdfViewNew = () => {

    // const { patient_name, patient_address, patient_district, patient_mobile, patient_age } = patient
    // const { clinic_name, clinic_address, clinic_mobile, clinic_mail } = printingdata[0]

    // const xx = format(new Date(), "dd-MM-yyyy")

    var doc = {
        background: function (currentPage, pageSize) {
            return {
                table: {
                    widths: [pageSize.width - 70],
                    heights: [pageSize.height - 70],
                    bold: true,
                    body: [['']]
                },
                margin: 30,
                layout: 'noBorders'
            };
        },
        pageMargins: [50, 80, 130, 40],


        header: {
            columns: [
                // {
                //     image: logos, // Your logo image as a base64 encoded string
                //     width: 80, // Width of the logo
                // },
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







        ],

        images: {
            snow: 'http://192.168.22.170/NAS/logo/logo.png',

        }


    }
    pdfMake.createPdf(doc).open();





}