import React, { FC, ReactElement } from 'react'
import Image from 'next/image'
import logo from '@/public/logo-no-bg.png'
import { Box } from '@mui/material';

import './Logo.css';

type LogoProps = {
    className?: string,
    children?: JSX.Element | JSX.Element[] | boolean,
    handleOnClick?: () => void,
    sizes?: string,
    height?: number
}

const Logo: FC<LogoProps> = ({ className, children, handleOnClick, sizes, height }): ReactElement => {
    className = className ? `${className} logo` : 'logo';

    return (
        <Box justifyContent={'center'} alignItems={'center'} display={'flex'}>   
            <Image
                src={logo}
                className={className}
                sizes={sizes}
                height={height}
                onClick={handleOnClick}
                alt="logo" />
                {children}
        </Box>
    )
};

export default Logo;