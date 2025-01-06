SET SESSION FOREIGN_KEY_CHECKS=0;

/* Drop Tables */

DROP TABLE IF EXISTS price;




/* Create Tables */

CREATE TABLE price
(
	seq int NOT NULL AUTO_INCREMENT,
	price int DEFAULT 0 NOT NULL,
	indate datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY (seq)
);



