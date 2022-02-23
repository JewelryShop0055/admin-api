CREATE or REPLACE TRIGGER autoRevTrigger 
BEFORE INSERT ON Items 
FOR EACH ROW 
BEGIN
 SET NEW.revNo = (SELECT
		count(*) as revNo
	FROM
		Items
	WHERE
		partNo = new.partNo);
END
