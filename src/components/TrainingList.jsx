import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
// Import required styles...

function TrainingList() {
  const [trainings, setTrainings] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchTrainingsWithCustomerInfo();
  }, []);
  
  const fetchTrainingsWithCustomerInfo = async () => {
    try {
        const response = await fetch('https://traineeapp.azurewebsites.net/gettrainings');
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const trainingsData = await response.json();
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

  const columnDefs = [
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
  ];

  return (
    <div
      className="ag-theme-material"
      style={{ height: "800px", width: "1500px" }}
    >
      <h1>Trainings</h1>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={trainings}
        pagination={true}
        paginationAutoPageSize={true}
      />
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
