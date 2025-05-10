import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  PackagePlus, FileText, MessageSquare, Tag, Image as ImageIconLucide, DollarSign, ArrowLeft, Layers, ListChecks, 
  Paperclip, FileImage, FileArchive as AudioIcon, Brain, Edit3
} from 'lucide-react';

// Helper to get asset icon
const getAssetIcon = (assetType) => {
  switch(assetType) {
    case 'image': return <FileImage size={20} className="mr-3 text-sky-400 flex-shrink-0" />;
    case 'document': return <FileText size={20} className="mr-3 text-amber-400 flex-shrink-0" />;
    case 'audio': return <AudioIcon size={20} className="mr-3 text-lime-400 flex-shrink-0" />;
    default: return <Paperclip size={20} className="mr-3 text-gray-400 flex-shrink-0" />;
  }
};

const MintFusedAgentPackage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [agentData, setAgentData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isContextFusedAgent, setIsContextFusedAgent] = useState(false);
  const [isMintingFromPreview, setIsMintingFromPreview] = useState(false);
  
  const [nftTitle, setNftTitle] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [nftPrice, setNftPrice] = useState('');
  const [nftTags, setNftTags] = useState('');

  useEffect(() => {
    if (location.state?.agentData && location.state?.chatHistory) {
      const { agentData: passedAgentData, chatHistory: passedChatHistory, isFusedAgentContext, isFromPreviewSession } = location.state;
      setAgentData(passedAgentData);
      setIsContextFusedAgent(!!isFusedAgentContext);
      setIsMintingFromPreview(!!isFromPreviewSession);
      
      const conversationToPackage = passedChatHistory.filter(msg => msg.sender === 'user' || msg.sender === 'ai');
      setChatHistory(conversationToPackage);

      let agentType = !!isFusedAgentContext ? "Fused Agent" : "Memory";
      if (!!isFromPreviewSession) {
        agentType = "New Fused Agent (from Preview)";
      }

      const blueprintComponentCount = passedAgentData.fusedCreationData?.components?.length || 0;
      const assetsToConsider = (!!isFusedAgentContext || !!isFromPreviewSession) 
                               ? (passedAgentData.mergedAssets || passedAgentData.fusedCreationData?.mergedAssets) 
                               : passedAgentData.assets;
      const assetCount = assetsToConsider?.length || 0;

      setNftTitle(`Chat with ${agentType}: ${passedAgentData.title}`);
      let desc = `A packaged conversation with ${agentType}: "${passedAgentData.title}". Includes ${conversationToPackage.length} messages.`;
      if (!!isFromPreviewSession) {
        desc = `This package includes a chat conversation from a preview session and the definition of the new Fused Agent "${passedAgentData.title}". Chat length: ${conversationToPackage.length} messages.`;
      }
      
      if ((!!isFusedAgentContext || !!isFromPreviewSession) && blueprintComponentCount > 0) {
        desc += ` The Fused Agent blueprint has ${blueprintComponentCount} components.`;
      }
      if (assetCount > 0) {
        desc += ` Includes access to ${assetCount} associated asset(s).`;
      }
      setNftDescription(desc);

    } else {
      console.warn("Agent data or chat history not found in location state.");
      // navigate('/my-collection'); 
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const assetsToPackage = (isContextFusedAgent || isMintingFromPreview) 
                            ? (agentData?.mergedAssets || agentData?.fusedCreationData?.mergedAssets) 
                            : agentData?.assets;

    console.log("NFT Minting Data (Mock):", {
      nftTitle,
      nftDescription,
      nftPrice,
      nftTags: nftTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      originalAgentOrMemory: agentData, // If isMintingFromPreview, this is the new agent definition
      chatLog: chatHistory,
      includedAssets: assetsToPackage || [],
      isFusedAgentPackage: isContextFusedAgent || isMintingFromPreview,
      mintedFromPreviewSession: isMintingFromPreview,
    });
    alert('NFT package prepared for minting (mock)! Check console for data.');
    navigate('/my-collection'); // Or a success page
  };

  if (!agentData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8 bg-navy-dark text-gray-light">
        <Layers size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-light mb-2">Error Loading Package Data</h2>
        <p className="text-gray-medium">
          Could not load the Agent/Memory and chat history data. Please ensure you've come from a valid chat session.
        </p>
        <button 
          onClick={() => navigate(-1)} // Go back to previous page (chat)
          className="mt-6 px-6 py-2.5 bg-accent-purple text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors flex items-center"
        >
          <ArrowLeft size={18} className="mr-2" /> Go Back
        </button>
      </div>
    );
  }

  const blueprintComponentCount = agentData.fusedCreationData?.components?.length || 0;
  const assetsForDisplay = (isContextFusedAgent || isMintingFromPreview) 
                           ? (agentData.mergedAssets || agentData.fusedCreationData?.mergedAssets) 
                           : agentData.assets;
  const assetCount = assetsForDisplay?.length || 0;
  
  let agentTypeDisplay = isContextFusedAgent ? "Fused Agent" : "Memory";
  if (isMintingFromPreview) {
    agentTypeDisplay = "New Fused Agent (from Preview)";
  }
  
  const pageTitle = isMintingFromPreview 
    ? `Package Preview Chat & New Fused Agent` 
    : `Package Chat & ${agentTypeDisplay}`;


  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 text-gray-light">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-accent-purple hover:text-purple-400 mb-6 text-sm font-medium transition-colors"
      >
        <ArrowLeft size={18} className="mr-2" /> Back to Chat
      </button>

      <div className="flex items-center mb-8">
        {isMintingFromPreview ? <Edit3 size={36} className="text-yellow-400 mr-3" /> : <PackagePlus size={36} className="text-accent-purple mr-3" />}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-light">{pageTitle}</h1>
      </div>
      
      <div className="bg-navy-medium p-6 sm:p-8 rounded-xl shadow-2xl mb-8">
        <h2 className="text-2xl font-semibold text-gray-light mb-4 border-b border-gray-dark pb-3">Package Summary</h2>
        {isMintingFromPreview && (
          <p className="text-sm text-yellow-300 bg-yellow-600/20 p-3 rounded-md mb-4">
            You are packaging a chat from a preview session. This will include the chat history and the definition of the Fused Agent <strong>"{agentData.title}"</strong> as it was configured during the preview.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <p className="text-gray-medium">
              {isMintingFromPreview ? "New Fused Agent Title:" : `Original ${agentTypeDisplay}:`}
            </p>
            <p className={`font-semibold text-lg ${isContextFusedAgent || isMintingFromPreview ? 'text-green-400' : 'text-accent-purple'}`}>{agentData.title}</p>
          </div>
          <div>
            <p className="text-gray-medium">Chat History Length:</p>
            <p className="font-semibold text-lg">{chatHistory.length} messages</p>
          </div>
          {(isContextFusedAgent || isMintingFromPreview) && blueprintComponentCount > 0 && (
            <div>
              <p className="text-gray-medium">Blueprint Components:</p>
              <p className="font-semibold text-lg">{blueprintComponentCount}</p>
            </div>
          )}
          {assetCount > 0 && (
            <div>
              <p className="text-gray-medium">{(isContextFusedAgent || isMintingFromPreview) ? 'Merged' : 'Included'} Assets:</p>
              <p className="font-semibold text-lg">{assetCount}</p>
            </div>
          )}
        </div>
        {(isContextFusedAgent || isMintingFromPreview) && blueprintComponentCount > 0 && agentData.fusedCreationData?.components && (
          <details className="mt-4 text-xs">
            <summary className="cursor-pointer text-accent-purple hover:underline">View Blueprint Component Types</summary>
            <ul className="list-disc pl-5 mt-2 bg-navy-dark p-3 rounded-md">
              {agentData.fusedCreationData.components.map(comp => (
                <li key={comp.id} className="text-gray-medium mb-1">
                  {comp.type} {comp.isLorebook ? `(${comp.lorebookType} Lore)` : ''} - Source: {comp.sourceMemoryTitle || 'User-Defined'}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-navy-medium p-6 sm:p-8 rounded-xl shadow-2xl space-y-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-light mb-4 border-b border-gray-dark pb-3">New NFT Details</h2>
        <div>
          <label htmlFor="nftTitle" className="block text-sm font-medium text-gray-medium mb-1">
            <FileText size={16} className="inline mr-2" />NFT Title
          </label>
          <input
            type="text"
            id="nftTitle"
            value={nftTitle}
            onChange={(e) => setNftTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple shadow-sm text-gray-light placeholder-gray-medium"
            placeholder={`e.g., Conversation with ${agentData.title}`}
            required
          />
        </div>

        <div>
          <label htmlFor="nftDescription" className="block text-sm font-medium text-gray-medium mb-1">
            <MessageSquare size={16} className="inline mr-2" />Description
          </label>
          <textarea
            id="nftDescription"
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple shadow-sm text-gray-light placeholder-gray-medium"
            placeholder="Detailed description of this packaged AI interaction and its contents."
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nftPrice" className="block text-sm font-medium text-gray-medium mb-1">
              <DollarSign size={16} className="inline mr-2" />Price (e.g., SOL)
            </label>
            <input
              type="number"
              id="nftPrice"
              value={nftPrice}
              onChange={(e) => setNftPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple shadow-sm text-gray-light placeholder-gray-medium"
              placeholder="e.g., 0.5"
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="nftTags" className="block text-sm font-medium text-gray-medium mb-1">
              <Tag size={16} className="inline mr-2" />Tags (comma-separated)
            </label>
            <input
              type="text"
              id="nftTags"
              value={nftTags}
              onChange={(e) => setNftTags(e.target.value)}
              className="w-full px-4 py-2.5 bg-navy-dark border border-gray-dark rounded-lg focus:ring-2 focus:ring-accent-purple focus:border-accent-purple shadow-sm text-gray-light placeholder-gray-medium"
              placeholder={`e.g., ai chat, ${isContextFusedAgent || isMintingFromPreview ? 'fused agent' : 'memory'}, ${agentData.title.toLowerCase()}`}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-medium mb-1">
            <ImageIconLucide size={16} className="inline mr-2" />NFT Cover Image (Mock)
          </label>
          <button 
            type="button"
            className="w-full px-4 py-2.5 bg-navy-light border-2 border-dashed border-gray-dark rounded-lg text-gray-medium hover:border-accent-purple hover:text-accent-purple transition-colors"
            onClick={() => alert("Cover image upload functionality (mock). This is for the NFT listing, not agent assets.")}
          >
            Upload Cover Image
          </button>
        </div>
      </form>

      {assetCount > 0 && assetsForDisplay && (
        <div className="bg-navy-medium p-6 sm:p-8 rounded-xl shadow-2xl mb-8">
          <h2 className="text-2xl font-semibold text-gray-light mb-4 border-b border-gray-dark pb-3">
            Detailed Assets Included in this Package ({assetCount})
          </h2>
          <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {assetsForDisplay.map(asset => (
              <li key={asset.id} className="flex items-center p-3 bg-navy-dark border border-gray-dark rounded-lg shadow-sm">
                {getAssetIcon(asset.type)}
                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-light truncate" title={asset.name}>{asset.name}</p>
                  <p className="text-xs text-gray-medium">
                    Source: {asset.sourceMemoryTitle || 'N/A'}
                  </p>
                </div>
                {asset.url && (
                  <a 
                    href={asset.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-3 text-xs text-accent-purple-light hover:underline flex-shrink-0"
                  >
                    Preview
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="bg-navy-medium p-6 sm:p-8 rounded-xl shadow-2xl">
         <h2 className="text-2xl font-semibold text-gray-light mb-4 border-b border-gray-dark pb-3">Finalize Package</h2>
        <button 
          type="button" 
          onClick={handleSubmit} 
          className="w-full flex items-center justify-center px-6 py-3 bg-accent-purple text-white font-semibold rounded-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-navy-medium transition-colors duration-150 shadow-md hover:shadow-lg"
        >
          <ListChecks size={20} className="mr-2" />
          Confirm & Prepare for Minting (Mock)
        </button>
      </div>
    </div>
  );
};

export default MintFusedAgentPackage;
