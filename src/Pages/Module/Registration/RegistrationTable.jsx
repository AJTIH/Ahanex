import React, { useEffect, memo, useState, useCallback, useMemo } from 'react'
import { axioslogin } from '../../../AxiosConfig/Axios'
import { warningNotify } from '../../../Components/CommonCode'
import { Box, } from '@mui/material'
import { CssVarsProvider } from '@mui/joy/'
import Table from '@mui/joy/Table';
import { Paper } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import CustomInput from '../../../Components/CustomInput'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CusIconButton from '../../../Components/CusIconButton'
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';


const RegistrationTable = ({ rowSelect, CloseFnctn }) => {
    const [tableData, setTabledata] = useState([])
    const [regmaster, setRegmaster] = useState({
        patient_name: '',
        patient_address: '',
        patient_place: '',
        patient_pincode: '',
        patient_district: '',
        patient_mobile: ''
    })
    //Destructuring
    const { patient_name, patient_address, patient_place, patient_pincode, patient_district, patient_mobile } = regmaster
    const updateregistrationState = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setRegmaster({ ...regmaster, [e.target.name]: value })
    }, [regmaster])

    const postData = useMemo(() => {
        return {
            patient_name: patient_name
        }
    }, [patient_name])
    const searchbyCondtn = useCallback(() => {


        const getBySpecName = async (postData) => {
            const result = await axioslogin.post('/patientRegistration/searchprocedureName', postData)
            const { data, success } = result.data
            if (success === 1) {
                setTabledata(data)
            }
            else {
                warningNotify("No Doctor Found in given condition")
            }
        }
        if (patient_name !== '') {
            getBySpecName(postData)


        } else {
            warningNotify("Please Select any condition before search")
        }


    }, [postData, patient_name])

    const RefreshFunctn = useCallback(() => {

    }, [])

    return (

        <Paper className='w-full flex flex-1 flex-col m-5 p-5  items-center justify-center gap-1 ' >
            <Box className="flex justify-center items-center p-3 ">
                <Box sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>

                    <Box sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row", pb: 2
                    }}>
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}></Box>
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}>
                            <CustomInput placeholder={"Patient Name"}
                                type="text"
                                size="sm"
                                name="patient_name"
                                value={patient_name}
                                handleChange={updateregistrationState}
                            />
                        </Box>

                        <Box sx={{ width: '3%', pl: 2, }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={searchbyCondtn} >
                                <SearchOutlinedIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '2%' }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={RefreshFunctn} >
                                <RefreshIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ width: '3%', pl: 0.5 }}>
                            <CusIconButton size="sm" variant="outlined" clickable="true" onClick={CloseFnctn} >
                                <CloseIcon color='primary' fontSize='small' />
                            </CusIconButton>
                        </Box>
                        <Box sx={{ pl: 0.8, width: "30%", cursor: "pointer" }}></Box>
                    </Box>
                    <Box sx={{
                        borderBottom: 1, borderWidth: 0.1, borderColor: 'black', minHeight: 300, maxHeight: 600,
                        overflow: 'auto'
                    }} >
                        <CssVarsProvider>
                            <Table stickyHeader>
                                <thead>
                                    <tr>
                                        <th style={{ width: '15%', align: "center" }}>Sl No</th>
                                        <th style={{ width: '30%', align: "center" }}>Patient ID</th>
                                        <th style={{ width: '30%', align: "center" }}>Patient Name</th>
                                        <th style={{ width: '30%', align: "center" }}>Patient Address </th>
                                        <th style={{ width: '30%', align: "center" }}>Patient Place </th>
                                        <th style={{ width: '30%', align: "center" }}>Patient Mobile</th>
                                        <th style={{ width: '30%', align: "center" }}>Patient Dob</th>
                                        <th style={{ width: '10%', align: "center" }}>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData && tableData.map((val, index) => {
                                        return <tr
                                            key={index}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 }, maxHeight: 60,
                                                minHeight: 5
                                            }}
                                        >
                                            <td> {index + 1}</td>
                                            <td> {val.patient_id}</td>
                                            <td> {val.patient_name}</td>
                                            <td> {val.patient_address}</td>
                                            <td> {val.patient_place}</td>
                                            <td> {val.patient_mobile}</td>
                                            <td> {val.patient_dob}</td>
                                            <td>
                                                <EditIcon size={6} color='primary' onClick={() => rowSelect(val)} />
                                            </td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </CssVarsProvider>
                    </Box>

                </Box>
            </Box>
        </Paper>
    )
}

export default RegistrationTable