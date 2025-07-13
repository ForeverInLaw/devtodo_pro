-- Step 1: Create the project_members table to manage user roles in projects
CREATE TABLE project_members (
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'viewer',
    created_at timestamptz DEFAULT now(),
    PRIMARY KEY (project_id, user_id)
);

-- Step 2: Create the invitations table to manage project invitations
CREATE TABLE invitations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    email text NOT NULL,
    role text NOT NULL DEFAULT 'viewer',
    status text NOT NULL DEFAULT 'pending', -- pending, accepted, declined
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Step 3: Modify the projects table
-- Rename user_id to owner_id for clarity
ALTER TABLE projects RENAME COLUMN user_id TO owner_id;

-- Step 4: Drop all RLS policies on the tasks table that depend on user_id
DROP POLICY IF EXISTS "Allow users to select their own tasks" ON tasks;
DROP POLICY IF EXISTS "Allow users to insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Allow users to update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Allow users to delete their own tasks" ON tasks;
DROP POLICY IF EXISTS "Enable read access for own tasks" ON tasks;
DROP POLICY IF EXISTS "Enable insert for own tasks" ON tasks;
DROP POLICY IF EXISTS "Enable update for own tasks" ON tasks;
DROP POLICY IF EXISTS "Enable delete for own tasks" ON tasks;

-- Step 5: Modify the tasks table
-- Remove the user_id column as access is now managed through project membership
ALTER TABLE tasks DROP COLUMN user_id;

-- Step 6: Update RLS Policies
-- Policies for 'projects' table
DROP POLICY IF EXISTS "Allow users to select their own projects" ON projects;
CREATE POLICY "Allow members to select their projects" ON projects
FOR SELECT USING (
    id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
);

DROP POLICY "Allow users to insert their own projects" ON projects;
CREATE POLICY "Allow authenticated users to insert projects" ON projects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY "Allow users to update their own projects" ON projects;
CREATE POLICY "Allow admins to update projects" ON projects
FOR UPDATE USING (
    (SELECT role FROM project_members WHERE project_id = id AND user_id = auth.uid()) = 'admin'
);

DROP POLICY "Allow users to delete their own projects" ON projects;
CREATE POLICY "Allow owners to delete projects" ON projects
FOR DELETE USING (owner_id = auth.uid());

-- Policies for 'tasks' table
CREATE POLICY "Allow members to select tasks in their projects" ON tasks
FOR SELECT USING (
    project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
);

CREATE POLICY "Allow editors to insert tasks" ON tasks
FOR INSERT WITH CHECK (
    (SELECT role FROM project_members WHERE project_id = tasks.project_id AND user_id = auth.uid()) IN ('admin', 'editor')
);

CREATE POLICY "Allow editors to update tasks" ON tasks
FOR UPDATE USING (
    (SELECT role FROM project_members WHERE project_id = tasks.project_id AND user_id = auth.uid()) IN ('admin', 'editor')
);

CREATE POLICY "Allow editors to delete tasks" ON tasks
FOR DELETE USING (
    (SELECT role FROM project_members WHERE project_id = tasks.project_id AND user_id = auth.uid()) IN ('admin', 'editor')
);

-- Policies for 'project_members' table
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow members to see other members in their projects" ON project_members
FOR SELECT USING (
    project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
);

CREATE POLICY "Allow admins to insert new members" ON project_members
FOR INSERT WITH CHECK (
    (SELECT role FROM project_members WHERE project_id = project_members.project_id AND user_id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow admins to update member roles" ON project_members
FOR UPDATE USING (
    (SELECT role FROM project_members WHERE project_id = project_members.project_id AND user_id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow admins to remove members" ON project_members
FOR DELETE USING (
    (SELECT role FROM project_members WHERE project_id = project_members.project_id AND user_id = auth.uid()) = 'admin'
);

-- Policies for 'invitations' table
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow members to see invitations for their projects" ON invitations
FOR SELECT USING (
    project_id IN (SELECT project_id FROM project_members WHERE user_id = auth.uid())
);

CREATE POLICY "Allow admins to create invitations" ON invitations
FOR INSERT WITH CHECK (
    (SELECT role FROM project_members WHERE project_id = invitations.project_id AND user_id = auth.uid()) = 'admin'
);

CREATE POLICY "Allow invited users to update their own invitations" ON invitations
FOR UPDATE USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
);