import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ModalOverlay from './components/ModalOverlay';
import TaskForm from './components/TaskForm';
import SuccessAnimation from './components/SuccessAnimation';

const TaskCreationModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTask, setCreatedTask] = useState(null);

  const handleTaskSubmit = async (taskData) => {
    setIsLoading(true);
    try {
      await onSubmit(taskData);
      setCreatedTask(taskData);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to submit task:', error);
      alert(error.message || 'Failed to submit task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <ModalOverlay
        isOpen={isOpen}
        onClose={onClose}
        title={initialData ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          onSubmit={handleTaskSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          initialData={initialData}
        />
      </ModalOverlay>

      <SuccessAnimation
        isVisible={showSuccess}
        onComplete={handleSuccessComplete}
        taskTitle={createdTask?.title || ''}
      />
    </>
  );
};

export default TaskCreationModal;