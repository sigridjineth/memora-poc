import React, { useState } from 'react';
import { UploadCloud, MessageCircle, BrainCircuit, MessageSquarePlus } from 'lucide-react';

const CreateMemory = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [persona, setPersona] = useState('');
  const [chatHistory, setChatHistory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for submission logic
    console.log({ title, description, persona, chatHistory, tags });
    alert('Memory submitted for processing and minting (placeholder)!');
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex items-center mb-8">
        <MessageSquarePlus size={36} className="text-blue-600 mr-3" />
        <h1 className="text-4xl font-bold text-gray-800">Create New AI Memory</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Memory Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="e.g., Expert Solana Developer Persona"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="A brief summary of what this memory contains."
            required
          ></textarea>
        </div>

        <div>
          <label htmlFor="persona" className="block text-sm font-medium text-gray-700 mb-1">Persona Definition</label>
          <textarea
            id="persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Describe the AI's persona, characteristics, and style. (e.g., 'A helpful and patient Solana expert...')"
          ></textarea>
        </div>

        <div>
          <label htmlFor="chatHistory" className="block text-sm font-medium text-gray-700 mb-1">Chat History / Knowledge Base (Optional)</label>
          <textarea
            id="chatHistory"
            value={chatHistory}
            onChange={(e) => setChatHistory(e.target.value)}
            rows="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="Paste relevant chat logs, documents, or knowledge snippets. This will be processed into the memory."
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            placeholder="e.g., solana, developer, expert, rust"
          />
        </div>

        <div className="pt-4">
          <button 
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 shadow-md hover:shadow-lg"
          >
            <BrainCircuit size={20} className="mr-2" />
            Process & Prepare for Minting
          </button>
        </div>
      </form>
      
      <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg text-center bg-slate-50">
        <UploadCloud size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">
          Alternatively, you can upload documents (e.g., .txt, .md, .pdf) to create a memory.
        </p>
        <button className="mt-4 px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors duration-150 shadow-sm hover:shadow-md">
          Upload Documents (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default CreateMemory;
