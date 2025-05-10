import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, User, Brain, CornerDownLeft, AlertTriangle, Users as FusedIcon, Info, Paperclip, Layers, X, FileText, BookOpen, 
  Image as ImageIcon, FileArchive as AudioIcon, PackagePlus, Edit3
} from 'lucide-react';

// --- Constants (Readability: Naming Magic Numbers & Cohesion: Relating Magic Numbers to Logic) ---
const ICON_SIZES = {
  HEADER_PRIMARY: 24, HEADER_ACTION: 18, MESSAGE_SENDER: 28, MESSAGE_TYPE_INFO: 20,
  MODAL_HEADER: 22, MODAL_CLOSE: 24, COMPONENT_BLUEPRINT: 18, ASSET_BLUEPRINT: 16,
  INPUT_ACTION: 24, PACKAGE_NFT: 18, ASSET_COUNT_ICON: 14, ERROR_PAGE_ICON: 64,
  PREVIEW_ICON: 18,
};

const AI_RESPONSE_DELAY_MS = 1000;
const MAX_SUBSTRING_LENGTH = {
  BLUEPRINT_SUMMARY_COMPONENT: 15,
  BLUEPRINT_SUMMARY_FULL: 150,
  PERSONA_CONTEXT: 30,
  PERSONA_DISPLAY: 100,
};

// --- Helper Components (Readability: Abstracting Implementation Details) ---

const MessageItem = React.memo(({ message, isFusedAgent, characterTitle }) => {
  const senderIsUser = message.sender === 'user';
  const senderIsAi = message.sender === 'ai';
  const senderIsSystemInfo = message.type === 'info';

  const AiIconComponent = isFusedAgent ? FusedIcon : Brain;
  const aiIconColorClass = isFusedAgent ? "text-green-400" : "text-accent-purple";

  let bubbleClasses, IconElement, messageContent;

  if (senderIsUser) {
    bubbleClasses = 'bg-blue-600 text-white rounded-br-none';
    IconElement = <User size={ICON_SIZES.MESSAGE_SENDER} className="ml-2 text-blue-400 self-end mb-1 hidden sm:block" />;
    messageContent = message.text;
  } else if (senderIsAi) {
    bubbleClasses = 'bg-gray-dark text-gray-light rounded-bl-none';
    IconElement = <AiIconComponent size={ICON_SIZES.MESSAGE_SENDER} className={`mr-2 ${aiIconColorClass} self-end mb-1 hidden sm:block`} />;
    messageContent = message.text;
  } else if (senderIsSystemInfo) {
    bubbleClasses = 'bg-indigo-800/30 text-indigo-300 text-xs italic w-full rounded-lg py-2 border border-indigo-600/30';
    IconElement = <Info size={ICON_SIZES.MESSAGE_TYPE_INFO} className="mr-2 text-indigo-400 flex-shrink-0"/>;
    messageContent = <span className="whitespace-pre-wrap">{message.text}</span>;
  } else { // Fallback for other system messages (e.g., warnings)
    bubbleClasses = 'bg-yellow-600/20 text-yellow-300 text-xs italic text-center w-full rounded-lg py-2 border border-yellow-500/30';
    IconElement = <AlertTriangle size={ICON_SIZES.MESSAGE_TYPE_INFO} className="mr-2 text-yellow-400"/>;
    messageContent = message.text;
  }
  
  const showIconInsideBubble = senderIsSystemInfo || (!senderIsUser && !senderIsAi);

  return (
    <div className={`flex ${senderIsUser ? 'justify-end' : 'justify-start'}`}>
      {senderIsAi && IconElement}
      <div className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl px-4 py-3 rounded-2xl shadow-md ${bubbleClasses}`}>
        {showIconInsideBubble ? (
          <div className="flex items-start">
            {IconElement && React.cloneElement(IconElement, { className: `${IconElement.props.className} sm:block`})}
            {messageContent}
          </div>
        ) : (
          messageContent
        )}
      </div>
      {senderIsUser && IconElement}
    </div>
  );
});

const FusedAgentCompositionModal = React.memo(({ isOpen, onClose, agentData }) => {
  if (!isOpen || !agentData?.fusedCreationData) return null;

  const { title, fusedCreationData } = agentData;
  const { components = [], mergedAssets = [] } = fusedCreationData;

  const getComponentIcon = useCallback((type, isLorebook) => {
    const IconProps = { size: ICON_SIZES.COMPONENT_BLUEPRINT, className: "mr-2" };
    if (isLorebook) return <BookOpen {...IconProps} className={`${IconProps.className} text-yellow-400`} />;
    if (type.toLowerCase().includes('persona') || type.toLowerCase().includes('core prompt')) return <Brain {...IconProps} className={`${IconProps.className} text-pink-400`} />;
    if (type.toLowerCase().includes('logic') || type.toLowerCase().includes('instruction')) return <FileText {...IconProps} className={`${IconProps.className} text-blue-400`} />;
    return <Info {...IconProps} className={`${IconProps.className} text-gray-400`} />; // Default/Snippet
  }, []);

  const getAssetIcon = useCallback((assetType) => {
    const IconProps = { size: ICON_SIZES.ASSET_BLUEPRINT, className: "mr-2" };
    switch(assetType) {
      case 'image': return <ImageIcon {...IconProps} className={`${IconProps.className} text-sky-400`} />;
      case 'document': return <FileText {...IconProps} className={`${IconProps.className} text-amber-400`} />;
      case 'audio': return <AudioIcon {...IconProps} className={`${IconProps.className} text-lime-400`} />;
      default: return <Paperclip {...IconProps} className={`${IconProps.className} text-gray-400`} />;
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-navy-medium w-full max-w-2xl rounded-xl shadow-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-dark">
          <h3 className="text-xl font-semibold text-gray-light flex items-center">
            <Layers size={ICON_SIZES.MODAL_HEADER} className="mr-3 text-green-400" />
            Fused Agent Composition: {title}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-dark transition-colors">
            <X size={ICON_SIZES.MODAL_CLOSE} className="text-gray-light" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          <section>
            <h4 className="text-lg font-semibold text-accent-purple mb-3">Blueprint Components ({components.length})</h4>
            {components.length > 0 ? (
              <ul className="space-y-3">
                {components.map(comp => (
                  <li key={comp.id} className="p-3 bg-navy-dark rounded-lg border border-gray-dark shadow-sm">
                    <div className="flex items-center text-sm font-medium text-gray-light mb-1">
                      {getComponentIcon(comp.type, comp.isLorebook)}
                      <span>{comp.type}</span>
                      {comp.isLorebook && <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-600/30 text-yellow-300 rounded-full">{comp.lorebookType} Lore</span>}
                    </div>
                    <p className="text-xs text-gray-medium mb-1.5">Source: <span className="font-semibold">{comp.sourceMemoryTitle || 'N/A'}</span></p>
                    <p className="text-xs text-gray-light bg-navy-darker p-2 rounded whitespace-pre-wrap line-clamp-3" title={comp.content}>{comp.content}</p>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-medium italic">No components in this blueprint.</p>}
          </section>
          <section>
            <h4 className="text-lg font-semibold text-accent-purple mb-3">Merged Assets ({mergedAssets.length})</h4>
            {mergedAssets.length > 0 ? (
              <ul className="space-y-2">
                {mergedAssets.map(asset => (
                  <li key={asset.id} className="flex items-center p-2 bg-navy-dark rounded-md border border-gray-dark text-xs text-gray-light">
                    {getAssetIcon(asset.type)}
                    <span className="flex-grow truncate" title={asset.name}>{asset.name}</span>
                    <span className="ml-2 text-gray-medium flex-shrink-0">(from: {asset.sourceMemoryTitle || 'N/A'})</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-medium italic">No assets merged into this agent.</p>}
          </section>
        </div>
        <div className="p-4 border-t border-gray-dark flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-accent-purple text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
});

// --- Main Chat Component ---
const Chat = () => {
  const { id: memoryIdFromParams } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isPreviewSession = location.state?.isPreview || false;
  const initialAgentData = location.state?.agentData || null;

  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isFusedAgent, setIsFusedAgent] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [showCompositionModal, setShowCompositionModal] = useState(false);

  // Effect for initializing or fetching memory data
  useEffect(() => {
    if (isPreviewSession && initialAgentData) {
      setSelectedMemory(initialAgentData);
      setIsFusedAgent(true); // Preview agents are always considered "fused" for UI purposes
    } else {
      const memoryId = location.state?.selectedMemory?.id || memoryIdFromParams;
      const passedMemory = location.state?.selectedMemory;

      if (passedMemory) {
        setSelectedMemory(passedMemory);
        setIsFusedAgent(location.state?.isFusedAgent || false);
      } else if (memoryId) {
        console.warn(`Memory details for ${memoryId} would be fetched here if not passed in state (non-preview).`);
        const isPotentiallyFused = memoryId.startsWith('fused-') || memoryId.startsWith('temp-fused-');
         if (!isPotentiallyFused) {
            // This is a simplified mock fetch for a standard memory if not passed in state
            // In a real app, you'd fetch from an API: fetchMemoryById(memoryId)
            const mockStandardMemory = { // Replace with actual fetch logic
                id: memoryId, 
                title: `Memory ${memoryId}`,
                personaPrompt: `This is the persona for Memory ${memoryId}. It's a standard memory.`,
                assets: [{id: 'asset1', name: 'doc.pdf', type: 'document', sourceMemoryTitle: `Memory ${memoryId}`}],
                chatHistoryPreview: [
                    { role: 'ai', content: `Hello from Memory ${memoryId}!` }
                ]
            };
            setSelectedMemory(mockStandardMemory);
            setIsFusedAgent(false);
        } else {
            // If it's a fused ID and no data, it's an error state handled by render
            // This could happen if a user bookmarks a preview chat URL or a fused agent chat URL without state
            // For now, we'll try to mock a fused agent if it's not a preview.
            // In a real app, you'd fetch: fetchFusedAgentById(memoryId)
             const mockFusedAgent = { // Replace with actual fetch logic
                id: memoryId,
                title: `Fused Agent ${memoryId.replace('fused-','')}`,
                fusedCreationData: {
                    components: [{id: 'comp1', type: 'Persona Prompt', content: 'Default Fused Persona', sourceMemoryTitle: 'Base Memory'}],
                    mergedAssets: [{id: 'asset-fused', name: 'merged_doc.pdf', type: 'document', sourceMemoryTitle: 'Component Memory'}]
                },
                chatHistoryPreview: [
                    { role: 'ai', content: `Hello from Fused Agent ${memoryId.replace('fused-','')}!` }
                ]
            };
            setSelectedMemory(mockFusedAgent);
            setIsFusedAgent(true);
        }
      }
    }
  }, [isPreviewSession, initialAgentData, memoryIdFromParams, location.state]);

  // Effect for setting up initial messages based on selectedMemory
  useEffect(() => {
    if (!selectedMemory) {
      setMessages([]);
      return;
    }

    let systemMessageText = "";
    let initialChatHistory = selectedMemory.chatHistoryPreview || []; 

    if (isPreviewSession) {
      systemMessageText = `PREVIEW MODE: Testing new Fused Agent: "${selectedMemory.title}".\nThis agent is not yet saved or minted. You can chat and then package this conversation and agent definition.`;
      if (selectedMemory.fusedCreationData?.components) {
        const compSummary = selectedMemory.fusedCreationData.components.map(
          (c, i) => `${i+1}. ${c.type} ${c.sourceMemoryTitle ? `(from ${c.sourceMemoryTitle.substring(0,MAX_SUBSTRING_LENGTH.BLUEPRINT_SUMMARY_COMPONENT)}...)` : '(Custom)'}${c.isLorebook ? ` [${c.lorebookType} Lore]` : ''}`
        ).join('; ');
        const displaySummary = compSummary.length > MAX_SUBSTRING_LENGTH.BLUEPRINT_SUMMARY_FULL ? `${compSummary.substring(0, MAX_SUBSTRING_LENGTH.BLUEPRINT_SUMMARY_FULL)}...` : compSummary;
        systemMessageText += `\nBlueprint: ${displaySummary} (View composition for details)`;
      }
      if (selectedMemory.fusedCreationData?.mergedAssets?.length > 0) systemMessageText += `\nAccess to ${selectedMemory.fusedCreationData.mergedAssets.length} merged asset(s).`;
      initialChatHistory = []; 
    } else if (isFusedAgent) { // This now covers minted Fused Agents
      systemMessageText = `Interacting with Fused Agent: "${selectedMemory.title}".`;
      if (selectedMemory.fusedCreationData?.components?.length) {
         systemMessageText += ` Built from ${selectedMemory.fusedCreationData.components.length} component(s).`;
        const compSummary = selectedMemory.fusedCreationData.components.map(
          (c, i) => `${i+1}. ${c.type} ${c.sourceMemoryTitle ? `(from ${c.sourceMemoryTitle.substring(0,MAX_SUBSTRING_LENGTH.BLUEPRINT_SUMMARY_COMPONENT)}...)` : '(Custom)'}${c.isLorebook ? ` [${c.lorebookType} Lore]` : ''}`
        ).join('; ');
        const displaySummary = compSummary.length > MAX_SUBSTRING_LENGTH.BLUEPRINT_SUMMARY_FULL ? `${compSummary.substring(0, MAX_SUBSTRING_LENGTH.BLUEPRINT_SUMMARY_FULL)}...` : compSummary;
        systemMessageText += `\nBlueprint: ${displaySummary} (View composition for details)`;
      }
      if (selectedMemory.mergedAssets?.length > 0) systemMessageText += `\nAccess to ${selectedMemory.mergedAssets.length} merged asset(s).`;
       else if (selectedMemory.fusedCreationData?.mergedAssets?.length > 0) systemMessageText += `\nAccess to ${selectedMemory.fusedCreationData.mergedAssets.length} merged asset(s).`;


    } else { // Standard memory
      systemMessageText = `Interacting with memory: "${selectedMemory.title}". ${selectedMemory.personaPrompt ? 'Persona active.' : 'No specific persona.'}`;
      if (selectedMemory.assets?.length > 0) systemMessageText += `\nIncludes ${selectedMemory.assets.length} asset(s).`;
    }
    
    setMessages([
      { id: `sys-${Date.now()}`, text: systemMessageText, sender: 'system', type: 'info' },
      ...initialChatHistory.map((msg, idx) => ({
        id: `hist-${idx}-${Date.now()}`, text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai'
      }))
    ]);
  }, [selectedMemory, isFusedAgent, isPreviewSession]);

  const scrollToBottom = useCallback(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), []);
  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !selectedMemory) return;
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, text: input, sender: 'user' }]);

    let aiResponseText = `Generic AI response to: "${input}"`; 
    const agentTitle = selectedMemory.title || "Agent";

    if (isFusedAgent || isPreviewSession) { 
      const personaComp = selectedMemory.fusedCreationData?.components.find(c => c.type === 'Persona Prompt' || c.type === 'Core Prompt');
      const personaCtx = personaComp ? `(Persona: ${personaComp.content.substring(0,MAX_SUBSTRING_LENGTH.PERSONA_CONTEXT)}...)` : '(Fused blueprint)';
      aiResponseText = `As "${agentTitle}" ${personaCtx}, response to "${input}": [simulated fused response].`;
      if (selectedMemory.fusedCreationData?.mergedAssets?.length > 0) aiResponseText += ` Assets available.`;
    } else if (selectedMemory.personaPrompt) {
      aiResponseText = `Persona "${agentTitle}" responding to "${input}": [simulated response].`;
      if (selectedMemory.assets?.length > 0) aiResponseText += ` Assets available.`;
    }
    
    setTimeout(() => setMessages(prev => [...prev, { id: `ai-${Date.now()}`, text: aiResponseText, sender: 'ai' }]), AI_RESPONSE_DELAY_MS);
    setInput('');
  }, [input, selectedMemory, isFusedAgent, isPreviewSession]);

  const handlePackageAgentAndChat = useCallback(() => {
    if (!selectedMemory) return; 
    
    console.log("Packaging Agent/Memory and Chat History for NFT Minting...");
    const agentDataToPass = { ...selectedMemory };
    
    if (isFusedAgent && !isPreviewSession && !agentDataToPass.mergedAssets && agentDataToPass.fusedCreationData?.mergedAssets) {
        agentDataToPass.mergedAssets = agentDataToPass.fusedCreationData.mergedAssets;
    }

    navigate('/mint-fused-agent-package', { 
      state: { 
        agentData: agentDataToPass, 
        chatHistory: messages.filter(m => m.sender === 'user' || m.sender === 'ai'),
        isFusedAgentContext: isFusedAgent || isPreviewSession, // If it's a preview session, it's effectively a new Fused Agent
        isFromPreviewSession: isPreviewSession 
      } 
    });
  }, [selectedMemory, messages, navigate, isFusedAgent, isPreviewSession]);

  const handleBackNavigation = () => {
    if (isPreviewSession) {
      // Pass back the current state of the preview agent (e.g. title if edited in chat, though not implemented yet)
      // and the source memories used to create it.
      const sourceMemories = location.state?.agentData?.fusedCreationData?.sourceMemories || 
                             (initialAgentData?.fusedCreationData?.sourceMemories || []);
      navigate('/configure-fusion', { 
        state: { 
          // selectedMemories: sourceMemories, // This might be too complex if agentData was modified
          // Instead, just signal to re-evaluate or use what's already in ConfigureFusionPage's state
          // For simplicity, we can just navigate back. ConfigureFusionPage should retain its state or re-fetch if needed.
          // Or, pass the original selected memories that formed this preview agent.
           selectedMemories: location.state?.agentData?.fusedCreationData?.sourceMemories || initialAgentData?.fusedCreationData?.sourceMemories || []
        } 
      }); 
    } else if (isFusedAgent) {
      navigate('/my-collection');
    } else {
      navigate('/marketplace');
    }
  };

  if (!selectedMemory) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-navy-dark text-gray-light">
        <AlertTriangle size={ICON_SIZES.ERROR_PAGE_ICON} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-light mb-2">Agent/Memory Not Found</h2>
        <p className="text-gray-medium">Context could not be loaded. Please select a valid memory or agent, or check if your preview session data is available.</p>
        <button onClick={() => navigate('/my-collection')} className="mt-6 px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">Go to My Collection</button>
      </div>
    );
  }
  
  const currentAssets = isFusedAgent || isPreviewSession 
    ? selectedMemory.fusedCreationData?.mergedAssets 
    : selectedMemory.assets;
  const hasAssets = currentAssets && currentAssets.length > 0;
  const personaDisplay = selectedMemory.personaPrompt ? `${selectedMemory.personaPrompt.substring(0,MAX_SUBSTRING_LENGTH.PERSONA_DISPLAY)}${selectedMemory.personaPrompt.length > MAX_SUBSTRING_LENGTH.PERSONA_DISPLAY ? '...' : ''}` : null;
  
  let primaryComponentType = null;
  if (selectedMemory.fusedCreationData?.components && selectedMemory.fusedCreationData.components.length > 0) {
    primaryComponentType = selectedMemory.fusedCreationData.components[0].type;
  }

  const canPackageChat = !!selectedMemory; // Enable if a memory/agent is selected, regardless of preview

  return (
    <div className="flex flex-col h-full bg-navy-medium shadow-xl rounded-lg overflow-hidden text-gray-light">
      <header className="bg-gradient-to-r from-gray-dark to-navy-darker text-white p-4 sm:p-6 shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex-grow min-w-0">
            <h1 className="text-xl sm:text-2xl font-semibold flex items-center truncate">
              {(isFusedAgent || isPreviewSession) ? <FusedIcon size={ICON_SIZES.HEADER_PRIMARY} className="mr-3 text-green-400 flex-shrink-0" /> : <Brain size={ICON_SIZES.HEADER_PRIMARY} className="mr-3 text-accent-purple flex-shrink-0" />}
              <span className="truncate">
                {isPreviewSession ? "Previewing Fused Agent: " : (isFusedAgent ? "Chat with Fused Agent: " : "Chat with Memory: ")}
                <strong>{selectedMemory.title}</strong>
              </span>
              {(isFusedAgent || isPreviewSession) && selectedMemory.fusedCreationData && (
                <button onClick={() => setShowCompositionModal(true)} className="ml-3 p-1.5 rounded-full hover:bg-white/20" title="View Agent Composition"><Layers size={ICON_SIZES.HEADER_ACTION} /></button>
              )}
              {canPackageChat && (
                <button onClick={handlePackageAgentAndChat} className="ml-2 p-1.5 rounded-full hover:bg-white/20" title={isPreviewSession ? "Package Preview Chat & New Agent Definition" : "Package Chat & Agent/Memory as NFT"}><PackagePlus size={ICON_SIZES.PACKAGE_NFT} /></button>
              )}
              {isPreviewSession && (
                 <span className="ml-3 px-2 py-1 text-xs bg-yellow-500/30 text-yellow-300 rounded-full flex items-center">
                    <Edit3 size={ICON_SIZES.PREVIEW_ICON} className="mr-1.5" /> Preview Mode
                 </span>
              )}
            </h1>
            {(isFusedAgent || isPreviewSession) && primaryComponentType && (
              <p className="text-xs sm:text-sm text-green-300/80 mt-1 italic truncate">Blueprint: {selectedMemory.fusedCreationData.components.length} components. Primary: {primaryComponentType}.</p>
            )}
            {!isFusedAgent && !isPreviewSession && personaDisplay && (
              <p className="text-xs sm:text-sm text-gray-medium mt-1 italic truncate" title={selectedMemory.personaPrompt}>Active Persona: {personaDisplay}</p>
            )}
          </div>
          {hasAssets && (
            <div className="text-right mt-1 flex-shrink-0 ml-2">
              <span className="text-xs text-gray-400 flex items-center"><Paperclip size={ICON_SIZES.ASSET_COUNT_ICON} className="mr-1"/>{currentAssets.length} Asset(s)</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex-grow p-4 sm:p-6 space-y-4 overflow-y-auto bg-navy-dark">
        {messages.map(msg => <MessageItem key={msg.id} message={msg} isFusedAgent={isFusedAgent || isPreviewSession} characterTitle={selectedMemory.title}/>)}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-6 border-t border-gray-dark bg-navy-darker">
        <div className="flex items-center space-x-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedMemory.title}...`} disabled={!selectedMemory}
            className="flex-grow p-3 bg-navy-dark border border-gray-dark rounded-xl focus:ring-2 focus:ring-accent-purple focus:border-accent-purple outline-none transition-shadow text-gray-light placeholder-gray-medium"/>
          <button onClick={handleSend} disabled={!selectedMemory || !input.trim()}
            className="p-3 bg-accent-purple text-white rounded-xl hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-accent-purple focus:ring-offset-2 focus:ring-offset-navy-darker transition-colors shadow-md disabled:opacity-50">
            <Send size={ICON_SIZES.INPUT_ACTION} />
          </button>
          <button onClick={handleBackNavigation}
            className="p-3 bg-gray-dark text-gray-light rounded-xl hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-gray-medium focus:ring-offset-2 focus:ring-offset-navy-darker transition-colors hidden sm:block"
            title={isPreviewSession ? "Back to Configuration" : (isFusedAgent ? "Back to My Collection" : "Back to Marketplace")}>
            <CornerDownLeft size={ICON_SIZES.INPUT_ACTION} />
          </button>
        </div>
      </div>
      {selectedMemory?.fusedCreationData && 
        <FusedAgentCompositionModal 
          isOpen={showCompositionModal} 
          onClose={() => setShowCompositionModal(false)} 
          agentData={selectedMemory} 
        />
      }
    </div>
  );
};

export default Chat;
