import React, { useState } from 'react';
import { Fab, Popover, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { QuestionMark, ExpandMore, ArrowBackIos } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import recordBtnImage from '@/public/guides/record-btn.png';
import loopSectionEditImage from '@/public/guides/loop-section-edit.png';
import speedControlImage from '@/public/guides/speed-controls.png';
import bookmarkBtnImage from '@/public/guides/bookmark-btn.png';
import contentPanelHeaderBookmardImage from '@/public/guides/content-panel-header-bookmarks.png';
import addBtnImage from '@/public/guides/add-btn.png';
import savedTranscriptionImage from '@/public/guides/saved-transcription.png';
import sharePopoverImage from '@/public/guides/share-popover.png';
import contentPanelHeaderCommunityContentImage from '@/public/guides/content-panel-header-cc.png';
import communityContentFiltersImage from '@/public/guides/community-content-filters.png';
import communityContentTileImage from '@/public/guides/community-content-tile.png';
import avatarIconImage from '@/public/guides/avatar-icon.png';
import DiscordButton from './components/DiscordButton';

type HelpPanelProps = {

};

const styles = {
    fab: {
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 5000
    }
};

export default function HelpPanel({ }: HelpPanelProps) {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const togglePopover = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (anchorEl)
            setAnchorEl(null);
        else
            setAnchorEl(event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <React.Fragment>
            <Fab color='secondary' aria-label='help' sx={styles.fab} size='small' onClick={togglePopover}>
                <QuestionMark />
            </Fab>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={togglePopover}
                slotProps={{
                    paper: {
                        sx: {
                            height: '50vh',
                            maxWidth: '25vw',
                            overflow: 'auto'
                        }, 
                        className: 'custom-scrollbar'
                    }
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}>
                <Box sx={{ m: 2 }}>
                    <Box>
                        <Typography sx={{ py: 2 }} fontWeight='bold' color="secondary">Basic Functions:</Typography>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}>
                                <Typography>Looping a Video Section</Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Typography fontSize={15}>
                                    <Typography variant="h6" sx={{ mb: 2 }} color="secondary">
                                        Creating a Loop
                                    </Typography>
                                    <Typography sx={{ ml: 2 }}>
                                        1. Play or scrub the video to the section you want to loop.
                                        <br />
                                        <br />
                                        2. Click on the <strong>record loop button</strong>
                                        <Image src={recordBtnImage} height='40' alt='record button' className='mx-1 inline' /> to the top left of a video.
                                        <br />
                                        <br />
                                        3. Click again to stop recording.
                                        <br />
                                        <br />
                                        4. Modify the start/end time of the loop (if desired).
                                        <Image src={loopSectionEditImage} height='50' alt='loop section edit' className='my-3' />
                                        <strong>5. Click the presented checkmark to save your loop.</strong>
                                        <br />
                                        <br />
                                    </Typography>
                                    <Typography variant="h6" sx={{ mb: 2 }} color="secondary">
                                        Playing a Loop
                                    </Typography>
                                    <Typography sx={{ ml: 2 }}>
                                        Click on a saved loop to play it. While a loop is playing, you may tap spacebar to stop & restart the loop.
                                    </Typography>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}>
                                <Typography>Video Playback Controls</Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Typography variant="h6" sx={{ mb: 2 }} color="secondary">
                                    Playback Speed
                                </Typography>
                                <Typography sx={{ ml: 2 }}>
                                    <p>You can modify the playback speed of a video by clicking on the playback speed buttons <Image src={speedControlImage} height='80' alt='speed control' className='mx-2 inline' /> to the top right of a video.</p>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}>
                                <Typography>Save/Load Transcriptions</Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Typography variant="h6" sx={{ mb: 2 }} color="secondary">
                                    Save Transcription
                                </Typography>
                                <Typography sx={{ ml: 2 }}>
                                    Clicking the add <Image src={addBtnImage} height='40' alt='add button' className='inline' /> button above the transcription tool will save the current state of the transcription tool.
                                </Typography>
                                <br />
                                <Typography variant="h6" sx={{ mb: 2 }} color="secondary">
                                    Load Transcription
                                </Typography>
                                <Typography sx={{ ml: 2 }}>
                                    Load a transcription by clicking on one of the saved transcription tabs
                                    <Image src={savedTranscriptionImage} height='60' alt='saved transcriptions' className='inline' /> above the transcription tool.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}>
                                <Typography>Bookmark Video</Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Typography sx={{ ml: 2 }}>
                                    <p className="inline">Bookmark a video by clicking the bookmark
                                        <Image src={bookmarkBtnImage} height='40' alt='bookmark button' className='mx-1 inline' /> button.</p>
                                    <br />
                                    <br />
                                    Once bookmarked, you can access the video from the <b>Bookmarks</b> <Image src={contentPanelHeaderBookmardImage} height='40' alt='content panel header bookmark' className='mx-1 inline' /> tab of the content panel (click the <ArrowBackIos sx={{ ml: 1 }} /> icon to the right of the screen to open the content panel).
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}>
                                <Typography>Community Content</Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Typography variant="h6" sx={{ mb: 2 }} color="secondary">
                                    Share a Transcription
                                </Typography>
                                <Typography sx={{ ml: 2 }}>
                                    Transcriptions can be shared by <b>right</b> clicking on one of the saved transctiption tabs 
                                    <Image src={savedTranscriptionImage} height='60' alt='saved transcriptions' className='inline' />
                                    and selecting <b>Share</b>.
                                    <br />
                                    <br />
                                    This will open the <b>Share Panel</b>: <Image src={sharePopoverImage} height='300' alt='share popover' className='my-3' />
                                    Name and describe your transcription, then select the relevant tags and click <b>Share</b> to share your transcription. 
                                    <br />
                                    <br />
                                    <small><b>This cannot be undone.</b> Once shared, the transcription will be available to all users via the Community Content Library</small>
                                </Typography>
                                <Typography variant="h6" sx={{ my: 2 }} color="secondary">
                                    Browse Content Library
                                </Typography>
                                <Typography sx={{ ml: 2 }}>
                                    1. Open the content panel by clicking the <ArrowBackIos sx={{ ml: 1 }} /> icon to the right of the screen.
                                    <br />
                                    <br />
                                    2. Select the <b>Community Content</b> tab
                                    <Image src={contentPanelHeaderCommunityContentImage} height='40' alt='content panel header community content' className='mx-1 inline' />.
                                    <br />
                                    <br />
                                    3. Filter the content library by selecting the relevant tags <Image src={communityContentFiltersImage} height='170' alt='community content filters' className='mx-1 inline' />.
                                    <br />
                                    <br />
                                    4. Click a <b>content tile</b> <Image src={communityContentTileImage} height='200' className='mx-1' alt='community content tile' /> to save the transcription. You will be redirected to the video.
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box>
                        <Typography sx={{ mt: 4, pb: 2 }} fontWeight='bold' color="secondary">Advanced Functions:</Typography>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}>
                                <Typography>Set an API Key</Typography>
                            </AccordionSummary>
                            <Divider />
                            <AccordionDetails>
                                <Typography sx={{ ml: 2 }}>
                                    By default, the application uses a free API key to access YouTube. This key has a limited number of requests per day, and may be disabled at any time if that limit is reached.
                                    If you would like, you may set your own API key to use instead. This will allow you to make more requests per day.
                                    <br />
                                    <br />
                                    If you would like to set your own API key, you will first need to follow the instructions <Link href='https://developers.google.com/youtube/v3/getting-started' target="_blank">here</Link> to create a Google Cloud Platform project and obtain an API key.
                                    <br />
                                    <br />
                                    Once generated, your API key can be set by clicking your <b>avatar icon</b> <Image src={avatarIconImage} height='40' className='mx-1 inline' alt='avatar icon' /> in the top right of the screen, and selecting <b>Set YT API Key</b>.
                                    <br />
                                    <br />
                                    <small><b>Warning:</b> If you set your own API key, you will be responsible for any charges incurred by using the YouTube API. Your API key is stored only on your local machine and is not accessible by any other user of the application. If you would like to know more about how your API key is used by the application, please check out the source code on <Link href="https://github.com/NoxelNyx/becoming-a-drummer">Github</Link></small>
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    { /*<Link href='/guides/basic-functions.png' target="_blank"><Image src={basicTrainingImage} height='400' alt='basic functions' /></Link>*/}
                </Box>
            </Popover>
            <DiscordButton variant={open ? 'full' : 'mini'} />
        </React.Fragment>
    );
}
