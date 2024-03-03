// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(null); // New state for sorting
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      console.log(`Fetching data for page ${currentPage}`);
      const response = await axios.get(`http://localhost:5000/api/customers?page=${currentPage}`);
      console.log(`Fetched data successfully:`, response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received. Request details:', error.request);
      } else {
        console.error('Error details:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (key) => {
    // Toggle sorting option
    const newSortOption = sortOption === key ? null : key;
    setSortOption(newSortOption);

    let sortedCustomers = [...customers];
    
    if (newSortOption === 'created_at') {
      // Sort by date or time based on the selected option
      sortedCustomers = sortedCustomers.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        if (newSortOption === 'date') {
          return dateA - dateB;
        } else if (newSortOption === 'time') {
          return dateA.getTime() - dateB.getTime();
        }
        return 0;
      });
    } else {
      // Sort by other columns
      sortedCustomers = sortedCustomers.sort((a, b) => (a[newSortOption] > b[newSortOption] ? 1 : -1));
    }

    setCustomers(sortedCustomers);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Customer Data</h1>
      <input type="text" placeholder="Search by name or location" onChange={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>sno</th>
            <th>Customer Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th >Location</th>
            <th onClick={() => handleSort('created_at')}>Date</th>
            <th onClick={() => handleSort('created_at')}>Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.sno}>
              <td>{customer.sno}</td>
              <td>{customer.customer_name}</td>
              <td>{customer.age}</td>
              <td>{customer.phone}</td>
              <td>{customer.location}</td>
              <td>{new Date(customer.created_at).toLocaleDateString()}</td>
              <td>{new Date(customer.created_at).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={customers.length < 20}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
