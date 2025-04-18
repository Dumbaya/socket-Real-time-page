-- --------------------------------------------------------
-- 호스트:                          localhost
-- 서버 버전:                        5.7.44 - MySQL Community Server (GPL)
-- 서버 OS:                        Linux
-- HeidiSQL 버전:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- socket_study 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `socket_study` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `socket_study`;

-- 테이블 socket_study.chaos_chat 구조 내보내기
CREATE TABLE IF NOT EXISTS `chaos_chat` (
  `chat_user` varchar(30) NOT NULL,
  KEY `FK_chaos_chat_user` (`chat_user`),
  CONSTRAINT `FK_chaos_chat_user` FOREIGN KEY (`chat_user`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 socket_study.file_chat 구조 내보내기
CREATE TABLE IF NOT EXISTS `file_chat` (
  `chat_user` varchar(30) NOT NULL,
  KEY `FK__user` (`chat_user`),
  CONSTRAINT `FK__user` FOREIGN KEY (`chat_user`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 socket_study.ran_chat 구조 내보내기
CREATE TABLE IF NOT EXISTS `ran_chat` (
  `chat_user` varchar(30) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'waiting' COMMENT 'waiting, matched',
  KEY `FK__user` (`chat_user`) USING BTREE,
  CONSTRAINT `FK_ran_chat_user` FOREIGN KEY (`chat_user`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 socket_study.room_chat 구조 내보내기
CREATE TABLE IF NOT EXISTS `room_chat` (
  `room_title` varchar(50) NOT NULL,
  `chat_user` varchar(30) NOT NULL,
  KEY `FK_room_chat_user` (`chat_user`),
  CONSTRAINT `FK_room_chat_user` FOREIGN KEY (`chat_user`) REFERENCES `user` (`user_nickname`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

-- 테이블 socket_study.user 구조 내보내기
CREATE TABLE IF NOT EXISTS `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(20) NOT NULL,
  `user_password` varchar(128) NOT NULL,
  `user_nickname` varchar(30) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_role` varchar(50) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `user_nickname` (`user_nickname`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- 내보낼 데이터가 선택되어 있지 않습니다.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
