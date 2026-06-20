import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Settings, GripVertical } from 'lucide-react';

const SortableItem = ({ id, label, icon }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="pipeline-item"
    >
      <div {...attributes} {...listeners} className="drag-handle">
        <GripVertical size={16} />
      </div>
      <div className="pipeline-item-content">
        <span className="pipeline-icon">{icon}</span>
        <span className="pipeline-label">{label}</span>
      </div>
      <button className="pipeline-settings">
        <Settings size={14} />
      </button>
    </div>
  );
};

const PipelineEditor = ({ pipeline, setPipeline }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPipeline((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="pipeline-editor">
      <h3 className="pipeline-title">AI Processing Pipeline</h3>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={pipeline.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="pipeline-list">
            {pipeline.map((item) => (
              <SortableItem key={item.id} id={item.id} label={item.label} icon={item.icon} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PipelineEditor;
