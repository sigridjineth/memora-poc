import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout'; // Import Layout
import Marketplace from './pages/Marketplace';
import MyMemories from './pages/MyMemories';
import CreateAgentPage from './pages/CreateAgentPage';
import ConfigureFusionPage from './pages/ConfigureFusionPage';
import Chat from './pages/Chat';
import MintFusedAgentPackage from './pages/MintFusedAgentPackage';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import HelpSupport from './pages/HelpSupport';
// Import for ImportMemoryPage if it exists and is used in Layout.jsx nav items
// import ImportMemoryPage from './pages/ImportMemoryPage'; 

function App() {
  return (
    <Router>
      <Layout> {/* Use Layout to wrap the routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/marketplace" />} />
          <Route path="/marketplace" element={<Marketplace />} />
          {/* Example: Add route for Import Memory if page exists and is linked from Layout */}
          {/* <Route path="/import-memory" element={<ImportMemoryPage />} />  */}
          <Route path="/my-collection" element={<MyMemories />} />
          <Route path="/create-agent" element={<CreateAgentPage />} />
          <Route path="/configure-fusion" element={<ConfigureFusionPage />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/mint-fused-agent-package" element={<MintFusedAgentPackage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/help" element={<HelpSupport />} />
          {/* Add other routes like /about, /terms, /privacy if you create pages for them based on Layout's footer links */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
