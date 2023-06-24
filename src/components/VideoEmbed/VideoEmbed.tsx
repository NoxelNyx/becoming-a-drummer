import React, { FC, useState } from 'react';
import { Button, Typography } from '@mui/material';
import YouTube, { YouTubeEvent } from 'react-youtube';

type VideoEmbedProps = {
    id?: string
};

const VideoEmbed: FC<VideoEmbedProps> = ({ id }) => {
    let playerRef = React.useRef<any>(null);
    const [playbackRate, setPlaybackRate] = useState<number>(1);
    const options = {
        height: '480',
        width: '853'
    };

    const increasePlaybackRate = () => {
        playerRef.current.setPlaybackRate(playerRef.current.getPlaybackRate() + 0.05);
        setPlaybackRate(playerRef.current.getPlaybackRate());
    };

    const decreasePlaybackRate = () => {
        playerRef.current.setPlaybackRate(playerRef.current.getPlaybackRate() - 0.05);
        setPlaybackRate(playerRef.current.getPlaybackRate());
    };

    const onPlayerReady = (e: YouTubeEvent) => {
        playerRef.current = e.target;
    };

    return (<React.Fragment>
                <YouTube
                    opts={options}
                    videoId={id as string}
                    iframeClassName='mx-auto'
                    className='inline-block'
                    onReady={onPlayerReady} />
                <div className="inline-block align-top">
                    <Button onClick={increasePlaybackRate} color="secondary" variant='outlined' sx={{ mx: 2, mb: 1 }}>+</Button>
                    <br />
                    <Typography variant='h6' component='span'>{playbackRate}</Typography>
                    <br />
                    <Button onClick={decreasePlaybackRate} color="secondary" variant='outlined' sx={{ mx: 2, mt: 1 }}>-</Button>
                </div>
            </React.Fragment>);
};

export default VideoEmbed;
