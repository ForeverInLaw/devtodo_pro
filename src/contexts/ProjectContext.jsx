import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (user && projects.length === 0) {
        setIsLoading(true);
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('id, name')
          .order('created_at', { ascending: true });

        if (projectError) {
          console.error('Error fetching projects:', projectError);
          setProjects([]);
        } else {
          setProjects(projectData);
          const currentSelectedProject = localStorage.getItem('taskDashboard_selectedProject');
          if (currentSelectedProject && projectData.find(p => p.id.toString() === currentSelectedProject)) {
            setSelectedProject(currentSelectedProject);
          } else if (projectData.length > 0) {
            setSelectedProject(projectData[0].id);
          }
        }
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [user, projects]);

  useEffect(() => {
    if (selectedProject) {
      localStorage.setItem('taskDashboard_selectedProject', selectedProject);
    }
  }, [selectedProject]);

  const value = {
    projects,
    selectedProject,
    setSelectedProject,
    isLoading,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};