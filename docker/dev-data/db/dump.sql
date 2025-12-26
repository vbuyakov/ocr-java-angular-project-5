CREATE TABLE IF NOT EXISTS `topics`
(
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `topics` (`name`) VALUES
('Angular'),
('DevOps'),
('Android Development'),
('iOS Development'),
('Node.js'),
('Cloud Computing');