-- Step 1: Create a new SECURITY DEFINER function to check for admin role.
-- This function will bypass RLS, preventing infinite recursion.
CREATE OR REPLACE FUNCTION is_project_admin(p_id uuid, u_id uuid)
RETURNS boolean AS $$
DECLARE
  member_role text;
BEGIN
  SELECT role INTO member_role
  FROM public.project_members
  WHERE project_id = p_id AND user_id = u_id;
  RETURN member_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop the faulty admin policy.
DROP POLICY IF EXISTS "Allow admins to manage members" ON public.project_members;

-- Step 3: Recreate the policy for admins using the new helper function.
CREATE POLICY "Allow admins to manage members" ON public.project_members
FOR ALL
USING (is_project_admin(project_id, auth.uid()));