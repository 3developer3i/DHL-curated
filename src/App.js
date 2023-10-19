import React, { useEffect, useState } from 'react';
import Table from './components/table';
import NewMotherOrder from './pages/tableMotherorder';
import BabyOrderList from './pages/tableBabyOrder';
import Test from './components/Test.js'
import MotherOrderIndexTable from './pages/newMotherorder';

function App() {

  const [state, setState] = useState("");

  useEffect(() => {
    const currentPath = window.location.pathname;
      // Check if the last part meets your condition
      if (currentPath === '/motherorder_page') {
        // Display an alert if the condition is met
        setState("mother");
      }
      if (currentPath === '/babyorder_page') {
        // Display an alert if the condition is met
        setState("baby");
      }
      if (currentPath === '') {
        // Display an alert if the condition is met
        setState("");
      }
  }, []);

  return (
    <div className="App">
      {state === "" && <Table />}
      {state === "mother" && <MotherOrderIndexTable />}
      {state === "baby" && <BabyOrderList />}
    </div>
  );
}

export default App;
