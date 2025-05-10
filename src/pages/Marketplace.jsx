import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Tag, UserCircle, ExternalLink, Zap, MessageSquareText, Brain, Database, TrendingUp, Star, ChevronRight, ChevronLeft, Filter as FilterIcon, List, Grid } from 'lucide-react';

const initialMemoriesData = [
  { 
    id: 'memory-001', 
    title: 'Solana Contract Audit Pro',
    description: 'Deep memory of a Solana smart contract auditor. Focus: security vulnerabilities, gas optimization, best practices.',
    category: 'Development',
    personaPrompt: "You are a meticulous Solana smart contract auditor...",
    chatHistoryPreview: [{"role": "user", "content": "Review this SPL token mint function?"}, {"role": "assistant", "content": "Certainly. Checking for reentrancy and CPI state issues..."}],
    assets: [
      {type: "hero", url: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", caption: "Code Audit Interface"}, // Hero image
      {type: "thumbnail", url: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=600&h=400", caption: "Code Audit Thumbnail"},
    ],
    tags: ['solana', 'security', 'audit', 'rust', 'devtool', 'memory', 'smart-contract'],
    priceSOL: 1.5, 
    creator: { name: 'AuditSecureDAO', avatar: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
    version: "1.1.0",
    lastUpdated: "2024-07-30T10:00:00Z",
    interactions: 1200,
    rating: 4.8,
    priceChange24h: "+2.5%",
    volume24h: 25, // Number of sales/acquisitions
    isFeatured: true,
    isTrending: true,
  },
  { 
    id: 'memory-002', 
    title: 'React Performance Guru',
    description: 'AI memory for React component optimization. Covers rendering, bundle size, and speed enhancements.',
    category: 'Web Development',
    personaPrompt: "I'm your React Performance Pro! Let's optimize your app.",
    chatHistoryPreview: [{"role": "user", "content": "My list re-renders too often."}, {"role": "assistant", "content": "Let's check `React.memo` and `useCallback` usage."}],
    assets: [
      {type: "thumbnail", url: "https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1", caption: "React Code"},
    ],
    tags: ['react', 'performance', 'frontend', 'javascript', 'optimization', 'memory'],
    priceSOL: 0.8, 
    creator: { name: 'FrontendBoost', avatar: 'https://images.pexels.com/photos/160107/pexels-photo-160107.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
    version: "1.2.1",
    lastUpdated: "2024-07-29T14:00:00Z",
    interactions: 2500,
    rating: 4.9,
    priceChange24h: "+0.5%",
    volume24h: 40,
    isFeatured: true,
  },
  { 
    id: 'memory-003', 
    title: 'Creative Story Weaver',
    description: 'Imaginative AI partner for story ideas, character development, and narrative crafting.',
    category: 'Creative',
    personaPrompt: "Greetings, wordsmith! I am Lyra. What story shall we tell?",
    chatHistoryPreview: [{"role": "user", "content": "Need an unexpected villain."}, {"role": "assistant", "content": "How about a benevolent healer with a secret agenda?"}],
    assets: [
      {type: "thumbnail", url: "https://images.pexels.com/photos/3127880/pexels-photo-3127880.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1", caption: "Vintage Typewriter"},
    ],
    tags: ['storytelling', 'creative writing', 'fiction', 'plot', 'memory'],
    priceSOL: 1.2, 
    creator: { name: 'NarrativeWeavers', avatar: 'https://images.pexels.com/photos/326518/pexels-photo-326518.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1' },
    version: "2.0.0",
    lastUpdated: "2024-07-30T09:00:00Z",
    interactions: 800,
    rating: 4.5,
    priceChange24h: "-1.2%",
    volume24h: 15,
    isTrending: true,
  },
  { 
    id: 'memory-004', 
    title: 'Pythonic Code Architect',
    description: 'Memory of an AI expert in Python, focusing on clean architecture, design patterns, and advanced libraries.',
    category: 'Development',
    personaPrompt: "I am your Python Architect. Let's build robust and scalable Python applications.",
    chatHistoryPreview: [{"role": "user", "content": "Best way to structure a FastAPI project?"}, {"role": "assistant", "content": "Consider using a modular approach with routers and dependency injection..."}],
    assets: [
      {type: "thumbnail", url: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600&h=400", caption: "Python Code on Screen"},
    ],
    tags: ['python', 'api', 'fastapi', 'architecture', 'devtool', 'memory'],
    priceSOL: 2.1, 
    creator: { name: 'PyMasters', avatar: 'https://images.pexels.com/photos/762080/pexels-photo-762080.jpeg?auto=compress&cs=tinysrgb&w=100&h=100' },
    version: "1.0.0",
    lastUpdated: "2024-07-28T18:00:00Z",
    interactions: 1500,
    rating: 4.7,
    priceChange24h: "+3.0%",
    volume24h: 30,
    isFeatured: true,
  },
  { 
    id: 'memory-005', 
    title: 'Game Design Strategist',
    description: 'A comprehensive memory for game design principles, mechanics, monetization, and player psychology.',
    category: 'Gaming',
    personaPrompt: "Ready to design the next hit game? I'm your strategic partner.",
    chatHistoryPreview: [{"role": "user", "content": "How to balance difficulty curve?"}, {"role": "assistant", "content": "Start with clear onboarding, then introduce complexity gradually..."}],
    assets: [
      {type: "thumbnail", url: "https://images.pexels.com/photos/735911/pexels-photo-735911.jpeg?auto=compress&cs=tinysrgb&w=600&h=400", caption: "Game Development"},
    ],
    tags: ['gamedev', 'design', 'monetization', 'unity', 'unreal', 'memory'],
    priceSOL: 1.8, 
    creator: { name: 'PixelPlay', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100' },
    version: "1.3.0",
    lastUpdated: "2024-07-29T11:00:00Z",
    interactions: 950,
    rating: 4.6,
    priceChange24h: "-0.8%",
    volume24h: 22,
    isTrending: true,
  },
  // Add more memories to have enough for different sections
    { 
    id: 'memory-006', 
    title: 'LegalTech Advisor AI',
    description: 'Memory specialized in legal document analysis, case law research, and compliance checks.',
    category: 'Professional',
    personaPrompt: "I am your LegalTech Advisor. How can I assist with your legal queries today?",
    chatHistoryPreview: [{"role": "user", "content": "Find precedents for IP theft."}, {"role": "assistant", "content": "Searching relevant databases for similar case law..."}],
    assets: [
      {type: "thumbnail", url: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=600&h=400", caption: "Legal Documents"},
    ],
    tags: ['legal', 'law', 'compliance', 'research', 'ai', 'memory'],
    priceSOL: 3.5, 
    creator: { name: 'LexIntellect', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100&h=100' },
    version: "1.0.0",
    lastUpdated: "2024-07-30T15:00:00Z",
    interactions: 450,
    rating: 4.9,
    priceChange24h: "+1.5%",
    volume24h: 10,
  },
];


const MemoryCard = ({ memory, onClick }) => (
  <div 
    className="bg-navy-medium rounded-xl shadow-xl overflow-hidden flex flex-col group transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-dark hover:border-accent-purple"
    onClick={onClick}
  >
    <div className="relative">
      <img 
        src={memory.assets.find(a => a.type === 'thumbnail')?.url || 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1'} 
        alt={memory.title} 
        className="w-full h-56 object-cover"
      />
      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-xs font-semibold">
        {memory.priceSOL} SOL
      </div>
      <div className="absolute bottom-2 left-2 bg-accent-purple text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
        <Database size={12} className="mr-1" /> {memory.category || 'Memory'}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <h3 className="text-lg font-semibold text-gray-light mb-1 truncate group-hover:text-accent-purple transition-colors" title={memory.title}>{memory.title}</h3>
      <div className="flex items-center text-xs text-gray-medium mb-2">
        <img src={memory.creator.avatar} alt={memory.creator.name} className="w-5 h-5 rounded-full mr-1.5 border border-gray-dark"/>
        <span>{memory.creator.name}</span>
      </div>
      <p className="text-gray-medium text-sm mb-3 flex-grow line-clamp-2">{memory.description}</p>
      
      <div className="flex justify-between items-center text-xs text-gray-medium mb-3">
        <div className="flex items-center">
          <Star size={14} className="mr-1 text-yellow-400"/> {memory.rating || 'N/A'}
        </div>
        <div className={`font-semibold ${memory.priceChange24h?.startsWith('+') ? 'text-green-positive' : 'text-red-negative'}`}>
          {memory.priceChange24h || 'N/A'}
        </div>
      </div>
      
      <button 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className="mt-auto w-full px-4 py-2 bg-accent-purple text-white font-semibold rounded-lg hover:bg-opacity-80 transition-all duration-150 text-sm flex items-center justify-center"
      >
        <Zap size={16} className="mr-2"/> View Details
      </button>
    </div>
  </div>
);

const LeaderboardItem = ({ memory, rank, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center p-3 hover:bg-navy-light rounded-lg cursor-pointer transition-colors group"
  >
    <span className="text-gray-medium font-semibold w-8 text-center">{rank}</span>
    <img src={memory.assets.find(a => a.type === 'thumbnail')?.url || memory.creator.avatar} alt={memory.title} className="w-10 h-10 rounded-md object-cover ml-2 mr-3 border border-gray-dark"/>
    <div className="flex-grow">
      <h4 className="text-sm font-semibold text-gray-light truncate group-hover:text-accent-purple">{memory.title}</h4>
      <p className="text-xs text-gray-medium">by {memory.creator.name}</p>
    </div>
    <div className="text-right ml-2">
      <p className="text-sm font-semibold text-gray-light">{memory.priceSOL} SOL</p>
      <p className={`text-xs ${memory.priceChange24h?.startsWith('+') ? 'text-green-positive' : 'text-red-negative'}`}>
        {memory.priceChange24h || <span className="text-gray-medium">N/A</span>}
      </p>
    </div>
  </div>
);


const Marketplace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [memories, setMemories] = useState(initialMemoriesData);
  const [showDetailsModal, setShowDetailsModal] = useState(null);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState('Top'); // Top, Trending
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState('24h'); // 24h, 7d, 30d
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search');

  useEffect(() => {
    if (searchQuery) {
      const filtered = initialMemoriesData.filter(memory =>
        memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        memory.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setMemories(filtered);
    } else {
      setMemories(initialMemoriesData);
    }
  }, [searchQuery]);
  
  const openDetails = (memory) => setShowDetailsModal(memory);
  const closeDetails = () => setShowDetailsModal(null);

  const handleAcquireMemory = (memory) => {
    closeDetails();
    navigate(`/chat/${memory.id}`, { state: { selectedMemory: memory } });
  };

  const featuredMemories = memories.filter(m => m.isFeatured).slice(0, 5);
  const trendingMemories = memories.filter(m => m.isTrending).slice(0, 5);
  
  const getLeaderboardData = () => {
    let sortedMemories = [...memories];
    if (activeLeaderboardTab === 'Top') {
      sortedMemories.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0)); // Example: sort by volume
    } else { // Trending
      sortedMemories.sort((a, b) => parseFloat(b.priceChange24h || "0") - parseFloat(a.priceChange24h || "0")); // Example: sort by price change
    }
    return sortedMemories.slice(0, 10);
  };
  
  const heroMemories = memories.filter(m => m.assets.find(a => a.type === 'hero')).slice(0,3); // Select up to 3 memories with hero images

  useEffect(() => {
    if (heroMemories.length === 0) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroMemories.length);
    }, 7000); // Change hero every 7 seconds
    return () => clearInterval(timer);
  }, [heroMemories.length]);

  const currentHeroMemory = heroMemories[currentHeroIndex];

  const categories = [...new Set(initialMemoriesData.map(m => m.category))].slice(0, 6); // Get unique categories

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {currentHeroMemory && (
        <section className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
          <img 
            src={currentHeroMemory.assets.find(a => a.type === 'hero')?.url} 
            alt={currentHeroMemory.title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full md:w-2/3 lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">{currentHeroMemory.title}</h2>
            <p className="text-lg text-gray-200 mb-2 line-clamp-2 drop-shadow-md">{currentHeroMemory.description}</p>
            <div className="flex items-center text-sm text-gray-300 mb-6">
              <img src={currentHeroMemory.creator.avatar} alt={currentHeroMemory.creator.name} className="w-8 h-8 rounded-full mr-2 border-2 border-accent-purple"/>
              <span>By {currentHeroMemory.creator.name}</span>
              <span className="mx-2">|</span>
              <span>{currentHeroMemory.interactions} Interactions</span>
            </div>
            <button 
              onClick={() => openDetails(currentHeroMemory)}
              className="px-8 py-3 bg-accent-purple text-white font-semibold rounded-lg hover:bg-opacity-80 transition-colors text-lg shadow-lg"
            >
              Explore Memory
            </button>
          </div>
          {heroMemories.length > 1 && (
             <div className="absolute bottom-6 right-6 flex space-x-2">
                {heroMemories.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentHeroIndex(idx)} className={`w-3 h-3 rounded-full ${currentHeroIndex === idx ? 'bg-accent-purple' : 'bg-white/50 hover:bg-white/80'}`}></button>
                ))}
            </div>
          )}
        </section>
      )}

      {/* Category Pills */}
      <section>
        <div className="flex space-x-3 overflow-x-auto pb-2 -mx-1 px-1">
          {categories.map(category => (
            <button 
              key={category} 
              onClick={() => navigate(`/marketplace?category=${encodeURIComponent(category)}`)}
              className="px-4 py-2 text-sm font-medium bg-navy-light text-gray-light rounded-full hover:bg-accent-purple hover:text-white transition-colors whitespace-nowrap"
            >
              {category}
            </button>
          ))}
           <button 
              onClick={() => navigate(`/marketplace`)} // Clears category filter
              className="px-4 py-2 text-sm font-medium bg-gray-dark text-gray-light rounded-full hover:bg-gray-medium hover:text-white transition-colors whitespace-nowrap"
            >
              All Memories
            </button>
        </div>
      </section>


      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="lg:w-2/3 space-y-12">
          {/* Featured Memories Section */}
          {featuredMemories.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-light mb-6 flex items-center"><Star size={28} className="mr-3 text-yellow-400"/>Featured Memories</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {featuredMemories.map(memory => <MemoryCard key={memory.id} memory={memory} onClick={() => openDetails(memory)} />)}
              </div>
            </section>
          )}

          {/* Top Movers Section */}
          {trendingMemories.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-light mb-6 flex items-center"><TrendingUp size={28} className="mr-3 text-green-positive"/>Top Movers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {trendingMemories.map(memory => <MemoryCard key={memory.id} memory={memory} onClick={() => openDetails(memory)} />)}
              </div>
            </section>
          )}
          
          {/* All Memories (if search is active or no featured/trending) */}
           {(searchQuery && memories.length > 0 && featuredMemories.length === 0 && trendingMemories.length === 0) && (
             <section>
              <h2 className="text-3xl font-bold text-gray-light mb-6">Search Results for "{searchQuery}"</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {memories.map(memory => <MemoryCard key={memory.id} memory={memory} onClick={() => openDetails(memory)} />)}
              </div>
            </section>
           )}

          {memories.length === 0 && searchQuery && (
            <p className="text-center text-gray-medium text-lg py-10">No AI Agent Memories found for "{searchQuery}". Try a different keyword!</p>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="lg:w-1/3 space-y-8">
          <div className="bg-navy-medium p-6 rounded-2xl shadow-xl border border-gray-dark">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-light">Leaderboard</h3>
              {/* View toggle - optional for later */}
              {/* <div className="flex items-center space-x-1 p-0.5 bg-navy-light rounded-md">
                <button className="p-1.5 rounded text-gray-medium hover:text-white hover:bg-gray-dark"><List size={18}/></button>
                <button className="p-1.5 rounded text-gray-medium hover:text-white hover:bg-gray-dark"><Grid size={18}/></button>
              </div> */}
            </div>
            <div className="flex border-b border-gray-dark mb-1">
              {['Top', 'Trending'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveLeaderboardTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${activeLeaderboardTab === tab ? 'text-accent-purple border-b-2 border-accent-purple' : 'text-gray-medium hover:text-white'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Timeframe - can be more interactive later */}
            {/* <div className="flex space-x-2 mb-4">
              {['24h', '7d', '30d'].map(tf => (
                <button key={tf} onClick={() => setLeaderboardTimeframe(tf)} className={`px-2 py-1 text-xs rounded ${leaderboardTimeframe === tf ? 'bg-accent-purple text-white' : 'bg-navy-light text-gray-medium hover:bg-gray-dark'}`}>
                  {tf}
                </button>
              ))}
            </div> */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto pr-1">
              {getLeaderboardData().map((memory, index) => (
                <LeaderboardItem key={memory.id} memory={memory} rank={index + 1} onClick={() => openDetails(memory)} />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Details Modal (largely unchanged, but ensure styling fits dark theme) */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeDetails}>
          <div 
            className="bg-navy-medium p-6 sm:p-8 rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all duration-300 ease-in-out scale-100 overflow-y-auto max-h-[90vh] border border-gray-dark text-gray-light" 
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white">{showDetailsModal.title}</h2>
                <div className="flex items-center text-sm text-gray-medium mt-2">
                  <img src={showDetailsModal.creator.avatar} alt={showDetailsModal.creator.name} className="w-6 h-6 rounded-full mr-2 border border-gray-dark"/>
                  Created by <span className="font-semibold text-gray-light ml-1">{showDetailsModal.creator.name}</span>
                  <span className="mx-2">|</span>
                  Version: {showDetailsModal.version}
                  <Database size={14} className="ml-2 mr-1 text-accent-purple"/> AI Agent Memory
                </div>
              </div>
              <button onClick={closeDetails} className="text-gray-medium hover:text-white text-3xl p-1">&times;</button>
            </div>
            
            {showDetailsModal.assets.find(a => a.type === 'thumbnail' || a.type === 'image') && 
              <img 
                src={showDetailsModal.assets.find(a => a.type === 'thumbnail' || a.type === 'image').url} 
                alt={showDetailsModal.title} 
                className="w-full h-72 object-cover rounded-lg mb-6 shadow-lg border border-gray-dark"
              />
            }

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><MessageSquareText size={20} className="mr-2 text-accent-purple"/>Memory Description</h3>
                <p className="text-gray-light leading-relaxed">{showDetailsModal.description}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2 flex items-center"><Brain size={20} className="mr-2 text-accent-purple"/>Embedded Persona</h3>
                <p className="text-gray-light italic bg-navy-light p-3 rounded-md text-sm border border-gray-dark">"{showDetailsModal.personaPrompt}"</p>
              </div>
            </div>
            
            {showDetailsModal.chatHistoryPreview && showDetailsModal.chatHistoryPreview.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-3">Chat History Preview</h3>
                <div className="bg-navy-light p-4 rounded-lg border border-gray-dark max-h-40 overflow-y-auto">
                  {showDetailsModal.chatHistoryPreview.map((msg, index) => (
                    <div key={index} className={`mb-2 text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <span className={`px-3 py-1.5 rounded-lg inline-block ${msg.role === 'user' ? 'bg-accent-blue text-white' : 'bg-gray-dark text-gray-light'}`}>
                        <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {showDetailsModal.tags.map(tag => (
                  <span key={tag} className={`px-3 py-1.5 text-xs font-semibold rounded-full ${tag === 'memory' ? 'bg-green-positive/20 text-green-positive' : 'bg-accent-blue/20 text-accent-blue'}`}>{tag}</span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-dark">
              <span className="text-4xl font-bold text-green-positive mb-4 sm:mb-0">{showDetailsModal.priceSOL} SOL</span>
              <button 
                onClick={() => handleAcquireMemory(showDetailsModal)}
                className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-green-positive to-teal-500 text-white font-bold rounded-lg hover:opacity-80 transition-opacity duration-150 shadow-xl text-lg flex items-center justify-center"
              >
                <ShoppingCart size={22} className="mr-2.5"/> Acquire & Interact 
              </button>
            </div>
             <a href="#" onClick={(e) => {e.preventDefault(); alert("Solana Explorer link placeholder for Memory NFT");}} className="mt-6 text-sm text-accent-blue hover:underline flex items-center justify-center">
                View Memory NFT on Solana Explorer <ExternalLink size={14} className="ml-1"/>
             </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
