'use client'
import React, { FC, ReactElement } from 'react';
import { styled } from '@mui/system';
import moment from 'moment';
import Image from 'next/image';

type ThumbnailProps = {
    url: string,
    description: string,
    duration: number,
    height?: number,
    width?: number
};

const styles = {
    videoDuration: {
        position: 'relative',
        left: 20,
        bottom: 35,
        backgroundColor: 'rgba(10, 10, 10, 0.8)',
        paddingLeft: .5,
        paddingRight: .5,
        paddingTop: .5,
        paddingBottom: .5,
        borderRadius: .5,
        fontSize: '10pt',
    }
};

const Span = styled('span')(styles);

const Thumbnail: FC<ThumbnailProps> = ({ url, description, duration, height, width }): ReactElement => {
    const format = duration < 3600 ? 'mm:ss' : 'H:mm:ss';
    const durationMoment = moment.utc(duration * 1000).format(format);
    const imageHeight = height ? height : 180;
    const imageWidth = width ? width : 320;

    return (
        <React.Fragment>
            <Image src={url} height={imageHeight} width={imageWidth} alt={description} />
            {duration !== 0 &&
                <Span sx={styles.videoDuration}>{durationMoment}</Span>
            }
        </React.Fragment>
    );
};

export default Thumbnail;
