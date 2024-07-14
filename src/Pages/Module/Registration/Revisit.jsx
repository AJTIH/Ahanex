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
import ShowPAge from './ShowPAge'


const Revisit = () => {

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

    const [speciality, setspeciality] = useState(0)
    const [doctor, setDoctor] = useState(0)
    const [lastToken, setLastToken] = useState(0)
    const [feedetail, setFeeDetail] = useState({
        Fee: '',
        token_start: '',
        token_end: '',
        renewal: ''
    })
    const { Fee, token_start, token_end, renewal } = feedetail
    const [tokentaken, setTokenTaken] = useState(0)
    const [daysdiff, setDayDiff] = useState(0)
    const [modalFlag, setModalFlag] = useState(false)
    const [modal, setModal] = useState(0)
    const [lastVisitId, setLastVisitId] = useState(0)
    useEffect(() => {
        const getDoctortoken = async (doctor) => {
            const result = await axioslogin.get(`/patientRegistration/getDoctortokenDetail/${doctor}`)
            const { success, data } = result.data
            if (success === 1) {
                const { lasttoken_no } = data[0]
                setLastToken(lasttoken_no)
            } else {
                setLastToken(0)
            }
        }
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


        getDoctortoken(doctor)
        getDoctorFee(doctor)
        const postData = {
            patient_id: pateintid,
            doctor_slno: doctor
        }
        getLastVistdate(postData)
    }, [doctor, pateintid])

    const search = useCallback(() => {
        const getPatientDetails = async (pateintid) => {
            const result = await axioslogin.get(`/patientRegistration/PatientDetailsGtting/${pateintid}`)
            const { success, data } = result.data
            if (success === 1) {
                setTokenTaken(1)
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
                setTokenTaken(0)
                warningNotify("No patient in given id")
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

        setspeciality(0)
        setDoctor(0)
        setLastToken(0)

        const resetfee = {
            Fee: '',
            token_start: '',
            token_end: '',
            renewal: ''
        }
        setFeeDetail(resetfee)
        setTokenTaken(0)
        setDayDiff(0)
        setLastVisitId(0)
        setModal(0)
        setModalFlag(false)
    }, [])

    const referesh = useCallback(() => {
        reset()
    }, [reset])

    const postVisitMast = useMemo(() => {
        return {
            patient_id: pateintid,
            visit_date: format(new Date(), "yyyy-MM-dd"),
            doctor_slno: doctor,
            token_no: lastToken === 0 ? token_start : lastToken + 1,
            fee: daysdiff <= renewal ? 0 : Fee
        }
    }, [pateintid, doctor, lastToken, token_start, Fee, daysdiff, renewal])



    const submit = useCallback(() => {

        const insertVistMaster = async (postVisitMast) => {
            const result = await axioslogin.post('/patientRegistration/visitMasterInsert', postVisitMast);
            const { success, message, insetid } = result.data

            if (success === 1) {
                setLastVisitId(insetid)
                succesNotify("Visit saved")
                setModal(1)
                setModalFlag(true)
            } else {
                warningNotify(message)
            }
        }


        if (tokentaken === 1) {
            if (doctor !== 0) {
                if (token_end >= lastToken + 1) {
                    insertVistMaster(postVisitMast)
                }
                else {
                    warningNotify("Token Finished")
                }
            } else {
                warningNotify("Please select Doctor")
            }

        } else {
            warningNotify("Please Select patient before save")
        }
    }, [tokentaken, postVisitMast, token_end, lastToken, doctor])






    const viewdata = useCallback(() => {

    }, [])






    return (


        <Box sx={{ width: "100%", p: 5 }}>
            <ToastContainer />
            {modal === 1 ? <ShowPAge open={modalFlag} lastVisitId={lastVisitId} reset={reset} flag={0} /> : null}
            {/* 1st section starts */}
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
                        <Typography level='body-md' fontWeight='lg' >REVISIT</Typography>
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


                        {
                            tokentaken === 1 ?

                                <Box>
                                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Speciality</Typography>
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Doctor Name</Typography>
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Fee</Typography>
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Token No</Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                        <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                            <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                            <DoctorDropDownBySepciality doctor={doctor} setDoctor={setDoctor} speciality={speciality} />
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, pr: 1 }}>
                                            <CustomInput
                                                type="text"
                                                size="sm"
                                                name="Fee"
                                                value={daysdiff <= renewal ? 0 : Fee}
                                                disable={true}
                                            />
                                        </Box>
                                        <Box sx={{ width: "25%", pt: 0.5, }}>
                                            <CustomInput
                                                type="text"
                                                size="sm"
                                                value={doctor === 0 ? 0 : lastToken === 0 ? token_start : lastToken + 1}
                                                disable={true}
                                            />
                                        </Box>
                                    </Box>

                                </Box> : null
                        }


                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 2, pb: 2 }}>
                            <Box sx={{ width: "40%", pt: 0.5, }}>

                            </Box>
                            <Box sx={{ width: "80%", pt: 0.5, display: 'flex', flexDirection: "row" }}>
                                <Box sx={{ pl: 2 }}>
                                    <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                                </Box>
                                {/* <Box sx={{ pl: 2 }}>
                                    <Button color="primary" variant="contained" onClick={viewdata}>view</Button>
                                </Box>
                                <Box sx={{ pl: 2 }}>
                                    <Button color="primary" variant="contained" >close</Button>
                                </Box> */}
                            </Box>

                        </Box>
                    </Box>
                </Box>
            </Paper >
        </Box >

    )
}

export default Revisit