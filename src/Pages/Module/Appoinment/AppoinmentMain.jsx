import React, { useCallback, memo, useState, useMemo, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'
import { useNavigate } from 'react-router-dom'
import CusCheckbox from '../../../Components/CusCheckbox'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import DoctorDropDownBySepciality from '../../../Components/DoctorDropDownBySepciality'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CusIconButton from '../../../Components/CusIconButton'
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';


const AppoinmentMain = () => {
    const [speciality, setspeciality] = useState(0)
    const [doctor, setDoctor] = useState(0)
    const [appinmnt_date, setAppinmnt_date] = useState('')

    const updateAppinmnt_date = useCallback((e) => {
        setAppinmnt_date(e.target.value)
    }, [])

    const postData = useMemo(() => {
        return {

        }
    }, [])

    const searchbyCondtn = useCallback(() => {

        if (doctor !== 0 && appinmnt_date !== '') {

        } else {
            warningNotify("Please select doctor and date Before serach")
        }

    }, [postData, doctor, appinmnt_date])


    const RefreshFunctn = useCallback(() => {


    }, [])

    const CloseFnctn = useCallback(() => {


    }, [])

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
                        <Typography level='body-md' fontWeight='lg' >Appoinments</Typography>
                    </Box>

                    <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>
                        <Box sx={{ width: "100%", display: 'flex', flexDirection: "row", }}>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Speciality</Typography>
                            </Box>

                            <Box sx={{ width: "20%", pt: 0.5, pl: 1 }}>
                                <SpecialityDropDown speciality={speciality} setspeciality={setspeciality} />
                            </Box>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Doctor</Typography>
                            </Box>
                            <Box sx={{ pl: 2, width: "20%" }}>
                                <DoctorDropDownBySepciality doctor={doctor} setDoctor={setDoctor} speciality={speciality} />
                            </Box>
                            <Box sx={{ width: "10%", pt: 0.5, pl: 1 }}>
                                <Typography sx={{ fontSize: 13, fontFamily: 'sans-serif', fontWeight: 550 }} >Date</Typography>
                            </Box>

                            <Box sx={{ width: "15%", pl: 1 }}>
                                <CustomInput
                                    type="date"
                                    size="sm"
                                    name="appinmnt_date"
                                    value={appinmnt_date}
                                    handleChange={updateAppinmnt_date}
                                />
                            </Box>

                            <Box sx={{ width: '3%', pl: 2, }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" onClick={searchbyCondtn} >
                                    <SearchOutlinedIcon color='primary' fontSize='small' />
                                </CusIconButton>
                            </Box>
                            <Box sx={{ width: '2%', pl: 2 }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" onClick={RefreshFunctn} >
                                    <RefreshIcon color='primary' fontSize='small' />
                                </CusIconButton>
                            </Box>
                            <Box sx={{ width: '4%', pl: 4 }}>
                                <CusIconButton size="sm" variant="outlined" clickable="true" onClick={CloseFnctn} >
                                    <CloseIcon color='primary' fontSize='small' />
                                </CusIconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ width: '80%', display: 'flex', pt: 2.5, margin: 'auto ', pl: 10, flexDirection: "column" }}>





                    </Box>

                </Box>

            </Paper>

        </Box>
    )
}

export default AppoinmentMain