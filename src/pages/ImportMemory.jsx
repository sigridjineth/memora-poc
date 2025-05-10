import React, { useState, useRef, useCallback } from 'react';
import { Brain, MessageSquareText, Image as ImageIcon, Video, FileText as FileTextIcon, Link as LinkIcon, Tag, PlusCircle, Trash2, AlertCircle, CheckCircle, Edit3, Save, UploadCloud } from 'lucide-react';

// --- Constants (Readability: Naming Magic Numbers & Cohesion: Relating Magic Numbers to Logic) ---
const ICON_SIZES = {
  SECTION_HEADER: 24, UPLOAD_BUTTON: 18, ADD_BUTTON: 18, REMOVE_BUTTON: 18,
  ASSET_TYPE_ICON: 18, SUBMIT_BUTTON: 20, FEEDBACK_ICON: 20,
};

const INITIAL_DIALOGUE_PAIR_FACTORY = () => ({ id: Date.now() + Math.random(), role: 'ai', content: '' });
const INITIAL_ASSET_FACTORY = () => ({ id: Date.now() + Math.random(), type: 'image', url: '', caption: '' });

const ASSET_TYPES_CONFIG = [
  { value: 'image', label: 'Image', icon: ImageIcon }, { value: 'video', label: 'Video', icon: Video },
  { value: 'document', label: 'Document', icon: FileTextIcon }, { value: 'link', label: 'Link', icon: LinkIcon },
];

const INITIAL_MEMORY_DATA = {
  title: '', description: '', personaPrompt: '',
  initialDialogues: [INITIAL_DIALOGUE_PAIR_FACTORY(), { ...INITIAL_DIALOGUE_PAIR_FACTORY(), role: 'user' }],
  assets: [INITIAL_ASSET_FACTORY()], tags: '',
};

// --- Helper Functions ---
const ensureIdForListItem = (item) => ({ ...item, id: item.id || Date.now() + Math.random() });

const AssetTypeIcon = React.memo(({ typeValue }) => {
  const assetTypeConf = ASSET_TYPES_CONFIG.find(t => t.value === typeValue);
  const IconComponent = assetTypeConf ? assetTypeConf.icon : FileTextIcon;
  return <IconComponent className="mr-2 text-gray-400" size={ICON_SIZES.ASSET_TYPE_ICON}/>;
});

const FormSection = React.memo(({ title, icon: Icon, children }) => (
  <section className="space-y-6 p-6 bg-gray-850 rounded-lg border border-gray-700">
    <h2 className="text-2xl font-semibold text-gray-100 border-b border-gray-700 pb-3 mb-6 flex items-center">
      <Icon size={ICON_SIZES.SECTION_HEADER} className="mr-3 text-sky-400"/> {title}
    </h2>
    {children}
  </section>
));

// --- Main Component ---
const ImportMemory = () => {
  const [memoryData, setMemoryData] = useState(INITIAL_MEMORY_DATA);
  const [feedback, setFeedback] = useState({ type: '', message: '' }); // type: 'error' | 'success'
  const fileInputRef = useRef(null);

  const clearFeedback = useCallback(() => setFeedback({ type: '', message: '' }), []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setMemoryData(prev => ({ ...prev, [name]: value }));
    clearFeedback();
  }, [clearFeedback]);

  const handleDynamicListChange = useCallback((listName, id, field, value) => {
    setMemoryData(prev => ({
      ...prev,
      [listName]: prev[listName].map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
    clearFeedback();
  }, [clearFeedback]);

  const addDynamicListItem = useCallback((listName, itemFactory) => {
    setMemoryData(prev => ({ ...prev, [listName]: [...prev[listName], itemFactory()] }));
  }, []);

  const removeDynamicListItem = useCallback((listName, id) => {
    setMemoryData(prev => ({ ...prev, [listName]: prev[listName].filter(item => item.id !== id) }));
  }, []);

  const handleFileImportClick = useCallback(() => fileInputRef.current?.click(), []);

  const processImportedJson = useCallback((jsonContent) => {
    // Predictability: Standardizing Return Types (throws error on failure)
    if (typeof jsonContent !== 'object' || jsonContent === null) {
      throw new Error("Invalid JSON structure: Expected an object.");
    }
    const imported = {
      title: jsonContent.title || '', description: jsonContent.description || '',
      personaPrompt: jsonContent.personaPrompt || '',
      initialDialogues: (jsonContent.chatHistoryPreview || jsonContent.initialDialogues || []).map(d => ensureIdForListItem({ role: d.role, content: d.content })),
      assets: (jsonContent.assets || []).map(a => ensureIdForListItem({ type: a.type, url: a.url, caption: a.caption })),
      tags: Array.isArray(jsonContent.tags) ? jsonContent.tags.join(', ') : (jsonContent.tags || ''),
    };
    if (imported.initialDialogues.length === 0) imported.initialDialogues.push(INITIAL_DIALOGUE_PAIR_FACTORY());
    if (imported.assets.length === 0) imported.assets.push(INITIAL_ASSET_FACTORY());
    return imported;
  }, []);

  const handleFileChange = useCallback((event) => {
    clearFeedback();
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedJson = JSON.parse(e.target?.result);
        const processedData = processImportedJson(parsedJson);
        setMemoryData(processedData);
        setFeedback({ type: 'success', message: "Memory data imported successfully. Review and save."});
      } catch (err) {
        setFeedback({ type: 'error', message: `Failed to import JSON: ${err.message}`});
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ""; // Allow re-upload
      }
    };
    reader.onerror = () => setFeedback({ type: 'error', message: "Failed to read the file."});
    reader.readAsText(file);
  }, [clearFeedback, processImportedJson]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    clearFeedback();

    const isTitleMissing = !memoryData.title.trim();
    const isPersonaPromptMissing = !memoryData.personaPrompt.trim();

    if (isTitleMissing || isPersonaPromptMissing) {
      const missingFields = [isTitleMissing && "Title", isPersonaPromptMissing && "Persona Prompt"].filter(Boolean).join(" and ");
      setFeedback({ type: 'error', message: `Required fields are missing: ${missingFields}.`});
      return;
    }

    const packagedData = {
      ...memoryData,
      tags: memoryData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      chatHistoryPreview: memoryData.initialDialogues.map(({role, content}) => ({role, content})),
    };
    // delete packagedData.initialDialogues; // If backend doesn't need it

    console.log("Creating/Packaging AI Agent Memory:", packagedData);
    setFeedback({ type: 'success', message: `Memory "${packagedData.title}" configured! (Data logged)`});
    // setMemoryData(INITIAL_MEMORY_DATA); // Optionally reset form
  }, [memoryData, clearFeedback]);

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-500 mb-4">
          Configure AI Agent Memory
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
          Create new memory or import from JSON. Define its persona, initial interactions, and assets.
        </p>
      </header>

      <div className="max-w-3xl mx-auto mb-6">
        <button type="button" onClick={handleFileImportClick}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-dashed border-sky-600 hover:border-sky-500 text-sky-400 rounded-md text-sm transition-colors bg-sky-900/30 hover:bg-sky-900/40">
          <UploadCloud size={ICON_SIZES.UPLOAD_BUTTON} className="mr-2" /> Import Memory from JSON File
        </button>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl space-y-10">
        {feedback.message && (
          <div className={`p-4 rounded-md flex items-start text-sm border ${feedback.type === 'error' ? 'bg-red-900/30 border-red-700 text-red-300' : 'bg-green-900/30 border-green-700 text-green-300'}`}>
            {feedback.type === 'error' ? <AlertCircle size={ICON_SIZES.FEEDBACK_ICON} className="mr-3 mt-0.5 flex-shrink-0"/> : <CheckCircle size={ICON_SIZES.FEEDBACK_ICON} className="mr-3 mt-0.5 flex-shrink-0"/>}
            {feedback.message}
          </div>
        )}

        <FormSection title="Basic Information" icon={Edit3}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Memory Title *</label>
            <input type="text" name="title" id="title" value={memoryData.title} onChange={handleInputChange} required className="w-full bg-gray-700 text-white p-2.5 rounded border border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea name="description" id="description" value={memoryData.description} onChange={handleInputChange} rows="3" className="w-full bg-gray-700 text-white p-2.5 rounded border border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"></textarea>
          </div>
        </FormSection>

        <FormSection title="Persona Definition" icon={Brain}>
          <div>
            <label htmlFor="personaPrompt" className="block text-sm font-medium text-gray-300 mb-1">Persona Prompt / System Message *</label>
            <textarea name="personaPrompt" id="personaPrompt" value={memoryData.personaPrompt} onChange={handleInputChange} rows="5" required className="w-full bg-gray-700 text-white p-2.5 rounded border border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., You are a helpful assistant..."></textarea>
          </div>
        </FormSection>

        <FormSection title="Initial Dialogue Snippets" icon={MessageSquareText}>
          {memoryData.initialDialogues.map((dialogue) => (
            <div key={dialogue.id} className="p-4 bg-gray-700 rounded-md space-y-3 border border-gray-600">
              <div className="flex items-center justify-between">
                <select name="role" value={dialogue.role} onChange={(e) => handleDynamicListChange('initialDialogues', dialogue.id, 'role', e.target.value)} className="bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm focus:ring-sky-500 focus:border-sky-500">
                  <option value="ai">AI</option> <option value="user">User</option>
                </select>
                {memoryData.initialDialogues.length > 1 && <button type="button" onClick={() => removeDynamicListItem('initialDialogues', dialogue.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={ICON_SIZES.REMOVE_BUTTON} /></button>}
              </div>
              <textarea value={dialogue.content} onChange={(e) => handleDynamicListChange('initialDialogues', dialogue.id, 'content', e.target.value)} rows="2" placeholder={`Enter ${dialogue.role}'s message...`} className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm focus:ring-sky-500 focus:border-sky-500"></textarea>
            </div>
          ))}
          <button type="button" onClick={() => addDynamicListItem('initialDialogues', INITIAL_DIALOGUE_PAIR_FACTORY)} className="w-full flex items-center justify-center py-2.5 px-4 border border-dashed border-gray-600 hover:border-sky-500 text-sky-400 rounded-md text-sm transition-colors">
            <PlusCircle size={ICON_SIZES.ADD_BUTTON} className="mr-2" /> Add Dialogue Snippet
          </button>
        </FormSection>

        <FormSection title="Associated Assets" icon={ImageIcon}>
          {memoryData.assets.map((asset) => (
            <div key={asset.id} className="p-4 bg-gray-700 rounded-md space-y-3 border border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AssetTypeIcon typeValue={asset.type} />
                  <select name="type" value={asset.type} onChange={(e) => handleDynamicListChange('assets', asset.id, 'type', e.target.value)} className="bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm focus:ring-sky-500 focus:border-sky-500">
                    {ASSET_TYPES_CONFIG.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                {memoryData.assets.length > 1 && <button type="button" onClick={() => removeDynamicListItem('assets', asset.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 size={ICON_SIZES.REMOVE_BUTTON} /></button>}
              </div>
              <input type="url" placeholder="Asset URL (e.g., https://example.com/image.png)" value={asset.url} onChange={(e) => handleDynamicListChange('assets', asset.id, 'url', e.target.value)} className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm focus:ring-sky-500 focus:border-sky-500" />
              <input type="text" placeholder="Caption (optional)" value={asset.caption} onChange={(e) => handleDynamicListChange('assets', asset.id, 'caption', e.target.value)} className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 text-sm focus:ring-sky-500 focus:border-sky-500" />
            </div>
          ))}
          <button type="button" onClick={() => addDynamicListItem('assets', INITIAL_ASSET_FACTORY)} className="w-full flex items-center justify-center py-2.5 px-4 border border-dashed border-gray-600 hover:border-sky-500 text-sky-400 rounded-md text-sm transition-colors">
            <PlusCircle size={ICON_SIZES.ADD_BUTTON} className="mr-2" /> Add Asset
          </button>
        </FormSection>

        <FormSection title="Categorization" icon={Tag}>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">Tags</label>
            <input type="text" name="tags" id="tags" value={memoryData.tags} onChange={handleInputChange} className="w-full bg-gray-700 text-white p-2.5 rounded border border-gray-600 focus:ring-2 focus:ring-sky-500 focus:border-sky-500" placeholder="e.g., sci-fi, assistant (comma-separated)" />
          </div>
        </FormSection>

        <button type="submit" className="w-full flex items-center justify-center px-6 py-3.5 font-semibold rounded-lg text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 disabled:opacity-60 group">
          <Save size={ICON_SIZES.SUBMIT_BUTTON} className="mr-2 transform transition-transform group-hover:-translate-y-0.5" />
          Create and Package Memory
        </button>
      </form>
    </div>
  );
};

export default ImportMemory;
