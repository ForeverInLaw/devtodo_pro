-- Drop existing policies to redefine them
DROP POLICY IF EXISTS "Allow full access to own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Enable read access for own tasks" ON public.tasks;

-- Create a new policy for SELECT
CREATE POLICY "Enable read access for own tasks"
ON public.tasks
FOR SELECT
USING (auth.uid() = user_id);

-- Create a new policy for INSERT
CREATE POLICY "Enable insert for own tasks"
ON public.tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create a new policy for UPDATE
CREATE POLICY "Enable update for own tasks"
ON public.tasks
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create a new policy for DELETE
CREATE POLICY "Enable delete for own tasks"
ON public.tasks
FOR DELETE
USING (auth.uid() = user_id);