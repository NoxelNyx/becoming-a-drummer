import React from 'react';
import { TextField, Popover, Typography, Box, Divider, IconButton, Chip, InputAdornment, Input, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { searchExternalAsync, selectSearchState, resetVideos } from './slice';
import SearchResult from './components/SearchResult';

type SearchContainerProps = {
    className?: string,
    handleOnResultSelect: (id: string, title: string, thumbnailUrl: string) => void
};

export default function SearchContainer({ className, handleOnResultSelect }: SearchContainerProps) {
    const [popoverAnchorEl, setPopoverAnchorEl] = React.useState<null | HTMLElement>(null);
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [currentWidth, setCurrentWidth] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const { videos } = useAppSelector(selectSearchState);
    const popoverRef = React.useRef<HTMLDivElement | null>(null);
    const searchBarRef = React.useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();

    const handleQueryKeyup = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            searchBarRef.current?.blur();
            dispatch(searchExternalAsync(searchQuery));

            handlePopoverOpen();
        }
    };

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handlePopoverOpen = () => {
        setPopoverOpen(true);

        const el = popoverRef.current?.children[2];
        el?.scrollTo({ left: 0, behavior: "auto" });
    };

    const handlePopoverClose = () => {
        setSearchQuery('');
        setPopoverOpen(false);
        setPopoverAnchorEl(null);

        setTimeout(() => {
            dispatch(resetVideos());
        }, 1000);
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
                        left: el.scrollLeft + e.deltaY - 1,
                        behavior: "auto"
                    });
                else
                    el.scrollTo({
                        left: el.scrollLeft + e.deltaY + 1,
                        behavior: "auto"
                    });
            };

            el.addEventListener("wheel", onWheel);

            return () => el.removeEventListener("wheel", onWheel);
        }
    }, [videos]);

    return (
        <div className={className + " search-bar text-center w-full"} style={{ padding: '20px'}}>
            <TextField
                id="video-search"
                fullWidth
                label="Search YouTube"
                type="search"
                variant="outlined"
                color="secondary"
                size="small"
                value={searchQuery}
                hidden={popoverOpen}
                onKeyUp={handleQueryKeyup}
                onChange={handleQueryChange}
                onFocus={handleFocus}
                inputRef={searchBarRef} />
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
                    id="video-search-popover"
                    fullWidth
                    label="Search Videos"
                    type="search"
                    variant="outlined"
                    color="secondary"
                    size="small"
                    sx={{ width: currentWidth, position: 'fixed' }}
                    value={searchQuery}
                    onChange={handleQueryChange}
                    onKeyUp={handleQueryKeyup}
                    autoFocus />
                <Box padding={3} marginTop={3} minHeight={'200px'}>
                    <Typography variant="h4" position={'fixed'}>Results</Typography>
                    <Divider sx={{ position: 'fixed', width: '484px', marginTop: '43px' }} />
                    {(videos.length > 0) &&
                        <Box display={'flex'} marginTop={ '2.5rem' }>
                            {videos.map((video: any) =>
                                <SearchResult
                                    key={video.id.videoId}
                                    id={video.id.videoId}
                                    duration={video.contentDetails.duration}
                                    url={video.snippet.thumbnails.medium.url}
                                    title={video.snippet.title}
                                    description={video.snippet.description}
                                    handlePopoverClose={handlePopoverClose}
                                    handleOnSelect={handleOnResultSelect} />
                            )}
                        </Box>
                    }
                    {(videos.length === 0) &&
                        <CircularProgress color='secondary' sx={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '75px', display: 'flex'}} />
                    }
                </Box>
            </Popover>
        </div>
    );
};
