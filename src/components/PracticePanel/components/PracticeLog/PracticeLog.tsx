import React, { FC } from 'react';
import { Button } from '@mui/material';
import { PracticeSession } from '../../slice';

type PracticeLogProps = {
    practiceSessions: PracticeSession[],
    handleNewPracticeSessionOnClick: (e: React.SyntheticEvent) => void
};

const PracticeLog: FC<PracticeLogProps> = ({ handleNewPracticeSessionOnClick, practiceSessions }) => {
    return (
        <div className="practice-log">
            <Button
                sx={{
                    width: '100%',
                    margin: '0',
                    marginTop: '1rem',
                    borderRadius: '0',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))'
                }}
                onClick={handleNewPracticeSessionOnClick}
                color="secondary">+</Button>
                {
                    practiceSessions.map((session: PracticeSession) => {
                        return (
                            <div key={session.videoId}>Session</div>
                        )
                    })
                }
        </div>
    );
};

export default PracticeLog;
