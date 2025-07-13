-- This migration redefines the accept_all_pending_invitations function to accept the user's ID and email as parameters.
-- This is necessary because a SECURITY DEFINER function does not have access to the calling user's session.
CREATE OR REPLACE FUNCTION accept_all_pending_invitations(u_id uuid, u_email text)
RETURNS void AS $$
DECLARE
  invitation record;
BEGIN
  FOR invitation IN
    SELECT * FROM public.invitations
    WHERE email = u_email AND status = 'pending'
  LOOP
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (invitation.project_id, u_id, invitation.role)
    ON CONFLICT (project_id, user_id) DO NOTHING;

    UPDATE public.invitations
    SET status = 'accepted', updated_at = now()
    WHERE id = invitation.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;