-- Drop the tasks table if it exists to start fresh
DROP TABLE IF EXISTS tasks CASCADE;

-- Create the tasks table
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    title text NOT NULL,
    description text,
    category text,
    status text DEFAULT 'To Do',
    priority text DEFAULT 'medium',
    due_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    completed boolean DEFAULT false
);

-- Enable Row Level Security for the tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the tasks table
CREATE POLICY "Allow users to select their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow users to insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow users to update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);