import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers';

function AddTraining({ onAddTraining, customerId }) {
  const [open, setOpen] = useState(false);
  const [trainingData, setTrainingData] = useState({
    date: '',
    activity: '',
    duration: '',
    customer: `https://localhost:8080/api/customers/${customerId}`
  });

  const handleInputChange = (event) => {
    setTrainingData({ ...trainingData, [event.target.name]: event.target.value });
  };

  const handleSubmit = () => {
    console.log("Received customerId:", customerId);
  
    if (!customerId) {
      console.error("Customer ID is undefined");
      return; // Optionally, show an error message to the user
    }
    
    const customerUrl = `https://traineeapp.azurewebsites.net/api/customers/${customerId}`;
    const payload = {
      ...trainingData,
      duration: parseInt(trainingData.duration, 10),
      customer: customerUrl // Use the full URL here
    };
  
    console.log("Submitting training data:", payload);
  
    onAddTraining(payload);
    setOpen(false);
  };
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleDateChange = (date) => {
    setTrainingData({ ...trainingData, date: date.toISOString() });
  };
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Training
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Training</DialogTitle>
           <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={trainingData.date}
            onChange={handleDateChange}
            renderInput={(params) => (
              <TextField {...params} label="Date" variant="standard" />
            )}format="YYYY/MM/DD"
          />
        </LocalizationProvider>
          <TextField
            margin="dense"
            name="activity"
            label="Activity"
            type="text"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration"
            type="number"
            fullWidth
            onChange={handleInputChange}
          />
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddTraining;
