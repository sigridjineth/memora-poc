import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, AlertTriangle, Layers, PlusCircle, MessageSquare, Tag } from 'lucide-react';
import { mockMemoriesData, ICON_SIZES } from '../data/mockMemories'; // Updated import

const MyMemories = () => {
  const navigate = useNavigate();
  const memories = mockMemoriesData; 

  const hasNoMemories = memories.length === 0;

  const navigateToCreateAgent = () => navigate('/create-agent'); // Updated route

  const navigateToChatAndMint = (memory) => {
    const { iconComponent, ...serializableMemoryData } = memory;
    navigate(`/chat/${memory.id}`, { state: { agentData: serializableMemoryData, isFusedAgent: memory.type === 'Fused Agent' } });
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 text-gray-light">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Package size={ICON_SIZES.PAGE_HEADER} className="mr-3 text-accent-purple" />
            My Collection
          </h1>
          <p className="text-gray-medium mt-2">
            View, manage, and fuse your AI Agent Memories. Create powerful new agents.
          </p>
        </div>
        <button
          onClick={navigateToCreateAgent}
          className="mt-4 sm:mt-0 bg-sky-600 text-white px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-colors font-medium flex items-center text-sm"
        >
          <PlusCircle size={ICON_SIZES.BUTTON_ICON} className="mr-2" /> Create / Fuse Agent
        </button>
      </header>

      {hasNoMemories ? (
        <div className="flex flex-col items-center justify-center text-center py-16 bg-navy-medium rounded-lg shadow-xl">
          <AlertTriangle size={ICON_SIZES.EMPTY_STATE_ALERT} className="text-yellow-500 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-3">Your Collection is Empty</h2>
          <p className="text-gray-medium max-w-md mb-6">
            You haven't created or collected any AI Agent Memories yet.
            Start by creating a new agent or exploring how to fuse memories to build unique AI personalities.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={navigateToCreateAgent}
              className="bg-accent-purple text-white px-6 py-2.5 rounded-lg hover:bg-opacity-80 transition-colors font-medium"
            >
              <PlusCircle size={ICON_SIZES.BUTTON_ICON} className="inline mr-2" /> Create New Agent
            </button>
            <button
              onClick={() => navigate('/marketplace')}
              className="bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Explore Marketplace
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {memories.map(memory => {
            const CardIcon = memory.iconComponent || Package; 
            return (
              <div key={memory.id} className="bg-navy-medium p-5 rounded-xl shadow-xl hover:shadow-accent-purple/40 transition-all duration-300 flex flex-col justify-between border border-gray-dark hover:border-accent-purple/50 transform hover:-translate-y-1">
                <div>
                  <div className="flex items-center mb-3">
                    <CardIcon size={ICON_SIZES.CARD_ICON} className={`mr-3 ${memory.type === 'Fused Agent' ? 'text-green-400' : 'text-sky-400'}`} />
                    <h2 className="text-xl font-semibold text-white truncate" title={memory.title}>{memory.title}</h2>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-3 inline-block ${
                    memory.type === 'Fused Agent' ? 'bg-green-500/20 text-green-300' : 
                    memory.type === 'Knowledge Pack' ? 'bg-sky-500/20 text-sky-300' : 
                    'bg-purple-500/20 text-purple-300'
                  }`}>
                    {memory.type}
                  </span>
                  {memory.type === 'Fused Agent' && memory.componentMemoriesCount && (
                    <p className="text-xs text-gray-400 mb-2">
                      Fused from {memory.componentMemoriesCount} components
                    </p>
                  )}
                  <p className="text-gray-400 text-sm line-clamp-3 mb-3 h-16">{memory.description || "No description available."}</p>
                  
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1 font-medium">Tags:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {memory.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md flex items-center">
                            <Tag size={ICON_SIZES.TAG_ICON} className="mr-1 text-gray-500"/> {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => navigateToChatAndMint(memory)}
                  className="w-full mt-auto bg-accent-purple text-white py-2.5 rounded-lg hover:bg-opacity-80 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <MessageSquare size={ICON_SIZES.BUTTON_ICON} className="mr-2" />
                  Interact / View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyMemories;
