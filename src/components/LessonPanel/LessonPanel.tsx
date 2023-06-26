import React from 'react';
import { Box, Tabs, Tab, Typography, AppBar, Grid, Paper } from '@mui/material';
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
    const [gsParams, setGsParams] = React.useState('TimeSig=4/4&Div=16&Tempo=80&Measures=1&H=%7Cxxxxxxxxxxxxxxxx%7C&S=%7C----O-------O---%7C&K=%7Co-------o-------%7C');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleGsParamsChange = () => {
        const params = 'TimeSig=4/4&Div=16&Tempo=82&Measures=4&MetronomeFreq=8&H=|c---b-b-bb-b-bb-|b-bb-b-b-bb-b---|----b-b-bb-b-bb-|b-bb-b-b-bb-b---|&S=|O--O-O-O--O-O--O|-O--O-O-O--O-OOO|O--O-O-O--O-O--O|-O--O-O-O--O-OO-|&K=|-oo-o-o-oo-o-oo-|o-oo-o-o-oo-o---|-oo-o-o-oo-o-oo-|o-oo-o-o-oo-o--o|';
        setGsParams(params);
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
                <Box>
                    <Grid container spacing={{ xs: 2, md: 3 }} marginBottom={2} marginTop={8}>
                        <Grid item xs={2}>
                            <Paper sx={{ height: 50, cursor: 'pointer' }} onClick={handleGsParamsChange}>C.A.N.C.E.R. 1</Paper>
                        </Grid>
                        
                        <Grid item xs={2}>
                            <Paper sx={{ height: 50, cursor: 'pointer' }} onClick={() => { setGsParams('TimeSig=4/4&Div=16&Tempo=80&Measures=3&MetronomeFreq=8&H=|c---b-b-bb-b-bb-|b-bb-b-b--------|s-s-s-s-s-------|&S=|O--O-O-O--O-O--O|-O--O-O-O-OO--OO|--------O-------|&K=|-oo-o-o-oo-o-oo-|o-oo-o-o-o--oo--|o-o---o---------|')}}>C.A.N.C.E.R. 2</Paper>
                        </Grid>
                    </Grid>
                </Box>
                <GrooveScribe className='w-full h-full' urlParams={gsParams} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                Item Two
            </TabPanel>
            <TabPanel value={value} index={2}>
                Item Three
            </TabPanel>
        </Box>);
};
