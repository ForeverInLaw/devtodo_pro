CREATE OR REPLACE FUNCTION create_project_and_add_owner(name text)
RETURNS uuid AS $$
DECLARE
  new_project_id uuid;
  current_user_id uuid := auth.uid();
BEGIN
  -- Create the new project
  INSERT INTO projects (name, owner_id)
  VALUES (name, current_user_id)
  RETURNING id INTO new_project_id;

  -- Add the creator as an admin member of the new project
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (new_project_id, current_user_id, 'admin');

  RETURN new_project_id;
END;
$$ LANGUAGE plpgsql;