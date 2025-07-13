-- This migration updates the update_task_positions function to remove the dependency on the old user_id column.
-- The RLS policies on the tasks table now handle the authorization for this operation.
CREATE OR REPLACE FUNCTION update_task_positions(updates jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    item jsonb;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(updates)
    LOOP
        UPDATE public.tasks
        SET position = (item->>'position')::integer
        WHERE id = (item->>'id')::uuid;
    END LOOP;
END;
$$;