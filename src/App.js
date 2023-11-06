import React, { useEffect, useState } from 'react';
import Table from './components/table';
import BabyOrderList from './pages/tableBabyOrder';
import MotherOrderIndexTable from './pages/newMotherorder';
import TestBabyOrderList from './pages/parentbaby';

function App() {

  const [state, setState] = useState("baby");

  useEffect(() => {
    const currentPath = window.location.pathname;
      if (currentPath === '/motherorder_page') {
        setState("mother");
      };
      if (currentPath === '/babyorder_page') {
        setState("baby");
      };
      if (currentPath === '') {
        setState("");
      };
  }, []);

  return (
    <div className="App">
      {state === "" && <Table />}
      {state === "mother" && <MotherOrderIndexTable />}
      {state === "baby" && <TestBabyOrderList />}
    </div>
  );
}

export default App;
