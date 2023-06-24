'use client'
import React, { FC, ReactElement } from 'react';
import { styled } from '@mui/system';
import moment from 'moment';
import Image from 'next/image';

type ThumbnailProps = {
    url: string,
    title: string,
    duration: string,
    height?: number | string,
    width?: number | string
};

const styles = {
    videoDuration: {
        position: 'relative',
        left: 20,
        bottom: 45,
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        paddingLeft: .5,
        paddingRight: .5,
        paddingTop: .5,
        paddingBottom: .5,
        borderRadius: .5
    },
    thumbnail: {
        height: 180,
        width: 320
    }
};

const Div = styled('div')(styles);
const Span = styled('span')(styles);

const Thumbnail: FC<ThumbnailProps> = ({ url, title, duration, height, width }): ReactElement => {
    const durationHours = moment.duration(duration).hours();
    const durationMinutes = moment.duration(duration).minutes();
    const durationSeconds = moment.duration(duration).seconds();
    const friendlyDuration = (durationHours !== 0) ? (durationHours + ':' + durationMinutes + ':' + durationSeconds) : (durationMinutes + ':' + durationSeconds);

    return (
        <Div>
            <Image src={url} height={180} width={345} alt={title} />
            <Span sx={styles.videoDuration}>{friendlyDuration}</Span>
        </Div>
    );
};

export default Thumbnail;
