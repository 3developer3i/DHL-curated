import React, { useEffect, useState } from 'react';
import Table from './components/table';
import MotherOrderIndexTable from './pages/newMotherorder';
import TestBabyOrderList from './pages/parentbaby';
import AddressPage from './pages/tableAddressPage';
import { conditionPath } from './contant';

function App() {

  const [state, setState] = useState("");
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === '/motherorder_page') {
      setState("mother");
    } else if (currentPath === '/babyorder_page') {
      setState("baby");
    } else if (currentPath === conditionPath) {
      setState("newPage");
    } else {
      setState("/");
    };
  }, [conditionPath]);

  return (
    <div className="App">
      {(state === "/") && <Table />}
      {state === "mother" && <MotherOrderIndexTable />}
      {state === "baby" && <TestBabyOrderList />}
      {state === "address" && <AddressPage />}
      {state === "newPage" && <Table />}
    </div>
  );
}

export default App;
