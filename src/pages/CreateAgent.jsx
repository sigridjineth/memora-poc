import React, { useState, useCallback } from 'react';
import {
  User, Image as ImageIcon, FileText, MessageSquareText, Settings2, BookOpen, Edit3, Save, ChevronRight, ChevronLeft, PlusCircle, Trash2, AlertCircle, CheckCircle, UploadCloud, Paperclip
} from 'lucide-react';

// --- Constants (Readability: Naming Magic Numbers & Cohesion: Relating Magic Numbers to Logic) ---
const MAX_LENGTHS = {
  NAME: 50, INTRODUCTION: 2000, DETAILED_SETTINGS: 15000, INITIAL_SITUATION: 1000,
  FIRST_LINE: 500, LOREBOOK_CONTENT: 1500, FINAL_DETAILS: 300,
};

const ICON_SIZES = {
  TAB_ICON: 16, BUTTON_ICON: 14, SECTION_HEADER_ICON: 24, LOREBOOK_ACTION_ICON: 16,
  UPLOAD_ICON: 48, CHAT_HISTORY_UPLOAD_ICON: 40, CHAT_TEST_SETTINGS_ICON: 16,
  CHAT_TEST_SEND_ICON: 20, FEEDBACK_ICON: 20,
};

const MAX_TEST_CHATS = 10;
const CHAT_TEST_AVATAR_SIZE_CLASS = "w-8 h-8"; // For Tailwind

// Forward declaration for TABS_CONFIG
let ProfileTab, AssetTab, DetailsTab, StartSituationTab, OtherSettingsTab, LorebookTab, EditAndRegisterTab;

const TABS_CONFIG = [
  { id: 'profile', name: 'Profile', icon: User, component: (props) => <ProfileTab {...props} /> },
  { id: 'asset', name: 'Asset', icon: ImageIcon, component: (props) => <AssetTab {...props} /> },
  { id: 'details', name: 'Details', icon: FileText, component: (props) => <DetailsTab {...props} /> },
  { id: 'startSituation', name: 'Start Situation', icon: MessageSquareText, component: (props) => <StartSituationTab {...props} /> },
  { id: 'otherSettings', name: 'Other Settings', icon: Settings2, component: (props) => <OtherSettingsTab {...props} /> },
  { id: 'lorebook', name: 'Lorebook', icon: BookOpen, component: (props) => <LorebookTab {...props} /> },
  { id: 'editAndRegister', name: 'Edit & Register', icon: Edit3, component: (props) => <EditAndRegisterTab {...props} /> },
];

const INITIAL_CHARACTER_DATA = {
  profile: { name: '', introduction: '' },
  asset: { images: [], avatar: null },
  details: { systemTemplate: 'Default Template', detailedSettings: '' },
  startSituation: { initialSituation: '', firstLine: '', uploadedChatHistory: null, chatHistoryFileName: '' },
  otherSettings: { visibility: 'Public', safeFilter: 'all', categories: [], hashtags: '' },
  lorebooks: [{ id: Date.now(), content: '', keywords: '' }],
  editAndRegister: { details: '', date: '', location: '', height: '', weight: '', jobs: [''], interests: [''], likes: [''], dislikes: [''] }
};

// --- Helper Components & Functions ---
const CharacterNameInput = React.memo(({ value, onChange }) => (
  <div>
    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
    <input type="text" id="name" value={value} onChange={e => onChange('profile', 'name', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" maxLength={MAX_LENGTHS.NAME} />
    <p className="text-xs text-gray-400 mt-1 text-right">{value.length}/{MAX_LENGTHS.NAME}</p>
  </div>
));

const CharacterIntroductionInput = React.memo(({ value, onChange }) => (
  <div>
    <label htmlFor="introduction" className="block text-sm font-medium text-gray-300 mb-1">Character Introduction *</label>
    <textarea id="introduction" value={value} onChange={e => onChange('profile', 'introduction', e.target.value)} rows="4" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" maxLength={MAX_LENGTHS.INTRODUCTION}></textarea>
    <div className="flex justify-between items-center mt-1">
      <button type="button" className="text-xs bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded">Auto</button>
      <p className="text-xs text-gray-400">{value.length}/{MAX_LENGTHS.INTRODUCTION}</p>
    </div>
  </div>
));

// --- Tab Components (Readability: Separating Code Paths & Abstracting Implementation Details) ---
ProfileTab = React.memo(({ data, onChange }) => (
  <div className="space-y-6">
    <CharacterNameInput value={data.name} onChange={onChange} />
    <CharacterIntroductionInput value={data.introduction} onChange={onChange} />
  </div>
));

AssetTab = React.memo(({ data, onChange }) => { // data, onChange are placeholders
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-300">Please upload images that best represent the character (maximum 80 images). Recommended image size is 1024x1792 (9:16), under 5MB.</p>
      <button type="button" className="text-pink-500 text-sm hover:underline">Creation Policy ></button>
      <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-600 rounded-md p-4">
        <UploadCloud size={ICON_SIZES.UPLOAD_ICON} className="text-gray-500 mb-2" />
        <p className="text-gray-400 mb-2">Drag & drop images here or</p>
        <button type="button" className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded text-sm">Upload Image</button>
      </div>
      <button type="button" className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded text-sm">Generate AI Image</button>
      <p className="text-xs text-gray-400 text-center">Image management UI will be here.</p>
    </div>
  );
});

DetailsTab = React.memo(({ data, onChange }) => (
  <div className="space-y-6">
    <div>
      <label htmlFor="systemTemplate" className="block text-sm font-medium text-gray-300 mb-1">System Template *</label>
      <select id="systemTemplate" value={data.systemTemplate} onChange={e => onChange('details', 'systemTemplate', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500">
        <option>Default Template</option>
        <option>Fantasy RPG Character</option>
        <option>Sci-Fi Assistant</option>
      </select>
    </div>
    <div>
      <label htmlFor="detailedSettings" className="block text-sm font-medium text-gray-300 mb-1">Character Detailed Settings</label>
      <textarea id="detailedSettings" value={data.detailedSettings} onChange={e => onChange('details', 'detailedSettings', e.target.value)} rows="6" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" maxLength={MAX_LENGTHS.DETAILED_SETTINGS}></textarea>
      <div className="flex justify-between items-center mt-1">
        <button type="button" className="text-xs bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded">Auto</button>
        <p className="text-xs text-gray-400">{data.detailedSettings.length}/{MAX_LENGTHS.DETAILED_SETTINGS}</p>
      </div>
    </div>
  </div>
));

StartSituationTab = React.memo(({ data, onChange, onFileUpload, jsonError, jsonSuccess }) => (
  <div className="space-y-6">
    <div>
      <label htmlFor="initialSituation" className="block text-sm font-medium text-gray-300 mb-1">Initial Situation</label>
      <textarea id="initialSituation" value={data.initialSituation} onChange={e => onChange('startSituation', 'initialSituation', e.target.value)} rows="3" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" maxLength={MAX_LENGTHS.INITIAL_SITUATION}></textarea>
      <p className="text-xs text-gray-400 mt-1 text-right">{data.initialSituation.length}/{MAX_LENGTHS.INITIAL_SITUATION}</p>
    </div>
    <div>
      <label htmlFor="firstLine" className="block text-sm font-medium text-gray-300 mb-1">First Line</label>
      <textarea id="firstLine" value={data.firstLine} onChange={e => onChange('startSituation', 'firstLine', e.target.value)} rows="2" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" maxLength={MAX_LENGTHS.FIRST_LINE}></textarea>
      <p className="text-xs text-gray-400 mt-1 text-right">{data.firstLine.length}/{MAX_LENGTHS.FIRST_LINE}</p>
    </div>
    <div className="pt-4 border-t border-gray-700">
      <label className="block text-sm font-medium text-gray-300 mb-2">Upload Chat History (JSON)</label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md hover:border-pink-500 transition-colors">
        <div className="space-y-1 text-center">
          <Paperclip className="mx-auto text-gray-500" size={ICON_SIZES.CHAT_HISTORY_UPLOAD_ICON} />
          <div className="flex text-sm text-gray-400">
            <label htmlFor="chat-history-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-pink-500 hover:text-pink-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-pink-500">
              <span>Upload a file</span>
              <input id="chat-history-upload" name="chat-history-upload" type="file" className="sr-only" accept=".json" onChange={onFileUpload} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">JSON file, array of {"{role: 'user'/'ai', content: '...'}"}</p>
        </div>
      </div>
      {/* Feedback messages are handled globally in CreateAgent now, but can be shown here too if needed */}
    </div>
  </div>
));

OtherSettingsTab = React.memo(({ data, onChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Character Visibility *</label>
      <div className="flex space-x-2">
        {['Public', 'Private', 'Link-only'].map(v => (
          <button key={v} type="button" onClick={() => onChange('otherSettings', 'visibility', v)} className={`px-4 py-2 rounded text-sm ${data.visibility === v ? 'bg-pink-600 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>{v}</button>
        ))}
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">Hashtags</label>
      <input type="text" value={data.hashtags} onChange={e => onChange('otherSettings', 'hashtags', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" placeholder="e.g. fantasy, adventure (comma separated)" />
      <p className="text-xs text-gray-400 mt-1">Maximum 5, at least 1 required.</p>
    </div>
    <p className="text-xs text-gray-400">More settings like Categories and Safe Filter will be here.</p>
  </div>
));

const LorebookItem = React.memo(({ lorebook, index, onChange, onRemove }) => (
  <div className="p-4 bg-gray-750 rounded-lg border border-gray-700 space-y-3">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-gray-200">Lorebook {index + 1}</h4>
      <div>
        <button type="button" className="text-gray-400 hover:text-white mr-2 p-1"><Edit3 size={ICON_SIZES.LOREBOOK_ACTION_ICON}/></button>
        <button type="button" onClick={() => onRemove(lorebook.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={ICON_SIZES.LOREBOOK_ACTION_ICON}/></button>
      </div>
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">Content *</label>
      <textarea value={lorebook.content} onChange={e => onChange(lorebook.id, 'content', e.target.value)} rows="3" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm" maxLength={MAX_LENGTHS.LOREBOOK_CONTENT}></textarea>
      <p className="text-xs text-gray-500 mt-1 text-right">{lorebook.content.length}/{MAX_LENGTHS.LOREBOOK_CONTENT}</p>
    </div>
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">Keyword (Max 5) *</label>
      <input type="text" value={lorebook.keywords} onChange={e => onChange(lorebook.id, 'keywords', e.target.value)} className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 text-sm" placeholder="Enter keywords, comma separated"/>
    </div>
  </div>
));

LorebookTab = React.memo(({ lorebooks, onLorebookChange, onAddLorebook, onRemoveLorebook }) => (
  <div className="space-y-4">
    <p className="text-sm text-gray-300">When you record word/lore or additional content, characters or users will automatically receive related content when mentioning specific keywords. (Max 30)</p>
    {lorebooks.map((lb, index) => (
      <LorebookItem key={lb.id} lorebook={lb} index={index} onChange={onLorebookChange} onRemove={onRemoveLorebook} />
    ))}
    <button type="button" onClick={onAddLorebook} className="flex items-center justify-center w-full py-2 px-4 border border-dashed border-gray-600 hover:border-pink-500 text-pink-500 rounded-md text-sm">
      <PlusCircle size={16} className="mr-2" /> Add Lorebook
    </button>
  </div>
));

EditAndRegisterTab = React.memo(({ data, onChange }) => ( // Simplified
  <div className="space-y-6">
    <div>
      <label htmlFor="finalDetails" className="block text-sm font-medium text-gray-300 mb-1">Details</label>
      <textarea id="finalDetails" value={data.details} onChange={e => onChange('editAndRegister', 'details', e.target.value)} rows="3" className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:ring-pink-500 focus:border-pink-500" maxLength={MAX_LENGTHS.FINAL_DETAILS}></textarea>
      <p className="text-xs text-gray-400 mt-1 text-right">{data.details.length}/{MAX_LENGTHS.FINAL_DETAILS}</p>
    </div>
    <p className="text-xs text-gray-400">More fields like Date, Location, Height, Weight, Jobs, Interests, Likes, Dislikes will be here.</p>
  </div>
));

const ChatTestPanel = React.memo(({ characterName, firstLine }) => {
  const [testMessages, setTestMessages] = useState([]);
  const [testInput, setTestInput] = useState('');
  const [chatCount, setChatCount] = useState(0);

  const handleTestSend = useCallback(() => {
    if (!testInput.trim() || chatCount >= MAX_TEST_CHATS) return;
    setTestMessages(prev => [...prev, { sender: 'user', text: testInput }]);
    setTimeout(() => {
      setTestMessages(prev => [...prev, { sender: 'ai', text: `Mock response to: "${testInput}"` }]);
    }, 500); // Readability: Naming Magic Numbers (could be CHAT_RESPONSE_DELAY_MS)
    setTestInput('');
    setChatCount(prev => prev + 1);
  }, [testInput, chatCount]);
  
  // Readability: Naming Complex Conditions
  const isChatDisabled = !characterName || !firstLine || chatCount >= MAX_TEST_CHATS;
  const inputPlaceholder = (() => { // Readability: Simplifying Complex Ternary Operators (IIFE)
    if (!characterName || !firstLine) return "Please fill in Profile and Start Situation first.";
    if (chatCount >= MAX_TEST_CHATS) return "Max test chats reached.";
    return `Chat with ${characterName}...`;
  })();

  return (
    <aside className="w-1/3 min-w-[350px] max-w-[450px] bg-gray-850 border-l border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat Test</h2>
        <p className="text-xs text-gray-400">Try chatting with the AI character. (Up to {MAX_TEST_CHATS} times possible)</p>
        <p className="text-xs text-gray-400 text-right">{chatCount}/{MAX_TEST_CHATS}</p>
      </div>
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {firstLine && (
          <div className="flex items-start space-x-2 mb-3">
            <div className={`${CHAT_TEST_AVATAR_SIZE_CLASS} rounded-full bg-pink-700 flex-shrink-0 items-center justify-center flex text-white font-bold`}>
              {characterName ? characterName.substring(0,1).toUpperCase() : 'AI'}
            </div>
            <div>
              <p className="text-sm font-medium">{characterName || "Character Name"}</p>
              <p className="text-xs text-gray-300 bg-gray-700 p-2 rounded-lg mt-1 inline-block">
                {firstLine || "First line will appear here..."}
              </p>
            </div>
          </div>
        )}
        {testMessages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-2 mb-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && (
              <div className={`${CHAT_TEST_AVATAR_SIZE_CLASS} rounded-full bg-pink-700 flex-shrink-0 items-center justify-center flex text-white font-bold`}>
                {characterName ? characterName.substring(0,1).toUpperCase() : 'AI'}
              </div>
            )}
            <div className={`${msg.sender === 'user' ? 'order-2' : ''}`}>
              <p className="text-sm font-medium">{msg.sender === 'user' ? "You" : (characterName || "Character Name")}</p>
              <p className={`text-xs text-gray-300 p-2 rounded-lg mt-1 inline-block ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                {msg.text}
              </p>
            </div>
             {msg.sender === 'user' && (
              <div className={`${CHAT_TEST_AVATAR_SIZE_CLASS} rounded-full bg-blue-600 flex-shrink-0 items-center justify-center flex text-white font-bold order-1`}>U</div>
            )}
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center p-2 bg-gray-700 rounded">
          <input type="text" placeholder={inputPlaceholder} value={testInput} onChange={(e) => setTestInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleTestSend()} className="flex-1 bg-transparent text-sm focus:outline-none placeholder-gray-500" disabled={isChatDisabled} />
          <button className="text-gray-400 hover:text-white p-1"><Settings2 size={ICON_SIZES.CHAT_TEST_SETTINGS_ICON}/></button>
          <button onClick={handleTestSend} disabled={isChatDisabled || !testInput.trim()} className="text-gray-400 hover:text-white p-1 disabled:opacity-50"><ChevronRight size={ICON_SIZES.CHAT_TEST_SEND_ICON}/></button>
        </div>
      </div>
    </aside>
  );
});

// --- Main CreateAgent Component ---
const CreateAgent = () => {
  const [activeTabId, setActiveTabId] = useState(TABS_CONFIG[0].id);
  const [characterData, setCharacterData] = useState(INITIAL_CHARACTER_DATA);
  const [feedback, setFeedback] = useState({ type: '', message: '' }); // type: 'error' | 'success'

  const clearFeedback = useCallback(() => setFeedback({ type: '', message: '' }), []);

  const handleInputChange = useCallback((tab, field, value) => {
    setCharacterData(prev => ({ ...prev, [tab]: { ...prev[tab], [field]: value } }));
    clearFeedback();
  }, [clearFeedback]);
  
  const handleLorebookChange = useCallback((id, field, value) => {
    setCharacterData(prev => ({ ...prev, lorebooks: prev.lorebooks.map(lb => lb.id === id ? { ...lb, [field]: value } : lb) }));
    clearFeedback();
  }, [clearFeedback]);

  const addLorebook = useCallback(() => {
    setCharacterData(prev => ({ ...prev, lorebooks: [...prev.lorebooks, { id: Date.now(), content: '', keywords: '' }] }));
    clearFeedback();
  }, [clearFeedback]);

  const removeLorebook = useCallback((id) => {
    setCharacterData(prev => ({ ...prev, lorebooks: prev.lorebooks.filter(lb => lb.id !== id) }));
    clearFeedback();
  }, [clearFeedback]);

  const handleChatHistoryUpload = useCallback((event) => {
    clearFeedback();
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
      setFeedback({ type: 'error', message: "Please upload a valid JSON file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);
        const isValidChatHistory = Array.isArray(content) && content.every(item => typeof item.role === 'string' && typeof item.content === 'string');
        
        if (isValidChatHistory) {
          handleInputChange('startSituation', 'uploadedChatHistory', content);
          handleInputChange('startSituation', 'chatHistoryFileName', file.name);
          setFeedback({ type: 'success', message: `Successfully parsed ${file.name}. ${content.length} messages loaded.`});
        } else {
          throw new Error("Invalid JSON structure. Expected an array of objects with 'role' and 'content' string properties.");
        }
      } catch (err) {
        setFeedback({ type: 'error', message: `Error parsing JSON file: ${err.message}`});
        handleInputChange('startSituation', 'uploadedChatHistory', null);
        handleInputChange('startSituation', 'chatHistoryFileName', '');
      }
    };
    reader.onerror = () => {
        setFeedback({ type: 'error', message: "Failed to read the file."});
    }
    reader.readAsText(file);
  }, [handleInputChange, clearFeedback]);

  const activeTabIndex = TABS_CONFIG.findIndex(tab => tab.id === activeTabId);
  const ActiveTabComponent = TABS_CONFIG[activeTabIndex]?.component;

  const navigateTab = useCallback((direction) => {
    const newIndex = activeTabIndex + direction;
    if (newIndex >= 0 && newIndex < TABS_CONFIG.length) {
      setActiveTabId(TABS_CONFIG[newIndex].id);
      clearFeedback();
    }
  }, [activeTabIndex, clearFeedback]);

  const handleSaveDraft = useCallback(() => {
    console.log("Saving Draft:", characterData);
    setFeedback({ type: 'success', message: "Draft saved to console (mock)." });
  }, [characterData]);

  const handleFinish = useCallback(() => {
    console.log("Final Character Data:", characterData);
    setFeedback({ type: 'success', message: "Character creation finished! Data logged to console (mock)." });
  }, [characterData]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Character Creation</h1>
          <button onClick={handleSaveDraft} className="text-sm flex items-center bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded">
            <Save size={ICON_SIZES.BUTTON_ICON} className="mr-2" /> Save Draft
          </button>
        </header>

        <nav className="flex border-b border-gray-700 overflow-x-auto">
          {TABS_CONFIG.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTabId(tab.id); clearFeedback(); }}
              className={`flex items-center px-3 py-3 text-sm font-medium focus:outline-none whitespace-nowrap ${activeTabId === tab.id ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>
              <tab.icon size={ICON_SIZES.TAB_ICON} className="mr-2" /> {tab.name}
            </button>
          ))}
        </nav>

        <main className="flex-1 p-6 overflow-y-auto bg-gray-800">
          {feedback.message && (
            <div className={`mb-4 p-3 rounded-md text-xs flex items-start border ${feedback.type === 'error' ? 'bg-red-800/30 border-red-700 text-red-300' : 'bg-green-800/30 border-green-700 text-green-300'}`}>
              {feedback.type === 'error' ? <AlertCircle size={ICON_SIZES.FEEDBACK_ICON} className="mr-2 flex-shrink-0"/> : <CheckCircle size={ICON_SIZES.FEEDBACK_ICON} className="mr-2 flex-shrink-0"/>}
              {feedback.message}
            </div>
          )}
          {ActiveTabComponent && (
            <ActiveTabComponent
              data={characterData[activeTabId]}
              characterData={characterData} // For potential cross-tab data access
              onChange={handleInputChange}
              // Specific handlers for complex tabs
              onFileUpload={handleChatHistoryUpload}
              lorebooks={characterData.lorebooks}
              onLorebookChange={handleLorebookChange}
              onAddLorebook={addLorebook}
              onRemoveLorebook={removeLorebook}
              // Pass feedback for specific tab display if needed, though global is primary
              jsonError={feedback.type === 'error' && activeTabId === 'startSituation' ? feedback.message : ''} 
              jsonSuccess={feedback.type === 'success' && activeTabId === 'startSituation' ? feedback.message : ''}
            />
          )}
        </main>
        
        <footer className="p-4 border-t border-gray-700 bg-gray-850 flex justify-between items-center">
          <button onClick={() => navigateTab(-1)} disabled={activeTabIndex === 0} className="flex items-center bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded text-sm disabled:opacity-50">
            <ChevronLeft size={18} className="mr-1" /> Previous
          </button>
          {activeTabIndex < TABS_CONFIG.length - 1 ? (
            <button onClick={() => navigateTab(1)} className="flex items-center bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded text-sm">
              Next step <ChevronRight size={18} className="ml-1" />
            </button>
          ) : (
            <button onClick={handleFinish} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm">Finish</button>
          )}
        </footer>
      </div>
      <ChatTestPanel characterName={characterData.profile.name} firstLine={characterData.startSituation.firstLine} />
    </div>
  );
};

export default CreateAgent;
