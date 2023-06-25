import React, { FC, useState } from 'react';
import { Button, Typography, Card } from '@mui/material';
import Thumbnail from '@/src/components/Thumbnail';
import Link from 'next/link';

type BookmarkProps = {
    videoId?: string,
    title: string,
    duration: number,
};

const Bookmark: FC<BookmarkProps> = ({ videoId, title, duration }) => {

    return (<React.Fragment>
               <Card sx={{ maxHeight: 180 }}>
                    <Link href={`/lesson/${videoId}`}>
                        <Thumbnail url={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`} title={title} duration={duration} height='100%' width='100%' />
                    </Link>
               </Card>
            </React.Fragment>);
};

export default Bookmark;
