import { Button, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react'
import {Avatar as AvatarLogo} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUSER } from '../features/auth/authSlice';
import { Bookmark, Logout } from '@mui/icons-material';

interface Props{
    logout:()=>void
    userInfo:IUSER
}
function Avatar({logout,userInfo}:Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const navigate = useNavigate()
    const avatarOpen = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div>
            <Button
                id="basic-button"
                aria-controls={avatarOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={avatarOpen ? 'true' : undefined}
                onClick={handleClick}
            >
                <AvatarLogo>
                    
                </AvatarLogo>
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={avatarOpen}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >   
            <h2 className='px-4 py-1.5'>{userInfo.email}</h2>
                <MenuItem onClick={()=>navigate("stored")} className='flex gap-2'>
                    <Bookmark className='text-gray-800'/>
                    Watch list
                </MenuItem>
                <MenuItem  className='flex gap-2' onClick={logout}>
                    <Logout className='text-gray-800'/>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    )
}

export default Avatar