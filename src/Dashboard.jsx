import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import CustomerList from './components/customerList';
import TrainingList from './components/TrainingList';

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Customers" />
        <Tab label="Trainings" />
      </Tabs>

      <TabPanel value={selectedTab} index={0}>
        <CustomerList />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <TrainingList />
      </TabPanel>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
