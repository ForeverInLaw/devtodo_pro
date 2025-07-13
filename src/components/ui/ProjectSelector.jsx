import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import Select from './Select';
import Button from './Button';
import Input from './Input';
import { toast } from 'sonner';

const ProjectSelector = ({ selectedProject, onProjectChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects.');
      } else {
        setProjects(data);
        if (!selectedProject && data.length > 0) {
          onProjectChange(data[0].id);
        } else if (data.length === 0) {
          onProjectChange(null);
        }
      }
      setIsLoading(false);
    };

    fetchProjects();
  }, [user]);


  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 animate-pulse">
        <div className="h-9 w-48 bg-muted rounded" />
        <div className="h-9 w-9 bg-muted rounded" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">No projects found.</span>
        <Button variant="outline" size="sm" onClick={() => navigate('/projects')}>Create One</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        options={projectOptions}
        value={selectedProject}
        onChange={onProjectChange}
        className="w-48"
        placeholder="Select a project"
      />
      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate('/projects')} aria-label="Manage projects">
        ...
      </Button>
    </div>
  );
};

export default ProjectSelector;