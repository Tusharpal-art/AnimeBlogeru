import React from 'react';
import { useGetDashboardInfoQuery } from '../../services/apiSlice'; 

function Dashboard() {
    // 1. Call the hook to fetch data
    // It automatically handles the GET request and SignalR group joining
    const { data, isLoading, isError } = useGetDashboardInfoQuery();
    console.log("Dashboard data",data?.firstValue);

    // 2. Handle Loading and Error states
    if (isLoading) return <div>Loading Dashboard...</div>;
    if (isError) return <div>Error loading dashboard data.</div>;

    // 3. Extract data from the response structure
    const stats = data?.data?.firstValue;

    return (
        <div className="dashboard">
            <h2>Dashboard</h2>
            <div className="Admin">
                <div className="adminData">
                    <h3 style={{ color: 'red' }}>Total users:</h3>
                    <p>{stats?.totalUserCount || 0}</p>
                </div>
                <div className="adminData">
                    <h3 style={{ color: 'red' }}>Total Post:</h3>
                    <p>{stats?.totalBlogCount || 0}</p>
                </div>
                <div className="adminData">
                    <h3 style={{ color: 'red' }}>Total Comments:</h3>
                    <p>{stats?.totalCommentCount || 0}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;