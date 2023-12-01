import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import AddCustomer from './addCustomer';
import EditCustomer from './editCustomer';

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [open, setOpen] = useState(false);


  useEffect(() => fetchCustomers(), []);
  const fetchData = () => {
    fetch('https://traineeapp.azurewebsites.net/api/customers') // Updated endpoint
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.content)) {
          setCustomers(data.content); // Use data.content to set customers
        } else {
          console.error('Unexpected customer data structure:', data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };
 
  const deleteCustomer = (url) => {
    if (window.confirm('Are you sure?')) {
        fetch(url, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error in delete: ' + response.statusText);
                }
                setOpenSnackbar(true); // Open the Snackbar on successful delete

                setOpen(true);
                fetchCustomers();
            })
            .catch(err => console.error(err));
    }
};


  
  
  const columnDefs = [
    { headerName: 'First Name', field: 'firstname', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'lastname', sortable: true, filter: true },
    { headerName: 'Street Address', field: 'streetaddress', sortable: true, filter: true },
    { headerName: 'Post Code', field: 'postcode', sortable: true, filter: true },
    { headerName: 'City', field: 'city', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
    {
        cellRenderer: params => {
            console.log("Params data:", params.data); // Log each customer's data
            return <EditCustomer customerdata={params.data} fetchCustomers={fetchData}/>
        }
    },
    {cellRenderer: params => {
        const deleteUrl = params.data.links.find(link => link.rel === "customer" || link.rel === "self").href;
        return <Button size="small" onClick={() => deleteCustomer(deleteUrl)}>Delete</Button>;
    },
    width: 200
}
  ];


  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const fetchCustomers = () => {
    fetch('https://traineeapp.azurewebsites.net/api/customers')
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong" + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data.content)) {
                setCustomers(data.content);
            } else {
                console.error("Received data does not have a content array:", data);
            }
        })
        .catch(err => console.error(err));
}

  return (
    <>
    <div className="ag-theme-material" style={{  width: "1500px", height: "700px"  }}>
    <h1>Customers</h1>
          <AddCustomer fetchCustomers={fetchCustomers} />
      <AgGridReact columnDefs = {columnDefs} rowData={customers} pagination={true}
                    paginationAutoPageSize={true}/>   
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Operation Successfull"
        action={
          <Button color="secondary" size="small" onClick={handleCloseSnackbar}>
            Close
          </Button>
        }
      />
    </div>
    </>
  );
}

