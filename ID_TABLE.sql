
-- 자동 값 증가 AUTO_INCREMENT
-- Table structure for table `ID_TABLE`
--
 
CREATE TABLE `ID_TABLE` (
  `id` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `Pnumber` varchar(12),
  PRIMARY KEY (`id`)
);
 
--
-- Dumping data for table `TABLE`
--
 
INSERT INTO `ID_TABLE` VALUES ('abc','abc123','홍길동','123abc@gmail.com','01012341234');
INSERT INTO `ID_TABLE` VALUES ('def','def456','김길동','456def@gmail.com','01045674567');
INSERT INTO `ID_TABLE` VALUES ('ghi','ghi789','박길동','789ghi@gmail.com','01089018901');
INSERT INTO `ID_TABLE` VALUES ('guest','gue012','이길동','012gue@gmail.com',"01034563456");
INSERT INTO `ID_TABLE` VALUES ('user','use345','최길동','345use@gmail.com',"01078907890");
