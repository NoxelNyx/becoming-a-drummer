import React from 'react';
import { Chip } from '@mui/material';

type CommunityContentFilterProps = {
    label: string,
    color?: any,
    selected: boolean,
    handleFilterSelect: (label: string, selected: boolean) => void
};

export default function CommunityContentFilter({ label, color, selected, handleFilterSelect }: CommunityContentFilterProps) {
    const handleOnClick = () => {
        handleFilterSelect(label, !selected);
    };

    return (
        <Chip variant={selected ? 'filled' : 'outlined'} color={color || 'default'} label={label} onClick={handleOnClick} />
    );
}