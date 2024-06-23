import React, { memo, useCallback, useEffect, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { TokenBillPdfView } from './BillPdfView';
import { TokenBillPdfViewWithRegFee } from './BillPdfWithRegFee';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});
const ShowPAge = ({ open, lastVisitId, reset, flag }) => {
    const [dataset, setDataset] = useState([])
    useEffect(() => {


        const getDataForPrint = async (lastVisitId) => {
            const result = await axioslogin.get(`/patientRegistration/lastInsertVistForPrint/${lastVisitId}`)
            const { success, data } = result.data
            //   console.log(data);
            if (success === 1) {
                setDataset(data)
            } else {
                setDataset([])
            }
        }
        getDataForPrint(lastVisitId)
    }, [lastVisitId])

    const printtoken = useCallback(() => {
        console.log(flag);
        if (dataset.length !== 0) {
            if (flag === 0) {
                TokenBillPdfView(dataset)
            }
            else {
                TokenBillPdfViewWithRegFee(dataset)
            }

        }


    }, [dataset, flag])

    const handleClose = useCallback(() => {
        reset()
    }, [reset])


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

export default memo(ShowPAge)