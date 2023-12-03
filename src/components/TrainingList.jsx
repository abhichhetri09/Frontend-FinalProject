import React, { useState, useEffect , useMemo} from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MyCalendar from './calender';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Tabs, Tab, Box } from '@mui/material';
import Statistics from './Statistics'; 


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{
        height: '100%', // Make tab panels fill up the available height
        overflow: 'auto' // Add scroll to the tab panel content if necessary
      }}
    >
      {value === index && children}
    </div>
  );
}

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  const [statisticsData, setStatisticsData] = useState([]);
  useEffect(() => {
    fetchTrainingsWithCustomerInfo();
  }, []);

  useEffect(() => {
    if (trainings.length > 0) {
      const processedData = processStatisticsData(trainings);
      setStatisticsData(processedData); // Set the processed data for the statistics
    }
  }, [trainings]); 
  
  const processStatisticsData = (trainings) => {
    const stats = {};

    trainings.forEach(training => {
      const activity = training.activity;
      const duration = Number(training.duration);

      if (stats[activity]) {
        stats[activity] += duration; // Sum durations for the same activity
      } else {
        stats[activity] = duration; // Initialize if not present
      }
    });

    return Object.entries(stats).map(([activity, totalDuration]) => {
      return { activity, duration: totalDuration };
    });
  };
  const fetchTrainingsWithCustomerInfo = async () => {
    try {
        const response = await fetch('https://traineeapp.azurewebsites.net/gettrainings');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const trainingsData = await response.json();
      console.log(trainingsData);
      const trainingsWithCustomerName = trainingsData.map(training => ({
        ...training,
        customerName: `${training.customer?.firstname} ${training.customer?.lastname}` // Use optional chaining
      }));
      setTrainings(trainingsWithCustomerName);
    } catch (error) {
      console.error('Error fetching trainings with customer info:', error);
      setSnackbarMessage('Failed to fetch trainings');
      setOpenSnackbar(true);
    }
  };
  
  

  const deleteTraining = (deleteURL) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      fetch(deleteURL , {
        method: "DELETE",
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in delete: " + response.statusText);
        }
        setSnackbarMessage("Training deleted successfully");
        setOpenSnackbar(true);
        fetchTrainingsWithCustomerInfo();
      })
      .catch((err) => {
        console.error(err);
        setSnackbarMessage("Error deleting training");
        setOpenSnackbar(true);
      });
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const columnDefs = useMemo(() => [
    { headerName: "Date", field: "date", sortable: true, filter: true },
    { headerName: "Activity", field: "activity", sortable: true, filter: true },
    { headerName: "Duration", field: "duration", sortable: true, filter: true },
    { headerName: "Customer Name", field: "customerName", sortable: true, filter: true }, // Add a column for customer name
    // Add more columns as needed...
    {
        headerName: "Actions",
        field: "actions",
        cellRenderer: (params) => {
          // Ensure that you're getting the correct training ID from the data
          const trainingId = params.data.id; // Make sure this is how your data provides the ID
          // Construct the full URL for deletion
          const deleteUrl = `https://traineeapp.azurewebsites.net/api/trainings/${trainingId}`;
          return (
            <Button size='small' onClick={() => deleteTraining(deleteUrl)}>Delete</Button>
          );
        },
      },
  ]);

  return (
    <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}> {/* Adjust height calculation if necessary */}
      <h1>Trainings</h1>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="training tabs">
          <Tab label="List View" />
          <Tab label="Calendar View" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>
      <TabPanel value={tabIndex} index={0}>
        <div className="ag-theme-material" style={{ height: '100%', width: '100%' }}> {/* Set grid container to take full height */}
          <AgGridReact
            columnDefs={columnDefs}
            rowData={trainings}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <MyCalendar trainings={trainings} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}> {/* Add a new TabPanel for Statistics */}
        <Statistics data={statisticsData} />
      </TabPanel>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
}

export default TrainingList;
