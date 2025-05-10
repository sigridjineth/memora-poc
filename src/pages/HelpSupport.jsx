import React, { useState } from 'react';
import { HelpCircle, MessageSquare, BookOpen, Search, ChevronDown, ChevronUp } from 'lucide-react';

const faqsData = [
  {
    id: 1,
    question: "What is Memora Protocol?",
    answer: "Memora Protocol is a platform that allows users to package AI-generated memories into RAG-optimized NFTs on the Solana blockchain. This enables ownership, monetization, and composability of AI knowledge."
  },
  {
    id: 2,
    question: "How do I create an Agent?",
    answer: "You can create an Agent by selecting one or more of your existing Memories from 'My Collection' and fusing them. Navigate to 'My Collection', click 'Create / Fuse Agent', select your memories, and then configure your new Agent's details."
  },
  {
    id: 3,
    question: "What does 'fusing' memories mean?",
    answer: "Fusing memories combines the knowledge and assets from multiple individual Memory NFTs into a new, more comprehensive Agent NFT. You can provide instructions on how these memories should interact or be prioritized."
  },
  {
    id: 4,
    question: "How can I mint my Fused Agent as an NFT?",
    answer: "After configuring and testing your Fused Agent, you will be guided to a minting page where you can package it as an NFT on the Solana blockchain."
  },
  {
    id: 5,
    question: "Where is my data stored?",
    answer: "The core data for your Memories and Agents (like Parquet files and metadata) is typically stored on decentralized storage solutions like IPFS or Arweave, with the NFT on Solana acting as a proof of ownership and access key."
  }
];

const AccordionItem = ({ faq, isOpen, toggleOpen }) => (
  <div className="border-b border-gray-700">
    <button
      onClick={toggleOpen}
      className="w-full flex justify-between items-center py-4 px-2 text-left text-gray-200 hover:bg-gray-700 focus:outline-none"
    >
      <span className="font-medium">{faq.question}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    {isOpen && (
      <div className="p-4 pt-0 text-gray-400 bg-gray-800">
        <p>{faq.answer}</p>
      </div>
    )}
  </div>
);

const HelpSupport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const filteredFaqs = faqsData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-purple-400 text-center">Help & Support</h1>

      <div className="max-w-3xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8 relative">
          <input
            type="text"
            placeholder="Search FAQs or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
          />
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Quick Links/Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow cursor-pointer">
            <HelpCircle size={32} className="text-purple-400 mb-3" />
            <h2 className="text-xl font-semibold text-gray-100 mb-1">FAQs</h2>
            <p className="text-gray-400 text-sm">Find answers to common questions.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow cursor-pointer">
            <BookOpen size={32} className="text-purple-400 mb-3" />
            <h2 className="text-xl font-semibold text-gray-100 mb-1">Guides</h2>
            <p className="text-gray-400 text-sm">Step-by-step tutorials.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-shadow cursor-pointer">
            <MessageSquare size={32} className="text-purple-400 mb-3" />
            <h2 className="text-xl font-semibold text-gray-100 mb-1">Contact Us</h2>
            <p className="text-gray-400 text-sm">Get in touch with support.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-6">Frequently Asked Questions</h2>
          {filteredFaqs.length > 0 ? (
            <div className="space-y-1">
              {filteredFaqs.map(faq => (
                <AccordionItem 
                  key={faq.id} 
                  faq={faq}
                  isOpen={openFAQ === faq.id}
                  toggleOpen={() => toggleFAQ(faq.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No FAQs found matching your search term.</p>
          )}
        </div>

        {/* Contact Support Section */}
        <div className="mt-10 bg-gray-800 shadow-xl rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Still Need Help?</h2>
          <p className="text-gray-400 mb-6">If you can't find what you're looking for in the FAQs, feel free to reach out to our support team.</p>
          <button className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center">
            <MessageSquare size={20} className="mr-2" /> Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
