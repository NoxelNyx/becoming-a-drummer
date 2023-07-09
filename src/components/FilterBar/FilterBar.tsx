import React from 'react';
import { Box } from '@mui/material';
import CommunityContentFilter from './components/CommunityContentFilter';
import filters from './filters.json';

type FilterBarProps = {
    handleFilterSelect: (label: string, selected: boolean, filterKey: string) => void,
    selectedFilters: string[]
};

export default function FilterBar({ handleFilterSelect, selectedFilters }: FilterBarProps) {
    return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexWrap={'wrap'} marginTop={3}>
            <Box display={'contents'}>
                {
                    filters.type.map((filter, index) => (
                        <CommunityContentFilter key={index} label={filter} color='secondary' filterKey='type' handleFilterSelect={handleFilterSelect} selected={selectedFilters.includes(filter)} />
                    ))
                }
            </Box>
            <Box marginTop={3}>
                {
                    filters.difficulty.map((filter, index) => (
                        <CommunityContentFilter key={index} label={filter} color='default' filterKey='difficulty' handleFilterSelect={handleFilterSelect} selected={selectedFilters.includes(filter)} />
                    ))
                }
            </Box>
        </Box>
    );
}