-- This function securely fetches project members and their emails for a given project.
-- It first checks if the calling user is a member of the project using the is_project_member helper function.
-- If the user is a member, it returns a JSON array of all members, including their emails from auth.users.
-- This bypasses the RLS restrictions on auth.users in a secure way.
CREATE OR REPLACE FUNCTION get_project_members(p_id uuid)
RETURNS json AS $$
DECLARE
  members_json json;
  is_member boolean;
BEGIN
  -- Check if the calling user is a member of the project.
  SELECT is_project_member(p_id, auth.uid()) INTO is_member;

  IF is_member THEN
    -- If they are a member, fetch the member list.
    SELECT json_agg(
      json_build_object(
        'user_id', pm.user_id,
        'role', pm.role,
        'users', json_build_object('email', u.email) -- Match the nested structure expected by the client
      )
    )
    INTO members_json
    FROM public.project_members pm
    JOIN auth.users u ON pm.user_id = u.id
    WHERE pm.project_id = p_id;
  ELSE
    -- If not a member, return an empty array.
    members_json := '[]'::json;
  END IF;

  RETURN COALESCE(members_json, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;