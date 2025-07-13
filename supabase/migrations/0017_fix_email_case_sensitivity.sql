-- This migration updates the accept_all_pending_invitations function to be case-insensitive when matching emails.
CREATE OR REPLACE FUNCTION accept_all_pending_invitations(u_id uuid, u_email text)
RETURNS void AS $$
DECLARE
  invitation record;
BEGIN
  FOR invitation IN
    SELECT * FROM public.invitations
    WHERE lower(email) = lower(u_email) AND status = 'pending'
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