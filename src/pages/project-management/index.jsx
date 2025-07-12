import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import { toast } from 'sonner';

const ProjectManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null); // { id, name }
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error('Failed to load projects.');
      } else {
        setProjects(data);
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [user]);

  const handleSelectProject = (projectId) => {
    localStorage.setItem('taskDashboard_selectedProject', projectId);
    navigate('/task-dashboard');
  };

  const handleCreateProject = async () => {
    if (newProjectName.trim() === '') return;
    const { data, error } = await supabase
      .from('projects')
      .insert({ name: newProjectName, user_id: user.id })
      .select();

    if (error) {
      toast.error('Failed to create project.');
    } else {
      setProjects([...projects, data[0]]);
      toast.success('Project created.');
      setNewProjectName('');
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProject || editingProject.name.trim() === '') return;
    const { data, error } = await supabase
      .from('projects')
      .update({ name: editingProject.name })
      .eq('id', editingProject.id)
      .select();

    if (error) {
      toast.error('Failed to update project.');
    } else {
      setProjects(projects.map(p => p.id === editingProject.id ? data[0] : p));
      toast.success('Project updated.');
      setEditingProject(null);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project? All associated tasks will be unassigned.')) return;
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast.error('Failed to delete project.');
    } else {
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted.');
      // If the deleted project was the selected one, clear it
      if (localStorage.getItem('taskDashboard_selectedProject') === projectId) {
        localStorage.removeItem('taskDashboard_selectedProject');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background pt-16" // pt-16 to offset for fixed header
    >
      <div className="p-4 md:p-6">
          <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>
          
          {/* Create Project Form */}
          <div className="mb-6 p-4 bg-card border rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Create New Project</h2>
            <div className="flex gap-2">
              <Input 
                placeholder="Project name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
              <Button onClick={handleCreateProject}>Create</Button>
            </div>
          </div>

          {/* Projects List */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 bg-card border rounded-lg flex items-center justify-between animate-pulse">
                    <div className="h-6 w-1/3 bg-muted rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-muted rounded"></div>
                      <div className="h-8 w-8 bg-muted rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {projects.map(project => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="p-3 bg-card border rounded-lg flex items-center justify-between"
                  >
                    {editingProject?.id === project.id ? (
                      <Input
                        value={editingProject.name}
                        onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                        className="flex-grow"
                      />
                    ) : (
                      <span
                        className="font-semibold cursor-pointer hover:text-primary"
                        onClick={() => handleSelectProject(project.id)}
                      >
                        {project.name}
                      </span>
                    )}
                    <div className="flex gap-2">
                      {editingProject?.id === project.id ? (
                        <>
                          <Button size="sm" onClick={handleUpdateProject}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => setEditingProject({ id: project.id, name: project.name })}>
                            <Icon name="Edit2" size={16} />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-error" onClick={() => handleDeleteProject(project.id)}>
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
      </div>
    </motion.div>
  );
};

export default ProjectManagementPage;