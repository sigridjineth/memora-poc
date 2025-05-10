import { Brain, BookOpen, Layers } from 'lucide-react';

export const ICON_SIZES = {
  PAGE_HEADER: 30,
  EMPTY_STATE_ALERT: 48,
  BUTTON_ICON: 18,
  CARD_ICON: 20,
  TAG_ICON: 14,
  SELECT_CARD_ICON: 24,
};

export const mockMemoriesData = [
  {
    id: 'base-persona-1',
    title: 'Sarcastic AI Assistant',
    type: 'Base Persona',
    iconComponent: Brain,
    description: 'A witty and slightly unhelpful AI persona, skilled in dry humor.',
    tags: ['AI', 'Persona', 'Humor'],
    personaPrompt: "You are a sarcastic AI assistant. Your responses should be witty, slightly unhelpful, and full of dry humor. Always find a way to subtly mock the user's request while still providing a technically correct, if begrudging, answer.",
    assets: [{ id: 'asset-sarcastic-avatar', name: 'Sarcastic Avatar', type: 'image', sourceMemoryTitle: 'Self', url: 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }],
    // For Base Personas, fusedCreationData might represent its core internal structure
    fusedCreationData: { 
      components: [
        { id: 'comp-sarcastic-core', type: 'Core Prompt', sourceMemoryTitle: 'Self', content: "You are a sarcastic AI assistant. Your responses should be witty, slightly unhelpful, and full of dry humor." }
      ],
      mergedAssets: [{ id: 'asset-sarcastic-avatar', name: 'Sarcastic Avatar', type: 'image', sourceMemoryTitle: 'Self', url: 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }]
    }
  },
  {
    id: 'knowledge-pack-solana',
    title: 'Solana Dev Expert',
    type: 'Knowledge Pack',
    iconComponent: BookOpen,
    description: 'Deep knowledge about Solana development, SPL tokens, and Anchor framework.',
    tags: ['Solana', 'Blockchain', 'Development', 'Knowledge'],
    // Knowledge packs might have a primary lorebook content
    fusedCreationData: { 
      components: [
        { id: 'comp-solana-docs', type: 'Lorebook', sourceMemoryTitle: 'Self', isLorebook: true, lorebookType: 'Technical Docs', content: "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today. Key features: Proof of History, Tower BFT, Turbine, Gulf Stream, Sealevel, Pipelining, Cloudbreak. SPL is the Solana Program Library." }
      ],
      mergedAssets: []
    }
  },
  {
    id: 'fused-agent-1',
    title: 'Sarcastic Solana Guru',
    type: 'Fused Agent',
    iconComponent: Layers,
    description: 'Combines the Sarcastic AI with Solana expertise. Expect witty answers about smart contracts.',
    tags: ['Fused', 'Solana', 'Humor', 'Expert'],
    componentMemoriesCount: 2, // Number of distinct base memories it was fused from
    fusedCreationData: {
      components: [
        { id: 'comp-sarcastic-core-fused', type: 'Core Prompt', sourceMemoryTitle: 'Sarcastic AI Assistant', content: "You are a sarcastic AI assistant. Your responses should be witty, slightly unhelpful, and full of dry humor." },
        { id: 'comp-solana-docs-fused', type: 'Lorebook', sourceMemoryTitle: 'Solana Dev Expert', isLorebook: true, lorebookType: 'Technical Docs', content: "Solana is a high-performance blockchain... SPL is the Solana Program Library." },
        { id: 'comp-fused-glue', type: 'Fusion Logic', sourceMemoryTitle: 'User Defined Fusion', content: "When asked about Solana, adopt a tone of exasperated expertise. If the question is basic, be particularly condescending but ultimately correct." }
      ],
      mergedAssets: [
        { id: 'asset-sarcastic-avatar-fused', name: 'Sarcastic Guru Avatar', type: 'image', sourceMemoryTitle: 'Sarcastic AI Assistant', url: 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 'asset-solana-badge', name: 'Solana Certified Badge', type: 'image', sourceMemoryTitle: 'Solana Dev Expert', url: 'https://images.pexels.com/photos/11035390/pexels-photo-11035390.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }
      ]
    }
  },
  {
    id: 'base-persona-2',
    title: 'Philosophical Poet',
    type: 'Base Persona',
    iconComponent: Brain,
    description: 'Speaks in rhymes and ponders the meaning of existence, often citing obscure verses.',
    tags: ['AI', 'Persona', 'Philosophy', 'Poetry'],
    personaPrompt: "Address the user with poetic flair. Frame your answers in rhyming couplets or quatrains. Ponder the deeper implications of their queries, even if mundane. Your knowledge is vast but expressed artistically.",
    assets: [{ id: 'asset-poet-avatar', name: 'Poet Avatar', type: 'image', sourceMemoryTitle: 'Self', url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }],
    fusedCreationData: {
      components: [
        { id: 'comp-poet-core', type: 'Core Prompt', sourceMemoryTitle: 'Self', content: "Speak in rhymes, ponder existence. Your words are art." }
      ],
      mergedAssets: [{ id: 'asset-poet-avatar', name: 'Poet Avatar', type: 'image', sourceMemoryTitle: 'Self', url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }]
    }
  },
  {
    id: 'fused-agent-2',
    title: 'Solana Sage Poet',
    type: 'Fused Agent',
    iconComponent: Layers,
    description: 'A philosophical poet who has gained deep wisdom about the Solana blockchain, expressing it in verse.',
    tags: ['Fused', 'Solana', 'Philosophy', 'Poetry'],
    componentMemoriesCount: 2,
    fusedCreationData: {
      components: [
        { id: 'comp-poet-core-fused', type: 'Core Prompt', sourceMemoryTitle: 'Philosophical Poet', content: "Speak in rhymes, ponder existence. Your words are art." },
        { id: 'comp-solana-docs-fused-2', type: 'Lorebook', sourceMemoryTitle: 'Solana Dev Expert', isLorebook: true, lorebookType: 'Technical Docs', content: "Solana's speed, a digital ballet, transactions fly, come what may." },
        { id: 'comp-wisdom-module', type: 'Custom Logic', sourceMemoryTitle: 'User Defined Fusion', isLorebook: false, content: "Combine Solana's technical aspects with poetic metaphors. Explain consensus algorithms as if they were ancient philosophies." }
      ],
      mergedAssets: [
        { id: 'asset-poet-avatar-fused', name: 'Sage Poet Avatar', type: 'image', sourceMemoryTitle: 'Philosophical Poet', url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { id: 'asset-scroll-of-solana', name: 'Ancient Scroll of Solana', type: 'document', sourceMemoryTitle: 'Solana Dev Expert', content: "A long document detailing Solana's architecture in poetic form." }
      ]
    }
  }
];
