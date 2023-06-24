import React, { FC, ReactElement } from 'react'
import Image from 'next/image'
import logo from './logo-no-bg.png'

import './Logo.css';

type LogoProps = {
    className?: string,
    children?: JSX.Element | JSX.Element[] | boolean,
    handleOnClick?: () => void,
    sizes?: string,
    height?: number
}

const Logo: FC<LogoProps> = ({ className, children, handleOnClick, sizes, height }): ReactElement => {
    className += ' logo';

    return (
        <div className="logo-container">
            <Image
                src={logo}
                className={className}
                sizes={sizes}
                height={height}
                onClick={handleOnClick}
                alt="logo" />
            {children}
        </div>
    )
};

export default Logo;