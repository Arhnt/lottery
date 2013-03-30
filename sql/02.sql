USE `loto`;

SET NAMES 'utf8';
SET `character_set_client` = 'utf8';
SET `character_set_results` = 'utf8';
SET `collation_connection` = 'utf8_general_ci';

DROP TABLE IF EXISTS `options`;
CREATE TABLE `options` (
  `name` varchar(100) CHARACTER SET utf8 NOT NULL UNIQUE,
  `value` varchar(300) CHARACTER SET utf8 NOT NULL DEFAULT ''
) ENGINE=MyISAM;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `asfn_id` varchar(10) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `name` varchar(300) CHARACTER SET utf8 DEFAULT '',
  `email` varchar(100) CHARACTER SET utf8 DEFAULT '',
  `country` varchar(100) CHARACTER SET utf8 DEFAULT '',
  `city` varchar(300) CHARACTER SET utf8 DEFAULT '',
  `created` datetime DEFAULT NULL,
  `last_seen` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS `game_sessions`;
CREATE TABLE `game_sessions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cgi_session` CHAR(32) NOT NULL UNIQUE,
  `user_id` int(10) unsigned,
  `game_price` decimal(5,2) unsigned,
  `key` varchar(16) NOT NULL UNIQUE,
  `created` datetime DEFAULT NULL,
  `paid` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `session_id` int(10) NOT NULL,
  `numbers` varchar(300) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `games` int(8) unsigned not null,
  `games_left` int(8) unsigned not null,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;

DROP TABLE IF EXISTS `game_history`;
CREATE TABLE `game_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(10) unsigned NOT NULL,
  `ticket_id` int(10) unsigned NOT NULL,
  `guessed` int(8) unsigned not null,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS `games`;
CREATE TABLE `games` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `lucky_numbers` varchar(300) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `sum` numeric(8,2) unsigned not null,
  `max_number` int(10) unsigned NOT NULL,
  `count_numbers` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM;

DROP TABLE IF EXISTS `budget`;
CREATE TABLE `budget` (
  `game_id` int(10) unsigned NOT NULL,
  `sum` numeric(8,2) unsigned not null default 0,
  `prize` numeric(8,2) unsigned not null default 0,
  `costs` numeric(8,2) unsigned not null default 0,
  `marketing` numeric(8,2) unsigned not null default 0,
  `support` numeric(8,2) unsigned not null default 0,
  `profit` numeric(8,2) unsigned not null default 0
) ENGINE=MyISAM;
