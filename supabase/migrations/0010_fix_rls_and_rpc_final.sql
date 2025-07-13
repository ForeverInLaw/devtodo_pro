-- Step 1: Revoke permissions from the previous incorrect fix.
REVOKE SELECT ON TABLE auth.users FROM authenticated;
REVOKE INSERT ON TABLE project_members FROM authenticated;

-- Step 2: Create a SECURITY DEFINER function to check project membership.
-- This function will bypass RLS checks, preventing infinite recursion.
CREATE OR REPLACE FUNCTION is_project_member(p_id uuid, u_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.project_members
    WHERE project_id = p_id AND user_id = u_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Drop the old, recursive RLS policies on project_members.
DROP POLICY IF EXISTS "Allow members to see other members in their projects" ON public.project_members;
DROP POLICY IF EXISTS "Allow admins to insert new members" ON public.project_members;
DROP POLICY IF EXISTS "Allow admins to update member roles" ON public.project_members;
DROP POLICY IF EXISTS "Allow admins to remove members" ON public.project_members;

-- Step 4: Recreate the RLS policies for project_members using the helper function.
CREATE POLICY "Allow members to see other members in their projects" ON public.project_members
FOR SELECT
USING (is_project_member(project_id, auth.uid()));

CREATE POLICY "Allow admins to manage members" ON public.project_members
FOR ALL
USING (
    (SELECT role FROM public.project_members WHERE project_id = project_members.project_id AND user_id = auth.uid()) = 'admin'
);

-- Step 5: Recreate the accept_all_pending_invitations function as a SECURITY DEFINER function.
-- This allows it to bypass RLS when adding new members.
CREATE OR REPLACE FUNCTION accept_all_pending_invitations()
RETURNS void AS $$
DECLARE
  invitation record;
  current_user_id uuid := auth.uid();
  current_user_email text;
BEGIN
  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;

  FOR invitation IN
    SELECT * FROM public.invitations
    WHERE email = current_user_email AND status = 'pending'
  LOOP
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (invitation.project_id, current_user_id, invitation.role)
    ON CONFLICT (project_id, user_id) DO NOTHING;

    UPDATE public.invitations
    SET status = 'accepted', updated_at = now()
    WHERE id = invitation.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;