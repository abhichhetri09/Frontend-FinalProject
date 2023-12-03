import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function AddCustomer(props) {
  const [customer, setCustomer] = useState({
    firstname: "",
    lastname: "",
    streetaddress: "",
    postcode: "",
    city: "",
    email: "",
    phone: "",
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (event) => {
    setCustomer({ ...customer, [event.target.name]: event.target.value });
  };

  const addCustomer = () => {
    props.saveCustomer(customer);
    handleClose();
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Customer
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="FirstName"
            name="firstname"
            value={customer.firstname}
            onChange={(e) => handleInputChange(e)}
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Lastname"
            value={customer.lastname}
            onChange={(e) => handleInputChange(e)}
            name="lastname"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="StreetAddress"
            value={customer.streetaddress}
            onChange={(e) => handleInputChange(e)}
            name="streetaddress"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="PostCode"
            value={customer.postcode}
            onChange={(e) => handleInputChange(e)}
            name="postcode"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="City"
            value={customer.city}
            onChange={(e) => handleInputChange(e)}
            name="city"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            value={customer.email}
            onChange={(e) => handleInputChange(e)}
            name="email"
            variant="standard"
            fullWidth
          />
          <TextField
            margin="dense"
            label="Phone"
            value={customer.phone}
            onChange={(e) => handleInputChange(e)}
            name="phone"
            variant="standard"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addCustomer}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
