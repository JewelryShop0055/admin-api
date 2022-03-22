
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

-- 아래부터 검색어 트리거

DO $$ BEGIN

CREATE TRIGGER
  categories_search_trigger
BEFORE INSERT OR UPDATE ON
  "Categories"
FOR EACH ROW EXECUTE PROCEDURE
  tsvector_update_trigger('tsvector', 'public.korean', memo, name );

EXCEPTION
  WHEN others THEN null;
END $$;


DO $$ BEGIN

CREATE TRIGGER
  item_search_trigger
BEFORE INSERT OR UPDATE ON
  "items"
FOR EACH ROW EXECUTE PROCEDURE
  tsvector_update_trigger('tsvector', 'public.korean',"partNo", "name", "memo" );


EXCEPTION
  WHEN others THEN null;
END $$;

DO $$ BEGIN

CREATE TRIGGER
  companies_search_trigger
BEFORE INSERT OR UPDATE ON
  "Companies"
  FOR EACH ROW EXECUTE PROCEDURE
  tsvector_update_trigger('tsvector', 'public.korean',  "name", "postCode", "address", "detailAddress", "phone" );

EXCEPTION
  WHEN others THEN null;
END $$;


-- set default_text_search_config = korean;
