import { IconButton, Tooltip } from '@mui/material'
import React, { memo } from 'react'
import { editicon } from '../color/Color'
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
const EditButton = ({ onClick }) => {
    return (
        <Tooltip title="Edit" arrow>
            <IconButton
                aria-label="add to favorites"
                disableRipple={true}
                sx={{ color: editicon, paddingY: 0.5 }}
                size="small"
                onClick={onClick}
            >
                <EditOutlinedIcon size="small" />
            </IconButton>
        </Tooltip>
    )
}

export default memo(EditButton)
