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
    handleTypeFilterSelect: (label: string, selected: boolean) => void,
    handleDifficultyFilterSelect: (label: string, selected: boolean) => void,
    selectedTypeFilters: string[],
    selectedDifficultyFilters: string[]
};

export default function FilterBar({ handleTypeFilterSelect, handleDifficultyFilterSelect, selectedTypeFilters, selectedDifficultyFilters }: FilterBarProps) {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'} marginTop={3}>
            <Box display={'contents'}>
                {
                    filters.type.map((filter, index) => (
                        <CommunityContentFilter key={index} label={filter} color='secondary' handleFilterSelect={handleTypeFilterSelect} selected={selectedTypeFilters.includes(filter)} />
                    ))
                }
            </Box>
            {selectedTypeFilters.length > 0 &&
                <Box marginTop={3}>
                    {
                        filters.difficulty.map((filter, index) => (
                            <CommunityContentFilter key={index} label={filter} color='default' handleFilterSelect={handleDifficultyFilterSelect} selected={selectedDifficultyFilters.includes(filter)} />
                        ))
                    }
                </Box>
            }
        </Box>
    );
}