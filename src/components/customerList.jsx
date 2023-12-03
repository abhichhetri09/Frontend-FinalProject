import React, { useState, useEffect, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
 // Core grid CSS, required


import AddCustomer from "./addCustomer";
import EditCustomer from "./editCustomer";
import AddTraining from "./addTraining";
import TrainingList from "./TrainingList";
import { useNavigate } from "react-router-dom";


export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const gridRef = useRef();

  useEffect(() => {
    fetchCustomers();
  }, []);


  const fetchCustomers = () => {
    fetch("https://traineeapp.azurewebsites.net/api/customers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data.content || []);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setSnackbarMessage('Error fetching customer data');
        setOpenSnackbar(true);
      });
  };

  const deleteCustomer = (url) => {
    if (window.confirm("Are you sure?")) {
      fetch(url, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error in delete: " + response.statusText);
          }
          setSnackbarMessage('Customer deleted successfully');
          setOpenSnackbar(true);
          fetchCustomers();
        })
        .catch((err) => {
          console.error(err);
          setSnackbarMessage('Error in deleting customer');
          setOpenSnackbar(true);
        });
    }
  };

  const addTraining = (trainingData) => {

    fetch("https://traineeapp.azurewebsites.net/api/trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trainingData),
      
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error in adding training: " + response.statusText);
        }
        console.log("Submitting training data:", trainingData); // Use trainingData here

        setSnackbarMessage('Training added successfully');
        setOpenSnackbar(true);
        fetchCustomers();
      })
      .catch((err) => {
        console.error("Error in adding training: ", err.message);
        setSnackbarMessage('Error in adding training');
        setOpenSnackbar(true);
      });
      
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const exportToCSV = () => {
    gridRef.current.api.exportDataAsCsv({
      fileName: "customers.csv",
      columnKeys: [
        "firstname",
        "lastname",
        "streetaddress",
        "postcode",
        "city",
        "email",
        "phone",
      ],
    });
  };

  const columnDefs = [
    {
        headerName: "First Name",
        field: "firstname",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Last Name",
        field: "lastname",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Street Address",
        field: "streetaddress",
        sortable: true,
        filter: true,
      },
      {
        headerName: "Post Code",
        field: "postcode",
        sortable: true,
        filter: true,
      },
      { headerName: "City", field: "city", sortable: true, filter: true },
      { headerName: "Email", field: "email", sortable: true, filter: true },
      { headerName: "Phone", field: "phone", sortable: true, filter: true },
      {
        cellRenderer: (params) => {
            
        console.log("Params data:", params.data); // Log each customer's data
          return (
            <EditCustomer customerdata={params.data} fetchCustomers={fetchCustomers} />
          );
        },
      },
      {
        cellRenderer: (params) => {
          const deleteUrl = params.data.links.find(
            (link) => link.rel === "customer" || link.rel === "self"
          ).href;
          return (
            <Button size="small" onClick={() => deleteCustomer(deleteUrl)}>
              Delete
            </Button>
          );
        },
      },
      {
          headerName: "Actions",
          field: "actions",
        cellRenderer: (params) => {
            const customerLink = params.data.links.find(link => link.rel === 'self');
            const customerId = customerLink ? customerLink.href.split('/').pop() : null;
          
            console.log("Customer ID:", customerId); // Debugging line

          return (
            <>
            
              <AddTraining
                onAddTraining={addTraining}
                customerId={customerId}
              />
            </>
          );
        }
    },
  ];

  return (
    <>
      <div className="ag-theme-material" style={{ width: "1500px", height: "800px" }}>
        
        <AddCustomer fetchCustomers={fetchCustomers} />
        <Button onClick={exportToCSV}>Export to CSV</Button>
        <AgGridReact
          ref={gridRef}
          columnDefs={columnDefs}
          rowData={customers}
          pagination={true}
          paginationAutoPageSize={true}
        />
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
      </div>
    </>
  );
}
