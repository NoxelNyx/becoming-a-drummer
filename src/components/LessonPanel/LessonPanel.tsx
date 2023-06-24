import React from 'react';
import { Box, Tabs, Tab, Typography, AppBar } from '@mui/material';
import GrooveScribe from './components/GrooveScribe';

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            {...other}
            className='h-full w-full' >
            <Box className='h-full'>{children}</Box>
        </Typography>
    );
}

function a11yProps(index: number) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function LessonPanel({ className }: { className?: string }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: 580, bgcolor: 'background.paper' }} className={className}>
            <AppBar position="static">
                <Tabs
                    textColor='inherit'
                    indicatorColor='secondary'
                    variant="fullWidth"
                    value={value}
                    onChange={handleChange}
                    aria-label="lesson panel tabs"
                    className='h-full'
                    sx={{ borderRight: 1, borderColor: 'divider' }} >
                    <Tab label="GrooveScribe" {...a11yProps(0)} />
                    <Tab label="Notes" {...a11yProps(1)} />
                    <Tab label="Comments" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <GrooveScribe className='w-full h-full' urlParams='?TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=%7Cxxxxxxxxxxxxxxxx%7C&S=%7C----O-------O---%7C&K=%7Co-------o-------%7C`' />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </Box>);
};
