-- SPUME.CO BASIC DATABASE CREATION
DROP DATABASE IF EXISTS spumedb;
CREATE DATABASE IF NOT EXISTS spumedb;

CREATE USER IF NOT EXISTS `spume`@`%` IDENTIFIED BY "spudba";
GRANT ALL PRIVILEGES ON `spumedb`.* TO `spume`@`%`;
FLUSH PRIVILEGES;

USE spumedb;

-- set global sql_mode=(select replace(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
-- create user if not exists abox_dba@localhost identified by 'rootz';
-- grant all privileges on spumedb.* to abox_dba@localhost;
-- flush privileges;

ALTER SCHEMA spumedb DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
--
-- Variables declarations
--

SET
@__INACTIVE                = 0,
@__ACTIVE                  = 1, -- estags
@__MANAGER                 = 2, -- fabio
@__DIRECTOR                = 3,
@__TI1                     = 4,
@__TI2                     = 5,
@__ADMIN                   = 6, 
@__OWNER                   = 7, -- miguel
@__ROOT                    = 8, 
@__DEVELOPER               = 9; -- eu e vc
-- Table structure for table `Users`
--
DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (	
    `id` INT(4)		           UNIQUE NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(64) 	       NOT NULL,
    `mail` VARCHAR(64) 	       UNIQUE DEFAULT NULL,
    `tel` CHAR(15) 	           DEFAULT NULL,
    `access_lvl` INT(1)        NOT NULL DEFAULT 0,
    `view` INT(11) 		       NOT NULL DEFAULT '0', -- quantidade de logins feitas no sistema
    `user` VARCHAR(16) 	       UNIQUE DEFAULT NULL,
    `pswd` CHAR(64) 	       DEFAULT NULL,
    `created` TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
    `modified` TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;
--
-- Dumping data for table `Users`
--
INSERT INTO `Users` (name, mail, access_lvl, view, user, pswd) VALUES (
	'dev', 'comunicacao@spume.co', @__DEVELOPER, 0, 'spum', '0d63111317342d0ddc3ebaf46e9d1dc0cc3e0b5ddf55f326c0557b1a5633e277'
);