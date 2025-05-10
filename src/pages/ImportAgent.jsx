import React, { useState } from 'react';
import { UploadCloud, BrainCircuit, FileJson, CheckCircle, AlertTriangle } from 'lucide-react';

const ImportAgent = () => {
  const [agentJson, setAgentJson] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/json") {
        setFileName(file.name);
        setError('');
        setSuccessMessage('');
        setAgentJson(null);

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const parsedJson = JSON.parse(e.target.result);
            // Basic validation (can be expanded)
            if (parsedJson.id && parsedJson.title && parsedJson.personaPrompt) {
              setAgentJson(parsedJson);
              setSuccessMessage(`Successfully parsed '${file.name}'. Review details below.`);
            } else {
              setError('Invalid JSON structure. Missing required fields like id, title, or personaPrompt.');
              setAgentJson(null);
            }
          } catch (err) {
            setError(`Error parsing JSON file: ${err.message}`);
            setAgentJson(null);
          }
        };
        reader.readAsText(file);
      } else {
        setError('Invalid file type. Please upload a .json file.');
        setFileName('');
        setAgentJson(null);
        setSuccessMessage('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (agentJson) {
      console.log("AI Agent Configuration for Minting:", agentJson);
      // Placeholder for actual submission/minting logic
      alert('AI Agent configuration submitted to console. See logs for details. (Minting process placeholder)');
      setSuccessMessage('Agent configuration ready for minting (simulated). Check console.');
    } else {
      setError('No valid AI Agent configuration loaded to submit.');
    }
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="flex items-center mb-8">
        <UploadCloud size={36} className="text-blue-600 mr-3" />
        <h1 className="text-4xl font-bold text-gray-800">Import AI Agent Configuration</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl space-y-6">
        <div>
          <label htmlFor="agentFile" className="block text-lg font-medium text-gray-700 mb-2">Upload AI Agent JSON File</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FileJson className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="agentFile"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Upload a file</span>
                  <input id="agentFile" name="agentFile" type="file" className="sr-only" accept=".json" onChange={handleFileChange} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">JSON up to 10MB</p>
            </div>
          </div>
          {fileName && !error && <p className="mt-2 text-sm text-green-600 flex items-center"><CheckCircle size={16} className="mr-1"/> Selected file: {fileName}</p>}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          </div>
        )}
        {successMessage && !error && (
           <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-sm font-medium text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {agentJson && !error && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Preview Imported Agent Data:</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
              <dl className="space-y-2">
                <div><dt className="font-medium text-gray-600">Title:</dt><dd className="text-gray-800 pl-2">{agentJson.title}</dd></div>
                <div><dt className="font-medium text-gray-600">ID:</dt><dd className="text-gray-800 pl-2">{agentJson.id}</dd></div>
                <div><dt className="font-medium text-gray-600">Description:</dt><dd className="text-gray-800 pl-2 text-sm">{agentJson.description}</dd></div>
                <div><dt className="font-medium text-gray-600">Persona Prompt:</dt><dd className="text-gray-800 pl-2 text-sm italic">"{agentJson.personaPrompt}"</dd></div>
                {agentJson.tags && <div><dt className="font-medium text-gray-600">Tags:</dt><dd className="text-gray-800 pl-2">{agentJson.tags.join(', ')}</dd></div>}
                {agentJson.priceSOL && <div><dt className="font-medium text-gray-600">Price (SOL):</dt><dd className="text-gray-800 pl-2">{agentJson.priceSOL}</dd></div>}
                {agentJson.assets && <div><dt className="font-medium text-gray-600">Assets:</dt><dd className="text-gray-800 pl-2 text-sm">{agentJson.assets.length} asset(s) defined.</dd></div>}
              </dl>
            </div>
          </div>
        )}

        <div className="pt-4">
          <button 
            type="submit"
            disabled={!agentJson || !!error}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BrainCircuit size={20} className="mr-2" />
            Validate & Prepare for Minting
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImportAgent;
