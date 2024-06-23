import React, { Fragment } from 'react'
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItem from '@mui/joy/ListItem';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import Menu from '@mui/icons-material/Menu';
import Search from '@mui/icons-material/Search';
import Divider from '@mui/joy/Divider';
import { Home, KeyboardArrowDown, KeyboardArrowRight, OpenInNew, ReceiptLong } from '@mui/icons-material';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import DrawerMenu from './DrawerMenu';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { colors } from '../Constant/Colors';

const DrawerCustom = ({ open, setOpen }) => {

    const menuName = [
        {
            slno: 1,
            name: 'OP Billing',
            icon: <Home fontSize='small' className='flex text-[#636b74]' />,
            submenu: [
                {
                    slno: 1,
                    name: 'Registration',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Registration'
                },
                {
                    slno: 2,
                    name: 'Revisit',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Revisit'
                },
                {
                    slno: 3,
                    name: 'Billing',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Billing'
                },
            ]
        },
        {
            slno: 2,
            name: 'Master',
            icon: <SettingsIcon fontSize='small' className='flex text-[#636b74]' />,
            submenu: [
                {
                    slno: 1,
                    name: 'Doctor',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Doctor'
                },
                {
                    slno: 2,
                    name: 'Settings',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'Settings'
                },
                {
                    slno: 3,
                    name: 'Procedure Master',
                    icon: <OpenInNew fontSize='small' className='text-[#636b74]' />,
                    navigate: 'ProcedureMaster'
                },
            ]
        },
    ]

    return (
        <Drawer
            open={open}
            onClose={() => setOpen(!open)}
            size="sm"
            variant="persistent"
            sx={{
                backdropFilter: 'blur(0px)',
                transition: '0.5s',
                border: 'none',
                borderRadius: '0px',
                boxShadow: 'none',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    ml: 'auto',
                    mt: 1,
                    mr: 2,
                    // backgroundColor: colors.primary,
                }}
            >
                <Typography
                    component="label"
                    htmlFor="close-icon"
                    fontSize="sm"
                    fontWeight="lg"
                    sx={{ cursor: 'pointer' }}
                    color="primary"
                >
                    Close
                </Typography>
                <ModalClose id="close-icon" sx={{ position: 'initial' }} color='primary' />
            </Box>
            <Divider orientation="horizontal" sx={{ my: 1 }} />
            <Box className="flex flex-1 flex-col justify-between" >
                <Box>
                    {
                        menuName?.map((item) => (
                            <DrawerMenu
                                key={item.slno}
                                item={item}
                            />
                        ))
                    }
                </Box>
                <Box>
                    <Divider orientation="horizontal" sx={{ my: 0 }} />
                    <Box className="flex flex-1  items-center justify-between m-2" >
                        <Box className="flex flex-1 items-center justify-center" >
                            <Typography level='body-md' color='primary' fontWeight='lg'>User Name</Typography>
                        </Box>
                        <IconButton size='sm' color='primary' >
                            <LogoutIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

        </Drawer>
    )
}

export default DrawerCustom