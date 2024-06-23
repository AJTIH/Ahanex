import React, { useCallback, memo, useState, useMemo, useEffect, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import SalutationDropDown from '../../../Components/SalutationDropDown'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { differenceInCalendarDays, format } from 'date-fns'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import DoctorDropDownBySepciality from '../../../Components/DoctorDropDownBySepciality'
import RefreshIcon from '@mui/icons-material/Refresh';
import CusIconButton from '../../../Components/CusIconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


const Billing = () => {


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




    const search = useCallback(() => {
        const getPatientDetails = async (pateintid) => {
            const result = await axioslogin.get(`/patientRegistration/PatientDetailsGtting/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
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
                warningNotify("Please enter valid Patient Id")
                const resetfrm = {
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
                }
                setPatient(resetfrm)
            }
        }
        getPatientDetails(pateintid)

    }, [pateintid])

    const reset = useCallback(() => {
        setPatientId('')

        const resetfrmdata = {
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

        }

        setPatient(resetfrmdata)


    }, [])


    const referesh = useCallback(() => {
        reset()
    }, [reset])






    return (
        <Box sx={{ width: "100%", p: 5 }}>
            <ToastContainer />
            <Paper sx={{
                width: '100%',
                mt: 0.8
            }} variant='outlined'>
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: "center" }}>
                        <Typography level='body-md' fontWeight='lg' >Billing</Typography>
                    </Box>

                    <Box sx={{ width: '60%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10 }}>
                        <Box sx={{ pl: 0.8, width: "15%", cursor: "pointer" }}>
                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint No</Typography>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "60%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Enter patient Id"}
                                type="text"
                                size="sm"
                                name="pateintid"
                                value={pateintid}
                                handleChange={updatePatientId} />
                        </Box>
                        <Box sx={{ width: '3%', pl: 1, pr: 0.5 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={search} >
                                <SearchOutlinedIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', pl: 3 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={referesh} >
                                <RefreshIcon fontSize='small' />
                            </CusIconButton>
                        </Box>
                    </Box>

                    <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>

                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>
                            <Box sx={{ width: "10%", pt: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Salutation</Typography>
                            </Box>

                            <Box sx={{ width: "10%", pr: 1 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="salutation"
                                    value={salutation}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint Name</Typography>
                            </Box>
                            <Box sx={{ width: "30%", pr: 1 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_name"
                                    value={patient_name}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Place/Region</Typography>
                            </Box>
                            <Box sx={{ width: "25%", }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_place"
                                    value={patient_place}
                                    disable={true}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                            <Box sx={{ width: "10%", pt: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pateint Address</Typography>
                            </Box>
                            <Box sx={{ width: "50%", pr: 1 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_address"
                                    value={patient_address}
                                    disable={true}
                                />
                            </Box>

                            <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Pin Code</Typography>
                            </Box>
                            <Box sx={{ width: "25%", }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_pincode"
                                    value={patient_pincode}
                                    disable={true}
                                />
                            </Box>
                        </Box>
                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                            <Box sx={{ width: "10%", pt: 0.5, }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >District</Typography>
                            </Box>
                            <Box sx={{ width: "50%", pr: 1 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_district"
                                    value={patient_district}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ width: "10%", pl: 1, pt: 0.5 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Mobile No</Typography>
                            </Box>
                            <Box sx={{ width: "25%", }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_mobile"
                                    value={patient_mobile}
                                    disable={true}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                            <Box sx={{ width: "10%", pt: 0.5, }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Dob</Typography>
                            </Box>
                            <Box sx={{ width: "25%", pr: 1 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_dob"
                                    value={patient_dob}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ width: "5%", pt: 0.5, }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Age</Typography>
                            </Box>
                            <Box sx={{ width: "15%", pr: 1.5 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_age"
                                    value={patient_age}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ width: "5%", pt: 0.5, }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Month</Typography>
                            </Box>
                            <Box sx={{ width: "15%", pr: 1.5 }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_month"
                                    value={patient_month}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ width: "5%", pt: 0.5, }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Days</Typography>
                            </Box>
                            <Box sx={{ width: "16%", pr: 1, }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patient_day"
                                    value={patient_day}
                                    disable={true}
                                />
                            </Box>
                        </Box>








                    </Box>
                </Box>
            </Paper>
        </Box>



    )
}

export default memo(Billing)