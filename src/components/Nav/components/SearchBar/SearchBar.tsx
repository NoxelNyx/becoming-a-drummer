import React from 'react';
import { TextField, Popover, Typography, Box, Divider, IconButton, Chip, InputAdornment, Input } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { searchExternalAsync, selectSearchState, setQuery } from './slice';
import SearchResult from '../SearchResult';

export default function SearchContainer({ className }: { className?: string }) {
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<null | HTMLElement>(null);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [currentWidth, setCurrentWidth] = React.useState(0);
    const { query, videos } = useAppSelector(selectSearchState);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    const handleQueryKeyup = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            dispatch(searchExternalAsync(query as string));

            handlePopoverOpen();
        }
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setQuery(e.target.value));
    };

    const handlePopoverOpen = () => {
        setPopoverOpen(true);

        const el = popoverRef.current?.children[2];
        el?.scrollTo({ left: 0, behavior: "auto" });
    };

    const handlePopoverClose = () => {
        dispatch(setQuery(''));
        setPopoverOpen(false);
        setPopoverAnchorEl(null);
    };

    const handleFocus = (e: React.FocusEvent) => {
        setCurrentWidth(e.target.clientWidth);
        setPopoverAnchorEl(e.target.parentNode?.parentElement?.parentElement as HTMLElement); //lol
    };

    React.useEffect(() => {
        const el = popoverRef.current?.children[2];

        if (el) {
            const onWheel = (e: any) => {
                if (e.deltaY == 0) return;

                e.preventDefault();
                if (e.deltaY < 0)
                    el.scrollTo({
                        left: el.scrollLeft + e.deltaY - 100,
                        behavior: "auto"
                    });
                else
                    el.scrollTo({
                        left: el.scrollLeft + e.deltaY + 100,
                        behavior: "auto"
                    });
            };

            el.addEventListener("wheel", onWheel);

            return () => el.removeEventListener("wheel", onWheel);
        }
    }, [videos]);

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
                hidden={popoverOpen}
                onKeyUp={handleQueryKeyup}
                onChange={handleQueryChange}
                onFocus={handleFocus} />
            <Popover
                open={popoverOpen}
                anchorEl={popoverAnchorEl}
                onClose={handlePopoverClose}
                transformOrigin={{ horizontal: 'center', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
                color='secondary'
                elevation={7}
                marginThreshold={-2}
                ref={popoverRef}
                slotProps={{
                    paper: {
                        style: { width: currentWidth + 16, paddingTop: 14, paddingLeft: 8, paddingRight: 8, marginLeft: -8, marginTop: -14, maxHeight: 800 },
                        className: 'hide-scrollbar'
                    }
                }} >
                <TextField
                    id="lesson-search"
                    fullWidth
                    label="Search Lessons"
                    type="search"
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{ width: currentWidth, position: 'fixed' }}
                    value={query}
                    onChange={handleQueryChange}
                    onKeyUp={handleQueryKeyup}
                    autoFocus />
                <Box padding={3} marginTop={3}>
                    <Typography variant="h4">Results</Typography>
                    <Divider />
                    {(videos.length > 0) &&
                        <Box display={'flex'}>
                            {videos.map((video: any) =>
                                <SearchResult
                                    key={video.id.videoId}
                                    videoId={video.id.videoId}
                                    duration={video.contentDetails.duration}
                                    url={video.snippet.thumbnails.medium.url}
                                    title={video.snippet.title}
                                    description={video.snippet.description}
                                    handlePopoverClose={handlePopoverClose} />
                            )}
                        </Box>
                    }
                </Box>
            </Popover>
        </div>
    );
};
