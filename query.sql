
CREATE OR REPLACE FUNCTION autoRev ()
	RETURNS TRIGGER
	AS $autoRevTrigger$
DECLARE
	revNo bigint;
BEGIN
	SELECT
		count(*) INTO revNo
	FROM
		"Items"
	WHERE
		"partNo" = new."partNo";
	new."revNo" = revNo;
	RETURN new;
END;
$autoRevTrigger$
LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS(SELECT *
    FROM information_schema.triggers
    WHERE event_object_table = 'Items'
    AND trigger_name = 'autorevtrigger'
  )
  THEN
CREATE TRIGGER autoRevTrigger BEFORE INSERT on "Items"
 for each row execute procedure autoRev();
   END IF;
END;
$$

-- set default_text_search_config = korean;
