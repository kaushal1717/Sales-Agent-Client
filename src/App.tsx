import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { LeadSearch } from './pages/LeadSearch';
import { SDRWorkflow } from './pages/SDRWorkflow';
import { EmailManagement } from './pages/EmailManagement';
import { AgentStatus } from './pages/AgentStatus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadSearch />} />
          <Route path="workflow" element={<SDRWorkflow />} />
          <Route path="email" element={<EmailManagement />} />
          <Route path="status" element={<AgentStatus />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
