import './Reset.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import PingContainer from './components/Ping/PingContainer';
import FinanceContainer from './components/Finance/FinanceContainer';


function App() {
  return (
   <BrowserRouter>
      <div className="App">
         <Navbar />
         <main>
            <div className="app-wrap">
               <Routes>
                  <Route path='finance' element={<FinanceContainer />} />
                  <Route path='ping' element={<PingContainer />} />
               </Routes>
            </div>
         </main>
      </div>
   </BrowserRouter>
  );
}

export default App;
