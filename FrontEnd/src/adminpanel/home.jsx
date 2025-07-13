import React from "react";

const home = () => {
  return (
    <div className="dashboard-content">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        {/* Products */}
        <div className="col-md-3">
          <div className="card bg-primary text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Products</h5>
              <h2>300</h2>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="col-md-3">
          <div className="card bg-warning text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <h2>12</h2>
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="col-md-3">
          <div className="card bg-success text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Customers</h5>
              <h2>33</h2>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="col-md-3">
          <div className="card bg-danger text-white mb-3">
            <div className="card-body">
              <h5 className="card-title">Alerts</h5>
              <h2>42</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Graph Placeholder */}
      <div className="mt-5">
        <h4>Analytics</h4>
        <div style={{ height: "300px", background: "#e9ecef", borderRadius: "5px" }}>
          {/* Add your chart component here */}
          <p className="text-center pt-5">Graph Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default home;
