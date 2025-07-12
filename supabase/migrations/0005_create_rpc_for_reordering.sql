CREATE OR REPLACE FUNCTION update_task_positions(updates jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    item jsonb;
BEGIN
    FOR item IN SELECT * FROM jsonb_array_elements(updates)
    LOOP
        UPDATE public.tasks
        SET position = (item->>'position')::integer
        WHERE id = (item->>'id')::uuid AND user_id = auth.uid();
    END LOOP;
END;
$$;