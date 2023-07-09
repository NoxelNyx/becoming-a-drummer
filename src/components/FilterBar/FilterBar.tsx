import React from 'react';
import { Box } from '@mui/material';
import CommunityContentFilter from './components/CommunityContentFilter';

const filters = {
    type: [
        'covers',
        'feet',
        'hands',
        'independence',
        'rudiments',
        'polyrhythms',
        'syncopation',
        'grooves',
        'fills',
        'odd time',
        'other'
    ],
    difficulty: [
        'beginner',
        'intermediate',
        'advanced',
        'expert'
    ]
};

type FilterBarProps = {
    handleFilterSelect: (label: string, selected: boolean) => void,
    selectedFilters: string[]
};

export default function FilterBar({ handleFilterSelect, selectedFilters }: FilterBarProps) {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'} marginTop={3}>
            <Box display={'contents'}>
                {
                    filters.type.map((filter, index) => (
                        <CommunityContentFilter key={index} label={filter} color='secondary' handleFilterSelect={handleFilterSelect} selected={selectedFilters.includes(filter)} />
                    ))
                }
            </Box>
            <Box marginTop={3}>
                {
                    filters.difficulty.map((filter, index) => (
                        <CommunityContentFilter key={index} label={filter} color='default' handleFilterSelect={handleFilterSelect} selected={selectedFilters.includes(filter)} />
                    ))
                }
            </Box>
        </Box>
    );
}