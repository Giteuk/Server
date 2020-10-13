
-- 자동 값 증가 AUTO_INCREMENT
-- Table structure for table `ID_TABLE`
--
 
CREATE TABLE `ID_TABLE` (
  `id` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `N_name` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `Pnumber` varchar(12),
  PRIMARY KEY (`id`)
);
 
--
-- Dumping data for table `TABLE`
--
 
INSERT INTO `ID_TABLE` VALUES ('abc','abc123','홍똥','홍길동','123abc@gmail.com','01012341234');
INSERT INTO `ID_TABLE` VALUES ('def','def456','김똥','김길동','456def@gmail.com','01045674567');
INSERT INTO `ID_TABLE` VALUES ('ghi','ghi789','박똥','박길동','789ghi@gmail.com','01089018901');
INSERT INTO `ID_TABLE` VALUES ('guest','gue012','이똥','이길동','012gue@gmail.com',"01034563456");
INSERT INTO `ID_TABLE` VALUES ('user','use345','최똥','최길동','345use@gmail.com',"01078907890");

-- 
-- Table structure for table `operator_TABLE`
--
 
CREATE TABLE `operator_TABLE` (
  `OP_id` varchar(30) NOT NULL,
  PRIMARY KEY (`OP_id`),
    FOREIGN KEY (`OP_id`) REFERENCES `ID_TABLE` (`id`)
);

--
-- Dumping data for table `operator_TABLE`
--

INSERT INTO `operator_TABLE` VALUES ('guest');
INSERT INTO `operator_TABLE` VALUES ('user');

--
-- Table structure for table `farm_TABLE`
--

CREATE TABLE `farm_TABLE` (
  `id` varchar(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `farm_TABLE`
--

INSERT INTO `farm_TABLE` VALUES ('1');
INSERT INTO `farm_TABLE` VALUES ('2');
INSERT INTO `farm_TABLE` VALUES ('3');
INSERT INTO `farm_TABLE` VALUES ('0');

--
-- Table structure for table `KEY_TABLE`
--
 
CREATE TABLE `KEY_TABLE` (
  `id` varchar(10) NOT NULL AUTO_INCREMENT,
  `value` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Dumping data for table `KEY_TABLE`
--

INSERT INTO `KEY_TABLE` VALUES ('1','20201013asdf');
INSERT INTO `KEY_TABLE` VALUES ('2','20201014qwer');
INSERT INTO `KEY_TABLE` VALUES ('3','20201015zxcv');
INSERT INTO `KEY_TABLE` VALUES ('4','20201016hjkl');
--임의의 key(더미레코드)

--
-- Table structure for table `user_F_TABLE`
--

CREATE TABLE `user_F_TABLE` ( 
  `U_id` varchar(10) NOT NULL,
  `F_id` varchar(30) NOT NULL,
  PRIMARY KEY (`U_id`,`F_id`),
  FOREIGN KEY (`U_id`) REFERENCES `ID_TABLE` (`id`),
  FOREIGN KEY (`F_id`) REFERENCES `farm_TABLE` (`id`)
);
 
--
-- Dumping data for table `user_F_TABLE`
--
 
INSERT INTO `user_F_TABLE` VALUES ('abc','1');
INSERT INTO `user_F_TABLE` VALUES ('abc','2');
INSERT INTO `user_F_TABLE` VALUES ('def','2');
INSERT INTO `user_F_TABLE` VALUES ('ghi','3');
INSERT INTO `user_F_TABLE` VALUES ('guest','0');
INSERT INTO `user_F_TABLE` VALUES ('user','0');

--
-- Table structure for table `KEY_F_TABLE`
--

CREATE TABLE `KEY_F_TABLE` (
  `K_id` varchar(10) NOT NULL,
  `F_id` varchar(30) NOT NULL,
  PRIMARY KEY (`K_id`,`F_id`),
  FOREIGN KEY (`K_id`) REFERENCES `KEY_TABLE` (`id`),
  FOREIGN KEY (`F_id`) REFERENCES `farm_TABLE` (`id`)
);

--
-- Dumping data for table `KEY_TABLE`
--

INSERT INTO `KEY_F_TABLE` VALUES ('1','2');
INSERT INTO `KEY_F_TABLE` VALUES ('2','3');
INSERT INTO `KEY_F_TABLE` VALUES ('3','1');
INSERT INTO `KEY_F_TABLE` VALUES ('4','0');