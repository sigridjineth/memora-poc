import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Info, PackagePlus, ListFilter, Columns } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable, // Import useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { mockMemoriesData, ICON_SIZES } from '../data/mockMemories';
import { SortableMemoryCard } from '../components/SortableMemoryCard';

const AVAILABLE_CONTAINER_ID = 'available-memories-container';
const SELECTED_CONTAINER_ID = 'selected-memories-container';

const DroppableContainer = ({ id, title, items, children, icon }) => {
  const { setNodeRef, isOver } = useDroppable({ id }); // Use the container's ID for useDroppable
  const IconComponent = icon || Layers;

  return (
    <div 
      ref={setNodeRef} // Assign setNodeRef to the main container div
      className={`bg-navy-medium p-4 sm:p-6 rounded-xl shadow-xl flex-1 min-h-[400px] flex flex-col transition-colors duration-150 ${isOver ? 'bg-navy-light' : ''}`}
    >
      <div className="flex items-center mb-4 border-b border-gray-dark pb-3">
        <IconComponent size={20} className="mr-2 text-accent-purple-light" />
        <h2 className="text-xl font-semibold text-white">{title} ({items.length})</h2>
      </div>
      {/* Ensure SortableContext items are string IDs */}
      <SortableContext items={items.map(item => item.id.toString())} strategy={verticalListSortingStrategy}>
        <div className="space-y-4 overflow-y-auto flex-grow pr-1">
          {children}
          {items.length === 0 && (
            <p className="text-gray-medium italic text-center py-10">
              {id === SELECTED_CONTAINER_ID ? "Drag memories here to build your Fused Agent." : "No memories available."}
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
};


const CreateAgentPage = () => {
  const navigate = useNavigate();
  const initialAvailable = useMemo(() => mockMemoriesData.map(mem => ({ ...mem, id: mem.id.toString() })), []);
  
  const [availableMemories, setAvailableMemories] = useState(initialAvailable);
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Finds which container an item belongs to
  const findItemContainerId = (itemId) => {
    if (availableMemories.some(item => item.id === itemId)) {
      return AVAILABLE_CONTAINER_ID;
    }
    if (selectedMemories.some(item => item.id === itemId)) {
      return SELECTED_CONTAINER_ID;
    }
    return null;
  };
  
  const handleDragStart = (event) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event) => {
    // Can be used for visual cues or complex validation if needed.
    // For this setup, primary logic is in handleDragEnd.
  };
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      return;
    }

    const activeIdStr = active.id.toString();
    const overIdStr = over.id.toString();
    
    const sourceContainerId = findItemContainerId(activeIdStr);
    
    // Determine if 'over' is an item or a container
    // An item is "over" if its ID is found in one of the memory lists
    const overIsAnItem = availableMemories.some(i => i.id === overIdStr) || selectedMemories.some(i => i.id === overIdStr);
    
    let targetContainerId;
    if (overIsAnItem) {
      targetContainerId = findItemContainerId(overIdStr);
    } else {
      // If not an item, 'over.id' should be one of our droppable container IDs
      if (overIdStr === AVAILABLE_CONTAINER_ID || overIdStr === SELECTED_CONTAINER_ID) {
        targetContainerId = overIdStr;
      } else {
        console.warn("Dropped over an unknown droppable target:", overIdStr);
        return; 
      }
    }

    if (!sourceContainerId || !targetContainerId) {
      console.warn("Could not determine source or target container for D&D operation.");
      return;
    }

    const activeItem = (sourceContainerId === AVAILABLE_CONTAINER_ID 
                        ? availableMemories.find(i => i.id === activeIdStr) 
                        : selectedMemories.find(i => i.id === activeIdStr));
    
    if (!activeItem) {
        console.warn("Dragged item not found in source list.");
        return;
    }

    // Scenario 1: Moving to a different container
    if (sourceContainerId !== targetContainerId) {
      if (sourceContainerId === AVAILABLE_CONTAINER_ID && targetContainerId === SELECTED_CONTAINER_ID) {
        setAvailableMemories(prev => prev.filter(item => item.id !== activeIdStr));
        setSelectedMemories(prevSelected => {
          const newSelected = [...prevSelected];
          if (overIsAnItem) { // Dropped over an existing item in the target container
            const overItemIndex = newSelected.findIndex(item => item.id === overIdStr);
            if (overItemIndex !== -1) {
              newSelected.splice(overItemIndex, 0, activeItem);
            } else { // Should not happen if overIsAnItem is true and findItemContainerId is correct
              newSelected.push(activeItem);
            }
          } else { // Dropped onto the container itself (empty space or padding)
            newSelected.push(activeItem);
          }
          return newSelected;
        });
      } else if (sourceContainerId === SELECTED_CONTAINER_ID && targetContainerId === AVAILABLE_CONTAINER_ID) {
        setSelectedMemories(prev => prev.filter(item => item.id !== activeIdStr));
        setAvailableMemories(prevAvailable => {
          // Add to available list (order might not be critical here, typically add to end)
          // If dropping over an item in available, could insert, but reordering in available is not a feature.
          return [...prevAvailable, activeItem]; 
        });
      }
    }
    // Scenario 2: Reordering within the SELECTED_CONTAINER_ID
    else if (sourceContainerId === SELECTED_CONTAINER_ID && targetContainerId === SELECTED_CONTAINER_ID) {
      if (activeIdStr !== overIdStr && overIsAnItem) { // Ensure not dropped on itself and over a valid item
        setSelectedMemories(items => {
            const oldIndex = items.findIndex(item => item.id === activeIdStr);
            const newIndex = items.findIndex(item => item.id === overIdStr);
            if (oldIndex !== -1 && newIndex !== -1) {
              return arrayMove(items, oldIndex, newIndex);
            }
            return items;
        });
      }
      // If dropped on the container itself (not an item) within the same container, no reorder action.
    }
  };

  const handleProceedToConfiguration = () => {
    if (selectedMemories.length === 0) {
      alert("Please select at least one memory to fuse by dragging it to the 'Your Fusion Blueprint' column.");
      return;
    }
    const serializableSelectedMemories = selectedMemories.map(mem => {
      const { iconComponent, ...rest } = mem;
      return rest;
    });
    navigate('/configure-fusion', { state: { selectedMemories: serializableSelectedMemories } });
  };
  
  const canProceed = selectedMemories.length > 0;
  const activeDraggedItem = activeId ? (availableMemories.find(m => m.id === activeId) || selectedMemories.find(m => m.id === activeId)) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver} // Kept for potential future use, but not essential for current logic
      onDragEnd={handleDragEnd}
    >
      <div className="p-4 sm:p-6 lg:p-8 text-gray-light min-h-screen">
        <header className="mb-8">
          <div className="flex items-center mb-2">
            <Layers size={ICON_SIZES.PAGE_HEADER} className="mr-3 text-accent-purple" />
            <h1 className="text-3xl font-bold text-white">Fuse Agent Memories</h1>
          </div>
          <p className="text-gray-medium mt-1">
            Drag and drop memories from "Available" to "Your Fusion Blueprint" to select them for combination.
          </p>
        </header>

        {initialAvailable.length === 0 && availableMemories.length === 0 && selectedMemories.length === 0 ? ( // Check all lists if initial was empty
          <div className="flex flex-col items-center justify-center text-center py-16 bg-navy-medium rounded-lg shadow-xl">
            <Info size={ICON_SIZES.EMPTY_STATE_ALERT} className="text-sky-500 mb-6" />
            <h2 className="text-2xl font-semibold text-white mb-3">No Memories Available for Fusion</h2>
            <p className="text-gray-medium max-w-md">
              It seems you don't have any memories in your collection yet. Create or acquire some memories first.
            </p>
            <button
              onClick={() => navigate('/my-collection')}
              className="mt-6 bg-accent-purple text-white px-6 py-2.5 rounded-lg hover:bg-opacity-80 transition-colors font-medium"
            >
              Go to My Collection
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8 p-4 bg-sky-800/30 border border-sky-700 rounded-lg text-sky-300 text-sm">
              <p className="font-semibold">How Fusion Works:</p>
              <ul className="list-disc list-inside ml-1 mt-1 space-y-0.5">
                <li>Drag memories from the "Available Memories" list to the "Your Fusion Blueprint" list.</li>
                <li>Arrange them in the desired order if priority matters (reordering within blueprint enabled).</li>
                <li>The core prompts, knowledge, and assets from selected memories will be combined.</li>
                <li>You'll define how these components interact in the next step.</li>
              </ul>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <DroppableContainer id={AVAILABLE_CONTAINER_ID} title="Available Memories" items={availableMemories} icon={ListFilter}>
                {availableMemories.map(memory => (
                  <SortableMemoryCard key={memory.id} memory={memory} />
                ))}
              </DroppableContainer>
              
              <div className="flex items-center justify-center text-gray-500 lg:rotate-0 rotate-90 my-4 lg:my-0">
                 <Columns size={32} />
              </div>

              <DroppableContainer id={SELECTED_CONTAINER_ID} title="Your Fusion Blueprint" items={selectedMemories} icon={PackagePlus}>
                {selectedMemories.map(memory => (
                  <SortableMemoryCard key={memory.id} memory={memory} />
                ))}
              </DroppableContainer>
            </div>
            
            <DragOverlay>
              {activeDraggedItem ? <SortableMemoryCard memory={activeDraggedItem} isDraggingPreview /> : null}
            </DragOverlay>

            <div className="mt-8 flex justify-end items-center p-4 bg-navy-darker sticky bottom-0 shadow-top rounded-t-lg">
              <p className="text-gray-medium mr-4 text-sm">
                  Selected for Fusion: {selectedMemories.length} memory component(s)
              </p>
              <button
                onClick={handleProceedToConfiguration}
                disabled={!canProceed}
                className={`bg-accent-purple text-white px-8 py-3 rounded-lg hover:bg-opacity-80 transition-colors font-semibold flex items-center text-base ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Next: Configure Fusion <ArrowRight size={20} className="ml-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </DndContext>
  );
};

export default CreateAgentPage;
