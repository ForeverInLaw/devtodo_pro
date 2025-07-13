import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Button from '../../../components/ui/Button';

const TaskContent = ({ task, onTaskUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [showPreview, setShowPreview] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setShowPreview(false);
  };

  const handleSave = () => {
    onTaskUpdate({ ...task, description: editedDescription });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(task.description);
    setIsEditing(false);
    setShowPreview(false);
  };


  return (
    <div className="bg-card rounded-lg p-6 elevation-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            iconName="Edit2"
            iconPosition="left"
          >
            Edit
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              iconName={showPreview ? "Edit" : "Eye"}
              iconPosition="left"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              iconName="Check"
              iconPosition="left"
            >
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              iconName="X"
              iconPosition="left"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {showPreview ? (
            <div className="min-h-32 p-4 bg-muted rounded-md border border-border prose prose-sm max-w-none text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                {editedDescription}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full min-h-32 p-4 bg-background border border-border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              placeholder="Enter task description... (Supports **bold**, *italic*, and `code`)"
            />
          )}
          
          <div className="text-xs text-muted-foreground">
            <p>Markdown supported: **bold**, *italic*, `code`</p>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none text-foreground">
          {task.description ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {task.description}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">No description provided</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskContent;