import React, { useCallback, memo, useState, useMemo, useEffect, Fragment } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import SalutationDropDown from '../../../Components/SalutationDropDown'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { differenceInYears, format, getMonth } from 'date-fns'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import DoctorDropDownBySepciality from '../../../Components/DoctorDropDownBySepciality'
import ShowPAge from './ShowPAge'
import { useNavigate } from 'react-router-dom'
import RegistrationTable from './RegistrationTable'

const Registration = () => {
    const navigate = useNavigate()
    const [salutn, setSalutn] = useState(0)
    const [registration, setRegistration] = useState({
        patient_name: '',
        patient_address: '',
        patient_place: '',
        patient_pincode: '',
        patient_district: '',
        patient_mobile: '',
        patient_slno: ''

    })
    //Destructuring
    const { patient_name, patient_address, patient_place, patient_pincode, patient_district,
        patient_mobile, patient_slno } = registration
    const updateregistrationState = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setRegistration({ ...registration, [e.target.name]: value })
    }, [registration])

    const [patient_dob, setpatient_dob] = useState('')
    const [agesplit, setAgesplit] = useState({
        patient_age: 0,
        patient_month: 0,
        patient_day: 0,
    })
    const { patient_age, patient_month, patient_day } = agesplit

    const updatepatient_dob = useCallback((e) => {
        setpatient_dob(e.target.value)
        const ageyear = differenceInYears(new Date(), new Date(e.target.value))
        const dobmonth = getMonth(new Date(e.target.value))
        const currntmonth = getMonth(new Date())
        const diifmonth = currntmonth - dobmonth
        const frmsetting = {
            patient_age: ageyear,
            patient_month: diifmonth,
            patient_day: 12,
        }
        setAgesplit(frmsetting)
    }, [])
    const [speciality, setspeciality] = useState(0)
    const [doctor, setDoctor] = useState(0)
    const [patientId, setPatientId] = useState(0)
    const [lastToken, setLastToken] = useState(0)
    const [feedetail, setFeeDetail] = useState({
        Fee: '',
        token_start: '',
        token_end: '',
    })
    const { Fee, token_start, token_end, } = feedetail

    useEffect(() => {

        const getPatientId = async () => {
            const result = await axioslogin.get(`/patientRegistration/PatientIdget`)
            const { success, data } = result.data
            if (success === 1) {
                const { patient_no } = data[0]
                setPatientId(patient_no)
            }
            else {
                warningNotify("Error occured in EDp")
            }
        }
        getPatientId();

    }, [])
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
        if (doctor !== 0) {
            getDoctortoken(doctor)
            getDoctorFee(doctor)
        }

    }, [doctor])

    const postData = useMemo(() => {
        return {
            patient_id: patientId,
            salutation: salutn,
            patient_name: patient_name,
            patient_address: patient_address,
            patient_place: patient_place,
            patient_pincode: patient_pincode,
            patient_district: patient_district,
            patient_mobile: patient_mobile,
            patient_dob: patient_dob,
            patient_age: patient_age,
            patient_month: patient_month,
            patient_day: patient_day,
            patient_no: patientId + 1
        }
    }, [salutn, patient_name, patient_address, patient_place, patient_pincode, patient_district, patient_mobile, patient_dob, patient_age,
        patient_month, patient_day, patientId])

    const postVisitMast = useMemo(() => {
        return {
            patient_id: patientId,
            visit_date: format(new Date(), "yyyy-MM-dd"),
            doctor_slno: doctor,
            token_no: lastToken === 0 ? token_start : lastToken + 1,
            fee: Fee
        }
    }, [patientId, doctor, lastToken, token_start, Fee])
    const patchdata = useMemo(() => {
        return {
            salutation: salutn === 0 ? null : salutn,
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
    }, [salutn, patient_name, patient_address, patient_place, patient_pincode, patient_district, patient_mobile, patient_dob, patient_age,
        patient_month, patient_day])
    const reset = useCallback(() => {
        setSalutn(0)
        const resetdetail = {
            patient_name: '',
            patient_address: '',
            patient_place: '',
            patient_pincode: '',
            patient_district: '',
            patient_mobile: ''

        }
        setRegistration(resetdetail)
        setpatient_dob('')
        const resetdob = {
            patient_age: 0,
            patient_month: 0,
            patient_day: 0,
        }
        setAgesplit(resetdob)
        setspeciality(0)
        setDoctor(0)
        setPatientId(0)
        setLastToken(0)
        const resetfee = {
            Fee: '',
            token_start: '',
            token_end: '',
            renewal: ''
        }
        setFeeDetail(resetfee)
        setLastVisitId(0)
        setModal(0)
        setModalFlag(false)
        const getPatientId = async () => {
            const result = await axioslogin.get(`/patientRegistration/PatientIdget`)
            const { success, data } = result.data
            if (success === 1) {
                const { patient_no } = data[0]
                setPatientId(patient_no)
            }
            else {
                warningNotify("Error occured in EDp")
            }
        }
        getPatientId()
    }, [])


    const submit = useCallback(() => {

        const InsertPatientReg = async (postData) => {

            const result = await axioslogin.post('/patientRegistration', postData);
            return result.data

        }

        const insertVistMaster = async (postVisitMast) => {
            const result = await axioslogin.post('/patientRegistration/visitMasterInsert', postVisitMast);
            const { success, message, insetid } = result.data

            if (success === 1) {
                setLastVisitId(insetid)
                succesNotify(message)
                setModal(1)
                setModalFlag(true)
                // reset()
            } else {
                warningNotify(message)
            }
        }

        if (patient_name !== '' && patient_address !== '' && patient_mobile !== '' && doctor != 0) {
            if (token_end >= lastToken + 1) {
                InsertPatientReg(postData).then((val) => {
                    const { success, message } = val
                    if (success === 1) {
                        insertVistMaster(postVisitMast)
                    } else {
                        warningNotify(message)
                    }
                })
            }
            else {
                warningNotify("Token Finished")
            }

        } else {
            warningNotify("Please Fill Mandatory Fields")
        }


    }, [postData, postVisitMast, patient_name, patient_address, patient_mobile, doctor, token_end, lastToken])

    const [editFlag, setEditFlag] = useState(0)
    const viewdata = useCallback(() => {
        setEditFlag(1)
    }, [])

    const rowSelect = useCallback((value) => {
        setEditFlag(2)

        const { patient_slno, patient_id, salutation, patient_name,
            patient_address, patient_place, patient_pincode, patient_district,
            patient_mobile, patient_dob, patient_age, patient_month, patient_day } = value

        const setFrmdata = {
            patient_name: patient_name,
            patient_address: patient_address,
            patient_place: patient_place,
            patient_pincode: patient_pincode,
            patient_district: patient_district,
            patient_mobile: patient_mobile,
            patient_slno: patient_slno
        }
        setRegistration(setFrmdata)
        setSalutn(salutation)
        setpatient_dob(patient_dob)
        const agereset = {
            patient_age: patient_age,
            patient_month: patient_month,
            patient_day: patient_day,
        }
        setAgesplit(agereset)
        setPatientId(patient_id)
    }, [])

    const CloseFnctn = useCallback(() => {
        setEditFlag(0)
    }, [])
    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])

    return (
        <Fragment>
            {
                editFlag === 1 ?
                    <RegistrationTable rowSelect={rowSelect} CloseFnctn={CloseFnctn} /> :
                    <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >
                        {modal === 1 ? <ShowPAge open={modalFlag} lastVisitId={lastVisitId} reset={reset} flag={1} /> : null}
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >UH Id</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="patientId"
                                    value={patientId.toString().padStart(6, '0')}
                                    disable={true}
                                />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Salutation</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <SalutationDropDown salutn={salutn} setSalutn={setSalutn} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Patient Name</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={'Enter Patient Name'}
                                    type="text"
                                    size="sm"
                                    name="patient_name"
                                    value={patient_name}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Address</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Address"}
                                    type="text"
                                    size="sm"
                                    name="patient_address"
                                    value={patient_address}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2 " >
                                <Typography level='body-md' fontWeight='lg' >Place / Region</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Region / Place"}
                                    type="text"
                                    size="sm"
                                    name="patient_place"
                                    value={patient_place}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>Pincode</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Pincode"}
                                    type="number"
                                    size="sm"
                                    name="patient_pincode"
                                    value={patient_pincode}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>District</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter District"}
                                    type="text"
                                    size="sm"
                                    name="patient_district"
                                    value={patient_district}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>Mobile</Typography>
                            </Box>
                            <Box className="flex-1" >
                                <CustomInput placeholder={"Enter Mobile"}
                                    type="number"
                                    size="sm"
                                    name="patient_mobile"
                                    value={patient_mobile}
                                    handleChange={updateregistrationState} />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4">
                            <Box className="flex flex-1 ml-2" >
                                <Typography level='body-md' fontWeight='lg'>Date Of Birth</Typography>
                            </Box>
                            <Box className="flex flex-1 flex-row" >
                                <CustomInput
                                    type="date"
                                    size="sm"
                                    name="patient_dob"
                                    value={patient_dob}
                                    handleChange={updatepatient_dob}
                                />
                                <Box className="flex flex-grow flex-row items-center" >
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Age</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_age}</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Months</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_month}</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center font-thin text-xs" >Days</Box>
                                    <Box className="flex text-[#75abe2] border-[#75abe2] flex-grow justify-center border rounded-lg p-1" >{patient_day}</Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4" sx={{ pt: 2 }}>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <Typography level='body-md' fontWeight='lg' >Speciality</Typography>
                            </Box>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <Typography level='body-md' fontWeight='lg' >Doctor Name</Typography>

                            </Box>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <Typography level='body-md' fontWeight='lg' >Fee</Typography>
                            </Box>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <Typography level='body-md' fontWeight='lg' >Token No</Typography>

                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4" sx={{}}>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                            </Box>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <DoctorDropDownBySepciality doctor={doctor} setDoctor={setDoctor} speciality={speciality} />
                            </Box>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    name="Fee"
                                    value={Fee}
                                    disable={true}
                                />
                            </Box>
                            <Box sx={{ pl: 2, width: "30%" }}>
                                <CustomInput
                                    type="text"
                                    size="sm"
                                    value={doctor === 0 ? 0 : lastToken === 0 ? token_start : lastToken + 1}
                                    disable={true}
                                />
                            </Box>
                        </Box>
                        <Box className="flex justify-center items-center w-3/4" sx={{ pt: 2 }}>


                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={viewdata}>view</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                            </Box>
                        </Box>
                    </Paper>



            }




        </Fragment>
    )
}

export default memo(Registration)