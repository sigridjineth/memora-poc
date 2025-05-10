import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Package, GripVertical } from 'lucide-react';
import { ICON_SIZES } from '../data/mockMemories';

// Added isDraggingPreview prop for DragOverlay styling
const BaseMemoryCard = ({ memory, isDragging, isDraggingPreview }) => {
  const CardIcon = memory.iconComponent || Package;
  // Use isDraggingPreview for overlay, isDragging for in-list item
  const cardOpacity = (isDragging && !isDraggingPreview) ? 'opacity-50' : 'opacity-100';
  const shadow = isDraggingPreview ? 'shadow-2xl' : 'shadow-lg';


  return (
    <div 
      className={`bg-navy-dark p-5 rounded-xl ${shadow} transition-shadow duration-200 flex flex-col justify-between border-2 border-gray-dark hover:border-accent-purple/70 relative ${cardOpacity} group cursor-grab`}
    >
      <div className="absolute top-2 left-2 text-gray-600 group-hover:text-gray-400 transition-colors" title="Drag to move">
        <GripVertical size={18} />
      </div>
      <div>
        <div className="flex items-center mb-3 pl-4">
          <CardIcon size={ICON_SIZES.SELECT_CARD_ICON} className={`mr-3 ${memory.type === 'Fused Agent' ? 'text-green-400' : memory.type === 'Knowledge Pack' ? 'text-sky-400' : 'text-purple-400'}`} />
          <h2 className="text-lg font-semibold text-white truncate" title={memory.title}>{memory.title}</h2>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mb-3 inline-block ml-4 ${
          memory.type === 'Fused Agent' ? 'bg-green-500/20 text-green-300' : 
          memory.type === 'Knowledge Pack' ? 'bg-sky-500/20 text-sky-300' : 
          'bg-purple-500/20 text-purple-300'
        }`}>
          {memory.type}
        </span>
        <p className="text-gray-400 text-sm line-clamp-2 mb-2 h-10 ml-4">{memory.description || "No description available."}</p>
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 ml-4">
            {memory.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-md">
                {tag}
              </span>
            ))}
            {memory.tags.length > 3 && <span className="text-xs text-gray-500">+{memory.tags.length - 3} more</span>}
          </div>
        )}
      </div>
    </div>
  );
};


export const SortableMemoryCard = ({ memory, isDraggingPreview }) => { // Accept isDraggingPreview
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // This is true when this specific sortable item is being dragged
  } = useSortable({ id: memory.id.toString() }); // Ensure ID is a string

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
  };

  // Pass isDragging to BaseMemoryCard to control opacity of the original item
  // Pass isDraggingPreview for styling the item in DragOverlay
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <BaseMemoryCard memory={memory} isDragging={isDragging} isDraggingPreview={isDraggingPreview} />
    </div>
  );
};
