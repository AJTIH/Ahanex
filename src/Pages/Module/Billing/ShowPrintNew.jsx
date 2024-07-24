import React, { memo, useCallback, useEffect, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { ProcedureBillPdfView } from './ProcedureBillPdf';
import { ProcedureBillPdfViewNew } from './BillingPdfNew';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});


const ShowPrintNew = ({ open, reset, setPrintFlag }) => {

    const printtoken = useCallback(() => {
        ProcedureBillPdfViewNew()
    }, [])

    const handleClose = useCallback(() => {
        setPrintFlag(0)
    }, [setPrintFlag])


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth='sm'
            aria-describedby="alert-dialog-slide-descriptiona"
        >
            < DialogContent id="alert-dialog-slide-descriptiona"
                sx={{
                    minWidth: 150,
                    maxWidth: 200
                }}
            >
                < DialogContentText id="alert-dialog-slide-descriptiona">
                    Are you want to print
                </DialogContentText>

            </DialogContent>
            <DialogActions>
                <Button onClick={printtoken} color="secondary" >Print</Button>
                <Button onClick={handleClose} color="secondary" >Close</Button>
            </DialogActions>

        </Dialog>
    )
}

export default ShowPrintNew