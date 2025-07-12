ALTER TABLE tasks
ADD COLUMN "position" INTEGER;

-- Set initial positions for existing tasks
UPDATE tasks
SET "position" = t.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY project_id ORDER BY "created_at") as rn
  FROM tasks
) as t
WHERE tasks.id = t.id;