import React from 'react';
import { TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { searchExternalAsync, selectSearchState, setQuery } from './slice';
import { useRouter, usePathname } from 'next/navigation';

export default function SearchContainer({ className }: { className?: string}) {
    const { query } = useAppSelector(selectSearchState);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const handleFieldChange = (e: React.ChangeEvent<{ value: string }>) => {
        const value = e.target.value;

        if (value.length > 3) {
            dispatch(searchExternalAsync(value)).then(() => {
                if (pathname !== '/search')
                    router.push('/search');
            });
        }

        dispatch(setQuery(value));
    };

    return (
        <div className={className + " search-bar text-center w-full"}>
            <TextField
                id="lesson-search"
                fullWidth
                label="Search Lessons"
                type="search"
                variant="outlined"
                color="secondary"
                size="small"
                value={query}
                onChange={handleFieldChange}
            />
        </div>
    );
};
