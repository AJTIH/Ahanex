import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box, Paper } from '@mui/material'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import CusIconButton from '../../../Components/CusIconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { succesNotify, warningNotify } from '../../../Components/CommonCode';
import { differenceInCalendarDays, format } from 'date-fns'
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const AppoinmentModal = ({ open, modalcolse, doctor, appinmnt_date, tokentaken }) => {
    const [radiovalue, setRadioValue] = useState('1')

    //Radio button OnClick function starts
    const updateRadioClick = useCallback(async (e) => {
        e.preventDefault()
        // setOpen(false)
        setRadioValue(e.target.value)

    }, [])


    const [pateintid, setPatientId] = useState('')
    const [patient, setPatient] = useState({
        salutation: '',
        patient_name: '',
        patient_address: '',
        patient_place: '',
        patient_pincode: '',
        patient_district: '',
        patient_mobile: '',
        patient_dob: '',
        patient_age: '',
        patient_month: '',
        patient_day: ''
    })

    const { salutation, patient_name, patient_address, patient_place, patient_pincode, patient_district,
        patient_mobile, patient_dob, patient_age, patient_month, patient_day
    } = patient
    const updatePatientId = useCallback((e) => {
        setPatientId(e.target.value)
    }, [])

    const searchbyPateintId = useCallback(() => {
        const getPatientDetails = async (pateintid) => {
            const result = await axioslogin.get(`/patientRegistration/PatientDetailsGtting/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                //  setTokenTaken(1)
                const { salutation, patient_name, patient_address, patient_place,
                    patient_pincode, patient_district, patient_mobile, patient_dob, patient_age, patient_month,
                    patient_day } = data[0]
                const frmdata = {
                    salutation: salutation,
                    patient_name: patient_name,
                    patient_address: patient_address,
                    patient_place: patient_place,
                    patient_pincode: patient_pincode,
                    patient_district: patient_district,
                    patient_mobile: patient_mobile,
                    patient_dob: patient_dob,
                    patient_age: patient_age,
                    patient_month: patient_month,
                    patient_day: patient_day
                }
                setPatient(frmdata)
            } else {
                // setTokenTaken(0)
                warningNotify("No patient in given id")
            }
        }
        if (pateintid !== '') {
            getPatientDetails(pateintid)
        } else {
            warningNotify("Please Enter UH Id before serach")
        }

    }, [pateintid])

    const [feedetail, setFeeDetail] = useState({
        Fee: '',
        renewal: ''
    })
    const { Fee, renewal } = feedetail
    const [daysdiff, setDayDiff] = useState(0)

    useEffect(() => {

        const getDoctorFee = async (doctor) => {
            const result = await axioslogin.get(`/patientRegistration/getDoctorFeeDetail/${doctor}`)
            const { success, data } = result.data
            if (success === 1) {
                const { doctor_fee, doctor_token_start, doctor_token_end, doctor_renewal_day } = data[0]
                const frmdata = {
                    Fee: doctor_fee,
                    token_start: doctor_token_start,
                    token_end: doctor_token_end,
                    renewal: doctor_renewal_day
                }
                setFeeDetail(frmdata)
            } else {
                // setDoctorArray([])
            }
        }



        const getLastVistdate = async (postdata) => {
            const result = await axioslogin.post('/patientRegistration/lastVisitingDate', postdata)
            const { data, success } = result.data
            if (success === 1) {

                const { visit_date } = data[0]
                const xx = differenceInCalendarDays(new Date(), new Date(visit_date))
                setDayDiff(xx);
            }
            else {
                warningNotify("No Last Visit")
            }
        }


        getDoctorFee(doctor)
        const postData = {
            patient_id: pateintid,
            doctor_slno: doctor
        }
        getLastVistdate(postData)
    }, [doctor, pateintid])

    const postVisitMast = useMemo(() => {
        return {
            patient_id: pateintid,
            visit_date: format(new Date(appinmnt_date), "yyyy-MM-dd"),
            doctor_slno: doctor,
            token_no: tokentaken,
            fee: daysdiff <= renewal ? 0 : Fee
        }
    }, [pateintid, doctor, appinmnt_date, daysdiff, Fee, renewal, tokentaken])


    const SaveAppoinment = useCallback(() => {
        const insertVistMaster = async (postVisitMast) => {
            const result = await axioslogin.post('/Appoinments/visitMasterAppoinmentInsert', postVisitMast);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify("Appoinment Saved")
                modalcolse()
            } else {
                warningNotify(message)
            }
        }
        if (pateintid !== '') {
            insertVistMaster(postVisitMast)

        } else {
            warningNotify("Please Select Patient before save")
        }

    }, [pateintid, postVisitMast, modalcolse])

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth

            aria-describedby="alert-dialog-slide-descriptiona"
        >
            < DialogContent id="alert-dialog-slide-descriptiona"
                sx={{
                    minWidth: "100%",
                    minHeight: 250
                }}
            >
                < DialogContentText id="alert-dialog-slide-descriptiona" sx={{ width: "100%", textAlign: "center" }}>
                    Booking Appoinments
                </DialogContentText>

                <Paper >
                    <Box sx={{
                        width: "100%",
                        pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                        display: "flex",
                        flexDirection: { xl: "row", lg: "row", md: "row", sm: 'row', xs: "row" },
                        justifyContent: 'center',
                    }}>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={radiovalue}
                            onChange={(e) => updateRadioClick(e)}
                        >
                            <FormControlLabel value='1' control={<Radio />} label="Booking" />
                            {/* <FormControlLabel value='2' control={<Radio />} label="New Registration" /> */}
                        </RadioGroup>
                    </Box>

                    {radiovalue !== '2' ?
                        <Box>
                            <Box sx={{
                                width: "100%", pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                                display: "flex", flexDirection: 'row'
                            }}>
                                <Box sx={{ width: "20%", pl: 1, pt: 0.5 }}></Box>
                                <Box sx={{ width: "25%", pl: 1, pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Enter UH Id</Typography>
                                </Box>
                                <Box sx={{ width: "25%", }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="pateintid"
                                        value={pateintid}
                                        handleChange={updatePatientId}
                                    />
                                </Box>
                                <Box sx={{ width: '3%', pl: 2, }}>
                                    <CusIconButton size="sm" variant="outlined" clickable="true" onClick={searchbyPateintId} >
                                        <SearchOutlinedIcon color='primary' fontSize='small' />
                                    </CusIconButton>
                                </Box>
                            </Box>

                            <Box sx={{
                                width: "100%", pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                                display: "flex", flexDirection: 'row'
                            }}>
                                <Box sx={{ width: "24%", pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Salutation</Typography>
                                </Box>
                                <Box sx={{ width: "20%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="salutation"
                                        value={salutation}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "20%", pt: 0.5, pl: 1 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint Name</Typography>
                                </Box>
                                <Box sx={{ width: "50%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_name"
                                        value={patient_name}
                                        disable={true}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{
                                width: "100%", pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                                display: "flex", flexDirection: 'row'
                            }}>
                                <Box sx={{ width: "20%", pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint Address</Typography>
                                </Box>
                                <Box sx={{ width: "80%", pr: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_address"
                                        value={patient_address}
                                        disable={true}
                                    />
                                </Box>
                            </Box>

                            <Box sx={{
                                width: "100%", pl: 1, pt: 0.5, pr: 1, pb: 0.5, flex: 1,
                                display: "flex", flexDirection: 'row'
                            }}>
                                <Box sx={{ width: "20%", pt: 0.5 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Mobile No</Typography>
                                </Box>
                                <Box sx={{ width: "50%", pl: 1 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_mobile"
                                        value={patient_mobile}
                                        disable={true}
                                    />
                                </Box>
                                <Box sx={{ width: "15%", pt: 0.5, pl: 2 }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Age</Typography>
                                </Box>
                                <Box sx={{ width: "20%", pr: 1.5 }}>
                                    <CustomInput
                                        type="text"
                                        size="sm"
                                        name="patient_age"
                                        value={patient_age}
                                        disable={true}
                                    />
                                </Box>
                            </Box>
                        </Box> :
                        <Box>




                        </Box>
                    }
                    <Box>
                    </Box>
                </Paper>
            </DialogContent>
            <DialogActions>
                <Button onClick={SaveAppoinment} color="secondary" >Save</Button>
                <Button onClick={modalcolse} color="secondary" >Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default memo(AppoinmentModal)