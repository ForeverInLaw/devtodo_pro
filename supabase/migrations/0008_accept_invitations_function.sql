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
$$ LANGUAGE plpgsql;