// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//  components import .
import AdminSignIn from "./component/AdminSignIn";
import Dashboard from "./component/Dashboard";
import LiveMap from "./component/LiveMap";
import BusPerformanceMonitor from "./component/BusPerformanceMonitor";
import Alerts from "./component/Alerts";
import UserManagement from "./component/UserManagement";
import BusAndDriverManagement from "./component/BusAndDriverManagement";
import ScheduleOptimizer from "./component/ScheduleOptimizer";
import Setting from "./component/Setting";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminSignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/live-map" element={<LiveMap />} />
        <Route path="/bus-performance" element={<BusPerformanceMonitor />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route
          path="/bus-driver-management"
          element={<BusAndDriverManagement />}
        />
        <Route path="/schedule-optimizer" element={<ScheduleOptimizer />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;
