-- Step 1: Fix the infinite recursion in the project_members RLS policy
-- Drop the faulty policy
DROP POLICY "Allow members to see other members in their projects" ON project_members;

-- Recreate the policy with a non-recursive check
CREATE POLICY "Allow members to see other members in their projects" ON project_members
FOR SELECT USING (
    EXISTS (
        SELECT 1
        FROM project_members pm
        WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid()
    )
);

-- Step 2: Grant necessary permissions for the accept_all_pending_invitations function
-- Allow authenticated users to read from auth.users
GRANT SELECT ON TABLE auth.users TO authenticated;

-- Allow authenticated users to insert into project_members
GRANT INSERT ON TABLE project_members TO authenticated;

-- Step 3: Update the accept_all_pending_invitations function to run with security invoker
CREATE OR REPLACE FUNCTION accept_all_pending_invitations()
RETURNS void AS $$
DECLARE
  invitation record;
  current_user_id uuid := auth.uid();
  current_user_email text;
BEGIN
  -- Get the current user's email
  SELECT email INTO current_user_email FROM auth.users WHERE id = current_user_id;

  -- Loop through all pending invitations for the current user's email
  FOR invitation IN
    SELECT * FROM invitations
    WHERE email = current_user_email AND status = 'pending'
  LOOP
    -- Add the user to the project_members table
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (invitation.project_id, current_user_id, invitation.role)
    ON CONFLICT (project_id, user_id) DO NOTHING; -- Ignore if already a member

    -- Update the invitation status to 'accepted'
    UPDATE invitations
    SET status = 'accepted', updated_at = now()
    WHERE id = invitation.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;