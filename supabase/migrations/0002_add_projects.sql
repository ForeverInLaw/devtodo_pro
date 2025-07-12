-- Create the projects table
CREATE TABLE projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security for the projects table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the projects table
CREATE POLICY "Allow users to select their own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own projects" ON projects FOR DELETE USING (auth.uid() = user_id);

-- Add project_id to the tasks table
ALTER TABLE tasks ADD COLUMN project_id uuid REFERENCES projects(id) ON DELETE SET NULL;

-- Update RLS policies for the tasks table to include project_id check
DROP POLICY "Allow users to select their own tasks" ON tasks;
CREATE POLICY "Allow users to select their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY "Allow users to insert their own tasks" ON tasks;
CREATE POLICY "Allow users to insert their own tasks" ON tasks FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND project_id IS NOT NULL
    AND project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
);

DROP POLICY "Allow users to update their own tasks" ON tasks;
CREATE POLICY "Allow users to update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY "Allow users to delete their own tasks" ON tasks;
CREATE POLICY "Allow users to delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);