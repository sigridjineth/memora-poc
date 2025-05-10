import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Edit3, PlayCircle, PackagePlus, Brain, BookOpen, FileText, Image as ImageIcon, Paperclip } from 'lucide-react';
import { ICON_SIZES } from '../data/mockMemories'; // Reusing ICON_SIZES

const ComponentItem = ({ component }) => {
  let IconComponent;
  let iconColor = 'text-gray-400';

  if (component.isLorebook) {
    IconComponent = BookOpen;
    iconColor = 'text-yellow-400';
  } else if (component.type?.toLowerCase().includes('persona') || component.type?.toLowerCase().includes('core prompt')) {
    IconComponent = Brain;
    iconColor = 'text-pink-400';
  } else if (component.type?.toLowerCase().includes('logic') || component.type?.toLowerCase().includes('instruction')) {
    IconComponent = FileText; // Or a more specific icon for logic
    iconColor = 'text-blue-400';
  } else {
    IconComponent = Layers; // Default for other component types
  }

  return (
    <li className="p-3 bg-navy-dark rounded-lg border border-gray-dark shadow-sm">
      <div className="flex items-center text-sm font-medium text-gray-light mb-1">
        <IconComponent size={18} className={`mr-2 ${iconColor}`} />
        <span>{component.type || 'Component'}</span>
        {component.isLorebook && <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-600/30 text-yellow-300 rounded-full">{component.lorebookType || 'Lore'}</span>}
      </div>
      <p className="text-xs text-gray-medium mb-1.5">Source: <span className="font-semibold">{component.sourceMemoryTitle || 'N/A'}</span></p>
      {component.content && <p className="text-xs text-gray-light bg-navy-darker p-2 rounded whitespace-pre-wrap line-clamp-3" title={component.content}>{component.content}</p>}
    </li>
  );
};

const AssetPreview = ({ asset }) => {
  let AssetIcon;
  let iconColor = 'text-gray-400';

  switch(asset.type) {
    case 'image': AssetIcon = ImageIcon; iconColor = 'text-sky-400'; break;
    case 'document': AssetIcon = FileText; iconColor = 'text-amber-400'; break;
    // Add more cases for other asset types like audio, video etc.
    default: AssetIcon = Paperclip;
  }
  return (
    <div className="flex items-center p-2 bg-navy-dark rounded-md border border-gray-dark text-xs text-gray-light">
      <AssetIcon size={16} className={`mr-2 ${iconColor}`} />
      <span className="flex-grow truncate" title={asset.name}>{asset.name}</span>
      <span className="ml-2 text-gray-medium flex-shrink-0">(from: {asset.sourceMemoryTitle || 'N/A'})</span>
      {asset.url && <a href={asset.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-accent-purple-light hover:underline text-xs">Preview</a>}
    </div>
  );
};


const ConfigureFusionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [fusedAgentTitle, setFusedAgentTitle] = useState('');
  const [fusedAgentDescription, setFusedAgentDescription] = useState('');
  const [fusionInstructions, setFusionInstructions] = useState(''); // For user to guide the fusion

  const [combinedComponents, setCombinedComponents] = useState([]);
  const [combinedAssets, setCombinedAssets] = useState([]);

  useEffect(() => {
    if (location.state?.selectedMemories) {
      const memories = location.state.selectedMemories;
      setSelectedMemories(memories);
      
      // Auto-generate a title and combine components/assets
      if (memories.length > 0) {
        setFusedAgentTitle(`Fused: ${memories.map(m => m.title.substring(0,15)).join(' + ')}`);
        setFusedAgentDescription(`A new Fused Agent created from ${memories.length} memory components: ${memories.map(m => m.title).join(', ')}.`);

        let allComponents = [];
        let allAssets = [];
        const assetIds = new Set();

        memories.forEach(memory => {
          if (memory.fusedCreationData?.components) {
            allComponents = [...allComponents, ...memory.fusedCreationData.components.map(c => ({...c, sourceMemoryTitle: memory.title, id: `${memory.id}-${c.id}`}))];
          }
          // If it's a base persona or knowledge pack, its own assets are relevant
          const assetsToConsider = memory.mergedAssets || memory.assets || [];
          if (assetsToConsider) {
             assetsToConsider.forEach(asset => {
                if(!assetIds.has(asset.id)){
                    allAssets.push({...asset, sourceMemoryTitle: memory.title});
                    assetIds.add(asset.id);
                }
             });
          }
        });
        setCombinedComponents(allComponents);
        setCombinedAssets(allAssets);
      }
    } else {
      // If no state, redirect back or show error
      navigate('/create-agent'); 
    }
  }, [location.state, navigate]);

  const handleTestAgent = () => {
    // Construct a temporary Fused Agent object for testing
    const tempFusedAgent = {
      id: `temp-fused-${Date.now()}`,
      title: fusedAgentTitle || 'Untitled Fused Agent',
      description: fusedAgentDescription,
      type: 'Fused Agent (Preview)', // Special type for preview
      tags: selectedMemories.flatMap(m => m.tags || []).filter((v, i, a) => a.indexOf(v) === i), // Unique tags
      componentMemoriesCount: selectedMemories.length,
      fusedCreationData: {
        components: [
            ...combinedComponents,
            // Add user's fusion instructions as a component
            ...(fusionInstructions.trim() ? [{
                id: 'user-fusion-logic',
                type: 'Fusion Logic',
                sourceMemoryTitle: 'User Defined',
                content: fusionInstructions,
            }] : [])
        ],
        mergedAssets: combinedAssets,
      },
      // This agent is not minted yet, so no NFT specific data
    };
    
    // Navigate to chat, passing this temporary agent data
    // The Chat component will need to be adapted to handle this 'preview' agent
    navigate(`/chat/${tempFusedAgent.id}`, { state: { agentData: tempFusedAgent, isFusedAgent: true, isPreview: true } });
  };

  const handleProceedToMint = () => {
     const finalFusedAgentData = {
      id: `fused-agent-${Date.now()}`, // More permanent-looking ID for minting
      title: fusedAgentTitle || 'Untitled Fused Agent',
      description: fusedAgentDescription,
      type: 'Fused Agent',
      tags: selectedMemories.flatMap(m => m.tags || []).filter((v, i, a) => a.indexOf(v) === i),
      componentMemoriesCount: selectedMemories.length,
      fusedCreationData: {
        components: [
            ...combinedComponents,
            ...(fusionInstructions.trim() ? [{
                id: 'user-fusion-logic-final',
                type: 'Fusion Logic',
                sourceMemoryTitle: 'User Defined',
                content: fusionInstructions,
            }] : [])
        ],
        mergedAssets: combinedAssets,
      },
    };
    // This would navigate to a new page similar to MintFusedAgentPackage, but for minting a *new* Fused Agent
    // For now, let's log it and navigate to My Collection as a placeholder
    console.log("Proceeding to mint with data:", finalFusedAgentData);
    alert("Minting functionality for new Fused Agent is next. Data logged to console.");
    // navigate('/mint-new-fused-agent', { state: { agentDataToMint: finalFusedAgentData } });
    navigate('/my-collection');
  };


  if (selectedMemories.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-medium">Loading selected memories or none selected...</p>
        <button onClick={() => navigate('/create-agent')} className="mt-4 text-accent-purple hover:underline">Go back to selection</button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-gray-light min-h-screen">
      <button 
        onClick={() => navigate('/create-agent')} 
        className="flex items-center text-accent-purple hover:text-purple-400 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Selection
      </button>

      <header className="mb-8">
        <div className="flex items-center mb-2">
          <Layers size={ICON_SIZES.PAGE_HEADER} className="mr-3 text-green-400" />
          <h1 className="text-3xl font-bold text-white">Configure New Fused Agent</h1>
        </div>
        <p className="text-gray-medium mt-1">
          Define the properties and behavior of your new Fused Agent based on the selected memories.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-navy-medium p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-dark pb-3">Fused Agent Details</h2>
            <div>
              <label htmlFor="fusedAgentTitle" className="block text-sm font-medium text-gray-medium mb-1">Agent Title</label>
              <input
                type="text"
                id="fusedAgentTitle"
                value={fusedAgentTitle}
                onChange={(e) => setFusedAgentTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple text-gray-light placeholder-gray-500"
                placeholder="e.g., Creative Storyteller AI"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="fusedAgentDescription" className="block text-sm font-medium text-gray-medium mb-1">Agent Description</label>
              <textarea
                id="fusedAgentDescription"
                value={fusedAgentDescription}
                onChange={(e) => setFusedAgentDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple text-gray-light placeholder-gray-500"
                placeholder="Describe what this Fused Agent does and its unique capabilities."
              ></textarea>
            </div>
             <div className="mt-4">
              <label htmlFor="fusionInstructions" className="block text-sm font-medium text-gray-medium mb-1">
                Fusion Instructions (Optional)
              </label>
              <textarea
                id="fusionInstructions"
                value={fusionInstructions}
                onChange={(e) => setFusionInstructions(e.target.value)}
                rows="4"
                className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple text-gray-light placeholder-gray-500"
                placeholder="e.g., Prioritize responses from Persona X. If discussing topic Y, use knowledge from Pack Z. Be more formal/casual..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Guide how the selected memories should interact or which persona should take precedence under certain conditions.</p>
            </div>
          </section>

          <section className="bg-navy-medium p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-dark pb-3">Combined Blueprint Components ({combinedComponents.length})</h2>
            {combinedComponents.length > 0 ? (
              <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {combinedComponents.map((comp, index) => (
                  <ComponentItem key={`${comp.id}-${index}`} component={comp} />
                ))}
              </ul>
            ) : <p className="text-gray-medium italic">No components to display.</p>}
          </section>

           <section className="bg-navy-medium p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-dark pb-3">Combined Assets ({combinedAssets.length})</h2>
            {combinedAssets.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {combinedAssets.map((asset, index) => (
                  <AssetPreview key={`${asset.id}-${index}`} asset={asset} />
                ))}
              </ul>
            ) : <p className="text-gray-medium italic">No assets will be merged.</p>}
          </section>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-navy-medium p-6 rounded-xl shadow-xl sticky top-8">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-dark pb-3">Fusion Summary</h2>
            <div className="space-y-2 text-sm">
              <p><strong className="text-gray-medium">Selected Memories:</strong> {selectedMemories.length}</p>
              <p><strong className="text-gray-medium">Total Components:</strong> {combinedComponents.length}</p>
              <p><strong className="text-gray-medium">Total Assets:</strong> {combinedAssets.length}</p>
              <p className="text-gray-medium mt-2">Review the combined components and assets. You can add custom instructions to guide the fusion logic.</p>
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={handleTestAgent}
                disabled={!fusedAgentTitle.trim()}
                className={`w-full flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors ${!fusedAgentTitle.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <PlayCircle size={20} className="mr-2" /> Test Fused Agent
              </button>
              <button
                onClick={handleProceedToMint}
                disabled={!fusedAgentTitle.trim()}
                className={`w-full flex items-center justify-center px-6 py-3 bg-accent-purple text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors ${!fusedAgentTitle.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <PackagePlus size={20} className="mr-2" /> Save & Proceed to Mint
              </button>
            </div>
             {!fusedAgentTitle.trim() && <p className="text-xs text-yellow-400 mt-3 text-center">Please provide a title for your Fused Agent to enable testing and minting.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureFusionPage;
