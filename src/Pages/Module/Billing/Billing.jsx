import React, { useCallback, memo, useState, useMemo, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { format } from 'date-fns'
import RefreshIcon from '@mui/icons-material/Refresh';
import CusIconButton from '../../../Components/CusIconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProcedureDropDown from '../../../Components/ProcedureDropDown'
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import DeleteIcon from '@mui/icons-material/Delete';
import ShowPrint from './ShowPrint'
import { useNavigate } from 'react-router-dom'
import ShowPrintNew from './ShowPrintNew'
const Billing = () => {
    const navigate = useNavigate()
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

    const [procedure, setProcedure] = useState(0)
    const [produrname, setProcedrName] = useState('')
    const [rate, setRate] = useState(0)
    const [detlFlag, setDetlFlag] = useState(0)
    const [dataPost, setdataPost] = useState([])
    const [SlNo, setSlNo] = useState(1)
    const [modalFlag, setModalFlag] = useState(false)
    const [modal, setModal] = useState(0)
    const [lastVisitId, setLastVisitId] = useState(0)
    useEffect(() => {
        const getProcdrDetail = async (procedure) => {
            const result = await axioslogin.get(`/Billing/getProcedureNameRate/${procedure}`)
            const { success, data } = result.data
            if (success === 1) {
                const { procedure_name, procedure_rate } = data[0]
                setProcedrName(procedure_name)
                setRate(procedure_rate)
            } else {
                setProcedrName('')
                setRate(0)
            }
        }
        getProcdrDetail(procedure)
    }, [procedure])

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
        setProcedure(0)
        setProcedrName('')
        setRate(0)
        setDetlFlag(0)
        setdataPost([])
        setSlNo(1)
        setModalFlag(false)
        setModal(0)
        setLastVisitId(0)
    }, [])

    const referesh = useCallback(() => {
        reset()
    }, [reset])


    const AddProcedure = useCallback(() => {
        if (procedure === 0) {
            warningNotify("Please Select Any Procedure")
        } else {
            const newData = {
                id: Math.ceil(Math.random() * 1000),
                slno: SlNo,
                procedure: procedure,
                procedureName: produrname,
                procedureRate: rate,
                status: 1
            }

            const datass = [...dataPost, newData]

            if (datass.length !== 0) {
                setdataPost(datass)
                setProcedure(0)
                setSlNo(SlNo + 1)
            }
            setDetlFlag(1)
        }

    }, [procedure, produrname, produrname, rate])

    let sumProcedureRate = dataPost.reduce((sum, obj) => sum + obj.procedureRate, 0);

    const rowSelect = useCallback((val) => {
        const { slno } = val
        const xx = dataPost?.filter((val) => val.slno !== slno)
        setdataPost(xx)
    }, [dataPost])

    const postData = useMemo(() => {
        return {
            patient_id: pateintid,
            bill_date: format(new Date(), "yyyy-MM-dd hh:mm:ss"),
            bill_amount: sumProcedureRate
        }
    }, [pateintid, sumProcedureRate])

    const submit = useCallback(() => {
        const insertBillMast = async (postVisitMast) => {
            const result = await axioslogin.post('/Billing/insert', postVisitMast);
            return result.data
        }

        const InserBillndetl = async (insertid) => {
            const postdataDetl = dataPost && dataPost.map((val, index) => {
                return {
                    bill_slno: insertid,
                    procedure_slno: val.procedure,
                    procedure_rate: val.procedureRate,
                    bill_proc_slno: index + 1
                }
            })
            const result = await axioslogin.post('/Billing/BillDetailsInsert', postdataDetl);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify(message)
                setModal(1)
                setModalFlag(true)
            } else {
                warningNotify(message)
            }
        }
        if (pateintid !== '') {
            if (dataPost.length !== 0) {
                insertBillMast(postData).then((val) => {
                    const { success, message, insetid } = val
                    if (success === 1) {
                        InserBillndetl(insetid)
                        setLastVisitId(insetid)
                    } else {
                        warningNotify(message)
                    }

                })
            }
            else {
                warningNotify("Please Select Any Procedure")
            }
        } else {
            warningNotify("Patient Id Not Valid, Plase Enter ")
        }


    }, [postData, dataPost, pateintid])


    const CloseMAster = useCallback(() => {
        navigate('/Home')
    }, [])


    const [printflag, setPrintFlag] = useState(0)
    const Printdemo = useCallback(() => {
        setPrintFlag(1)
    }, [])


    return (
        <Box sx={{ width: "100%", p: 5 }}>
            {
                printflag === 1 ? <ShowPrintNew open={printflag} reset={reset} setPrintFlag={setPrintFlag} /> : null
            }
            {modal === 1 ? <ShowPrint open={modalFlag} lastVisitId={lastVisitId} reset={reset}
                patient={patient} pateintid={pateintid} sumProcedureRate={sumProcedureRate} /> : null}
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

                        <Box>
                            <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                <Box sx={{ width: "15%", pt: 0.5, }}>
                                </Box>
                                <Box sx={{ width: "25%", pt: 0.5, }}>
                                    <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Select Procedure</Typography>
                                </Box>
                                <Box sx={{ width: "25%", pt: 0.5, }}>
                                    <ProcedureDropDown procedure={procedure} setProcedure={setProcedure} />
                                </Box>
                                <Box sx={{ width: "25%", pt: 0.5, pl: 2 }}>
                                    <CusIconButton size="sm" variant="outlined" clickable="true" color="primary" onClick={AddProcedure} >
                                        <AddCircleOutlineIcon fontSize='small' />
                                    </CusIconButton>
                                </Box>

                            </Box>


                        </Box>
                        {
                            detlFlag === 1 ?
                                <Box>
                                    <Box sx={{ border: 0.5 }}>
                                        <CssVarsProvider>
                                            <Table stickyHeader>
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '20%', align: "center" }}>Sl No</th>
                                                        <th style={{ width: '60%', align: "center" }}>Procedure Name</th>
                                                        <th style={{ width: '60%', align: "center" }}>Procedure Rate</th>
                                                        <th style={{ width: '10%', align: "center" }}>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {dataPost && dataPost.map((val, index) => {
                                                        return <tr
                                                            key={index}
                                                            sx={{
                                                                '&:last-child td, &:last-child th': { border: 0 }, maxHeight: 60,
                                                                minHeight: 5
                                                            }}
                                                        >
                                                            <td> {index + 1}</td>
                                                            <td> {val.procedureName}</td>
                                                            <td> {val.procedureRate}</td>
                                                            <td>
                                                                <DeleteIcon size={6} onClick={() => rowSelect(val)} />
                                                            </td>
                                                        </tr>
                                                    })}
                                                </tbody>
                                            </Table>
                                        </CssVarsProvider>
                                    </Box>
                                    <Box>
                                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 1 }}>
                                            <Box sx={{ width: "70%", pt: 0.5, }}>
                                            </Box>
                                            <Box sx={{ width: "20%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 15, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >Total Amount</Typography>
                                            </Box>
                                            <Box sx={{ width: "10%", pt: 0.5, }}>
                                                <Typography sx={{ fontSize: 15, fontFamily: 'sans-serif', fontWeight: 550, pl: 8 }} >{sumProcedureRate}</Typography>
                                            </Box>

                                        </Box>
                                    </Box>
                                </Box>
                                : null
                        }

                    </Box>


                    <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", pt: 2, pb: 2 }}>
                        <Box sx={{ width: "50%", pt: 0.5, }}>

                        </Box>
                        <Box sx={{ width: "50%", pt: 0.5, display: 'flex', flexDirection: "row" }}>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={CloseMAster}>Close</Button>
                            </Box>
                            <Box sx={{ pl: 2 }}>
                                <Button color="primary" variant="contained" onClick={Printdemo}>Print</Button>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Paper>
        </Box>



    )
}

export default memo(Billing)