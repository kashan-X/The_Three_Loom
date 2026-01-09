import React from 'react';

const CustomerSummaryTable = ({ customers }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Total Orders</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {customers.length > 0 ? (
          customers.map((cust, idx) => (
            <tr key={idx}>
              <td>{cust.name}</td>
              <td>{cust.email}</td>
              <td>{cust.phone}</td>
              <td>{cust.orders}</td>
              <td>
                <span className={`status ${cust.category.replace(/\s+/g, '-').toLowerCase()}`}>
                  {cust.category}
                </span>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No customer data available.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomerSummaryTable;
