import React from 'react'
import Input from '@mui/joy/Input'

const CustomInput = ({ placeholder, name, handleChange, value, type, disable }) => {
    return (
        <Input
            color="primary"
            value={value}
            placeholder={placeholder}
            type={type}
            name={name}
            onChange={handleChange}
            size="sm"
            variant="outlined"
            disable={disable}
        />
    )
}

export default CustomInput