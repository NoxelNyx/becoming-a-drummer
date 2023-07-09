import React from 'react';
import { Chip } from '@mui/material';

type CommunityContentFilterProps = {
    label: string,
    color?: any,
    selected: boolean,
    filterKey: string,
    handleFilterSelect: (label: string, selected: boolean, filterKey: string) => void
};

export default function CommunityContentFilter({ label, color, selected, filterKey, handleFilterSelect }: CommunityContentFilterProps) {
    const handleOnClick = () => {
        handleFilterSelect(label, !selected, filterKey);
    };

    return (
        <Chip variant={selected ? 'filled' : 'outlined'} color={color || 'default'} label={label} onClick={handleOnClick} />
    );
}