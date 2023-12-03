import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function EditCustomer({customerdata, fetchCustomers}) {
  const [customer, setCustomer] = useState({

    firstname: '',
    lastname: '',
    streetaddress: '',
    postcode: '',
    city: '',
    email: '',
    phone: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  useEffect(() => {
   // console.log("Received customer data:", customerdata);
    const updateUrl = customerdata && customerdata._links && customerdata._links.customer && customerdata._links.customer.href;

    if (updateUrl) {
       // console.log("Update URL:", updateUrl);
        setCustomer({ ...customerdata, id: extractIdFromUrl(updateUrl) }); // You'd need to write extractIdFromUrl
      } else {
       // console.error("No update URL present in customer data");
      }
  }, [customerdata]);
  

  const [open, setOpen] = useState(false);


  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setCustomer({
      
        firstname: customerdata.firstname,
        lastname: customerdata.lastname,
        streetaddress: customerdata.streetaddress,
        postcode: customerdata.postcode,
        city: customerdata.city,
        email: customerdata.email,
        phone: customerdata.phone
  })


  setOpen(true);
  }
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleSave = () => {
    // Assuming the API uses the customer ID to update a customer
    const customerId = customerdata.id; // Or however you get the ID from customerdata
    const updateUrl = customerdata.links.find(link => link.rel === "customer" || link.rel === "self").href;
   // console.log("Debugging")
   // console.log("Update URL:", updateUrl); // Debugging
    fetch(updateUrl, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(customer)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error in edit: ' + response.statusText);
      }
      return response.json();
    })
    .then(() => {
      console.log("Fetch successful");
      fetchCustomers(); 
      handleClose();
      setOpenSnackbar(true);

    })
    .catch(err => console.error('Error during update:', err));
    setOpenSnackbar(true);

  }
  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCustomer(prevState => ({
        ...prevState,
        [name]: value
    }));
}
  return (
    <>
    <Button size='small' onClick={handleClickOpen}>
        Edit
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Customer</DialogTitle>
        <DialogContent>
     
          <TextField
            margin="dense"
            label="FirstName"
            name="firstname"
            value={customer.firstname}
            onChange={handleInputChange}
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Lastname"
            value={customer.lastname}
            onChange={handleInputChange}
            name="lastname"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="StreetAddress"
            value={customer.streetaddress}
            onChange={handleInputChange}
            name="streetaddress"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="PostCode"
            value={customer.postcode}
            onChange={handleInputChange}
            name="postcode"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="City"
            value={customer.city}
            onChange={handleInputChange}
            name="city"
            variant="standard"
            fullWidth
          />
           <TextField
            margin="dense"
            label="Email"
            value={customer.email}
            onChange={handleInputChange}
            name="email"
            variant="standard"
            fullWidth
          />
           <TextField
            margin="dense"
            label="Phone"
            value={customer.phone}
            onChange={handleInputChange}
            name="phone"
            variant="standard"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
              Close
            </Button>
          }
        />
    </>
  );
}
