import React, { useCallback, memo, useState, useMemo, Fragment, useEffect } from 'react'
import { Box } from '@mui/joy'
import { Paper } from '@mui/material'
import Typography from '@mui/joy/Typography'
import CustomInput from '../../../Components/CustomInput'
import SpecialityDropDown from '../../../Components/SpecialityDropDown'
import CusCheckbox from '../../../Components/CusCheckbox'
import Button from '@mui/material/Button';
import { axioslogin } from '../../../AxiosConfig/Axios'
import { ToastContainer } from 'react-toastify'
import { succesNotify, warningNotify } from '../../../Components/CommonCode'

const Settings = () => {


    const [settingmaster, setSettingmaster] = useState({
        clinic_name: '',
        clinic_address: '',
        clinic_mobile: '',
        reg_renewal_fee: '',
        seting_mast_slno: 0

    })
    //Destructuring
    const { clinic_name, clinic_address, clinic_mobile, reg_renewal_fee, seting_mast_slno } = settingmaster
    const updatesettingMaster = useCallback((e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setSettingmaster({ ...settingmaster, [e.target.name]: value })
    }, [settingmaster])

    useEffect(() => {
        const getSettingData = async () => {
            const result = await axioslogin.get(`/settingMaster`)
            const { success, data } = result.data
            if (success === 1) {
                const { clinic_name, clinic_address, clinic_mobile, reg_renewaldays, master_slno } = data[0]
                const frmset = {
                    clinic_name: clinic_name,
                    clinic_address: clinic_address,
                    clinic_mobile: clinic_mobile,
                    reg_renewal_fee: reg_renewaldays,
                    seting_mast_slno: master_slno

                }
                setSettingmaster(frmset)
            } else {
                const reset = {
                    clinic_name: '',
                    clinic_address: '',
                    clinic_mobile: '',
                    reg_renewal_fee: '',
                    seting_mast_slno: 0
                }
                setSettingmaster(reset)
            }
        }
        getSettingData()

    }, [])

    const postData = useMemo(() => {
        return {
            clinic_name: clinic_name,
            clinic_address: clinic_address,
            clinic_mobile: clinic_mobile,
            reg_renewaldays: reg_renewal_fee
        }
    }, [clinic_name, clinic_address, clinic_mobile, reg_renewal_fee])

    const patchData = useMemo(() => {
        return {
            clinic_name: clinic_name,
            clinic_address: clinic_address,
            clinic_mobile: clinic_mobile,
            reg_renewaldays: reg_renewal_fee,
            master_slno: seting_mast_slno
        }
    }, [clinic_name, clinic_address, clinic_mobile, reg_renewal_fee, seting_mast_slno])

    const reset = useCallback(() => {
        const reset = {
            clinic_name: '',
            clinic_address: '',
            clinic_mobile: '',
            reg_renewal_fee: '',
            seting_mast_slno: 0
        }
        setSettingmaster(reset)

    }, [])

    const submit = useCallback(() => {


        const InsertFun = async (postData) => {
            const result = await axioslogin.post('/settingMaster', postData);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }
        const updateFun = async (patchData) => {
            const result = await axioslogin.patch('/settingMaster', patchData);
            const { success, message } = result.data
            if (success === 1) {
                succesNotify(message)
            } else {
                warningNotify(message)
            }
        }
        if (seting_mast_slno === 0) {
            InsertFun(postData)
        } else {
            updateFun(patchData)
        }
    }, [seting_mast_slno, postData, patchData])

    const Close = useCallback(() => {
        reset()
    }, [])

    return (
        <Fragment>

            <ToastContainer />

            <Paper className='w-full flex flex-1 flex-col m-5 p-2  items-center justify-center gap-1 ' >

                <Box className="flex justify-center items-center w-3/4">
                    <Box className="flex-1 ml-2 " >
                        <Typography level='body-md' fontWeight='lg' >Clinic Name</Typography>
                    </Box>
                    <Box className="flex-1" >
                        <CustomInput placeholder={'Enter Clinic Name'}
                            type="text"
                            size="sm"
                            name="clinic_name"
                            value={clinic_name}
                            handleChange={updatesettingMaster}

                        />
                    </Box>
                </Box>

                <Box className="flex justify-center items-center w-3/4">
                    <Box className="flex-1 ml-2 " >
                        <Typography level='body-md' fontWeight='lg' >Clinic Address</Typography>
                    </Box>
                    <Box className="flex-1" >
                        <CustomInput placeholder={'Enter Clinic Address'}
                            type="text"
                            size="sm"
                            name="clinic_address"
                            value={clinic_address}
                            handleChange={updatesettingMaster}

                        />
                    </Box>
                </Box>

                <Box className="flex justify-center items-center w-3/4">
                    <Box className="flex-1 ml-2 " >
                        <Typography level='body-md' fontWeight='lg' >Clinic Mobile No</Typography>
                    </Box>
                    <Box className="flex-1" >
                        <CustomInput placeholder={'Enter Mobile No '}
                            type="text"
                            size="sm"
                            name="clinic_mobile"
                            value={clinic_mobile}
                            handleChange={updatesettingMaster}

                        />
                    </Box>
                </Box>

                <Box className="flex justify-center items-center w-3/4">
                    <Box className="flex-1 ml-2 " >
                        <Typography level='body-md' fontWeight='lg' >Registration renewal Fee</Typography>
                    </Box>
                    <Box className="flex-1" >
                        <CustomInput placeholder={'Enter Registration renewal Fee'}
                            type="text"
                            size="sm"
                            name="reg_renewal_fee"
                            value={reg_renewal_fee}
                            handleChange={updatesettingMaster}

                        />
                    </Box>
                </Box>

                <Box className="flex justify-center items-center w-3/4">


                    <Box sx={{ pl: 2 }}>
                        <Button color="primary" variant="contained" onClick={submit} >Save</Button>
                    </Box>
                    {/* <Box sx={{ pl: 2 }}>
                        <Button color="primary" variant="contained" onClick={viewdata}>view</Button>
                    </Box> */}

                    <Box sx={{ pl: 2 }}>
                        <Button color="primary" variant="contained" onClick={Close} >close</Button>
                    </Box>
                </Box>

            </Paper>
        </Fragment>

    )
}

export default memo(Settings)