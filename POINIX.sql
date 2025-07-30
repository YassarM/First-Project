-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 22, 2025 at 07:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kemal`
--

-- --------------------------------------------------------

--
-- Table structure for table `daton`
--

CREATE TABLE `daton` (
  `id_daton` int(11) NOT NULL,
  `daton_name` varchar(255) DEFAULT NULL,
  `id_score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daton`
--

INSERT INTO `daton` (`id_daton`, `daton_name`, `id_score`) VALUES
(1, 'smthn', 10),
(2, 'wakwaw', 11);

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`) VALUES
(1, 'Danton'),
(2, 'PBB Murni'),
(3, 'Variasi Formasi');

-- --------------------------------------------------------

--
-- Table structure for table `nilai`
--

CREATE TABLE `nilai` (
  `id_nilai` int(11) NOT NULL,
  `id_juri` int(11) DEFAULT NULL,
  `id_peserta` int(11) DEFAULT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `total_nilai` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `nilai_juri`
--

CREATE TABLE `nilai_juri` (
  `id_juri` int(11) NOT NULL,
  `juri_1` int(11) DEFAULT NULL,
  `juri_2` int(11) DEFAULT NULL,
  `juri_3` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pbb_murni`
--

CREATE TABLE `pbb_murni` (
  `id_pbb_murni` int(11) NOT NULL,
  `nama_gerakan` varchar(255) DEFAULT NULL,
  `id_score` int(11) NOT NULL,
  `id_server` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pbb_murni`
--

INSERT INTO `pbb_murni` (`id_pbb_murni`, `nama_gerakan`, `id_score`, `id_server`) VALUES
(1, 'Hormat', 1, 1),
(2, 'Something', 2, 1),
(4, 'Poki', 4, 1),
(7, 'bla bla', 7, 1),
(8, 'agyaefgaunga', 12, 1);

-- --------------------------------------------------------

--
-- Table structure for table `peserta`
--

CREATE TABLE `peserta` (
  `id_peserta` int(11) NOT NULL,
  `nama_peserta` varchar(255) DEFAULT NULL,
  `sekolah` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `id_juri` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peserta`
--

INSERT INTO `peserta` (`id_peserta`, `nama_peserta`, `sekolah`, `logo`, `status`, `id_juri`) VALUES
(1, 'satu', 'sekolah_satu', 'satu.jpg', 'ungraded', NULL),
(2, 'dua', 'sekolah_dua', 'dua.jpg', 'ungraded', NULL),
(3, 'tiga', 'sekolah_tiga', 'tiga.jpg', 'ungraded', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `real_password`
--

CREATE TABLE `real_password` (
  `id_password` int(11) NOT NULL,
  `real_password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `real_password`
--

INSERT INTO `real_password` (`id_password`, `real_password`) VALUES
(16, '123'),
(17, '123'),
(18, '123'),
(19, '123'),
(20, '123'),
(21, '123'),
(22, '321'),
(23, '123'),
(24, '321'),
(25, '123'),
(26, 'qwe'),
(27, '123'),
(28, 'ky'),
(29, '213'),
(30, '123'),
(31, '123'),
(32, '123'),
(33, '213'),
(34, 'qwe'),
(35, '123'),
(36, '123'),
(37, '123'),
(38, '123'),
(39, '123'),
(40, '123');

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `id_score` int(11) NOT NULL,
  `1st` int(11) NOT NULL DEFAULT 0,
  `2nd` int(11) NOT NULL DEFAULT 0,
  `3th` int(11) NOT NULL DEFAULT 0,
  `4th` int(11) NOT NULL DEFAULT 0,
  `5th` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `score`
--

INSERT INTO `score` (`id_score`, `1st`, `2nd`, `3th`, `4th`, `5th`) VALUES
(1, 1, 2, 3, 4, 5),
(2, 2, 3, 4, 5, 1),
(4, 1, 2, 3, 4, 5),
(5, 0, 0, 0, 0, 0),
(6, 0, 0, 0, 0, 0),
(7, 52, 12, 0, 0, 0),
(9, 0, 0, 69, 0, 0),
(10, 80, 70, 48, 37, 0),
(11, 50, 60, 70, 69, 0),
(12, 0, 15, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `server`
--

CREATE TABLE `server` (
  `id_server` int(11) NOT NULL,
  `nama_event` varchar(255) NOT NULL,
  `start_date_event` date NOT NULL DEFAULT current_timestamp(),
  `end_date_event` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `server`
--

INSERT INTO `server` (`id_server`, `nama_event`, `start_date_event`, `end_date_event`) VALUES
(1, 'PBB', '2025-07-18', '2025-07-18');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id_session` int(11) NOT NULL,
  `session_name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `id_password` int(11) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Inactive',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`, `role`, `id_password`, `status`, `date`) VALUES
(38, 'Yassar', '$2b$10$gZ/378D3BporeWEUDExShu4v1IUpCpaxyOt5IexiVJuhSaeYTW2Zy', 'Admin', 16, 'Inactive', '2025-07-18 00:00:00'),
(39, 'Kemal', '$2b$10$vZZvkRul0ERN7dZw.vAUIei9SnnMMRgwCBKO7V0FFBtkAm75aybEW', 'Admin', 17, 'Inactive', '2025-07-18 00:00:00'),
(40, 'Xhuzis', '$2b$10$ZNeXkQyuhxq9.GBlpZ6AveC4ubaz75nvsYDgVpJQk4tohFsZgwRv.', 'Panitia', 18, 'Inactive', '2025-07-18 00:00:00'),
(41, 'Yss', '$2b$10$FUt9Q4Vs9uosOzyRhERUJ.TmkLm/5cySkTrqmICFUi4RpQOuFdYk2', 'Pelatih', 19, 'Active', '2025-07-18 00:00:00'),
(43, 'Jury', '$2b$10$Z2OzNT555nDNkMXJvXC6eO1/SaJjL1RmWRCx2X7UscycYujPwBYXS', 'Juri', 21, 'Active', '2025-07-18 00:00:00'),
(44, 'ciaw', '$2b$10$n08y49mPgGR47dnb31VIq./iHSU69sbk0IJgi/Cz3xyDuZbmTQZLu', 'Guest', 22, 'Inactive', '2025-07-18 00:00:00'),
(45, 'qwe', '$2b$10$Zs2nrv87u.X7W2jQNqM1guLewPUnfFQvgNn90SsWwkpbJIpZNZ0la', 'Guest', 23, 'Inactive', '2025-07-18 00:00:00'),
(46, 'ewq', '$2b$10$2pB8khTe3w.WA9R1NR1oPe/1.tyc/Sd4S96s0en2YzfqEOvAZySBe', 'Guest', 24, 'Inactive', '2025-07-18 00:00:00'),
(47, 'asd', '$2b$10$Xvz994QSwkxmB3GtAf4CQuW1tr91owsoTn4Bh7MYMx8JyDVf9p216', 'Guest', 25, 'Inactive', '2025-07-18 00:00:00'),
(48, 'dsa', '$2b$10$MO7VP.SFBHP6MTVeIiLiGuQ68XZ29ySqqFtB7RLXk9yrXMl3SNVr.', 'Guest', 26, 'Inactive', '2025-07-18 00:00:00'),
(49, 'fds', '$2b$10$Oe/SwvFdKTE7xRQBJyjT/.WwXu7vXnxgU8BCj6JdzGpGr0MHk4L4W', 'Guest', 27, 'Inactive', '2025-07-18 00:00:00'),
(50, 'kg', '$2b$10$WbVBV7oYyBkd7drnPRyJIOJ.7DVzWOyJfdq6v8tWOs0LW3r7zfx0.', 'Guest', 28, 'Inactive', '2025-07-18 00:00:00'),
(51, 'afsd', '$2b$10$QXw35IM1xpIjLT57GRewAudxD5BCflabGTz5l4IJqatAgVLGvZn0m', 'Guest', 29, 'Inactive', '2025-07-18 00:00:00'),
(53, 'shsgjs', '$2b$10$naPinpNyON1AYhR4U67Sgexlgqq/QY1c5d4jayWRydLshFZ3P8116', 'Guest', 31, 'Inactive', '2025-07-18 00:00:00'),
(54, '12eqsad', '$2b$10$Dp82jvPi1A84vZ32VSUO/Oxjtkc8wmT9E0E8ljExLH/XSJF/nIEt2', 'Guest', 32, 'Inactive', '2025-07-18 00:00:00'),
(55, '123wqe', '$2b$10$SCTsO1vIfHNhUeMO280jPeBMZZJZHfp74xa2ioKN/D5AchX6IHIGm', 'Guest', 33, 'Inactive', '2025-07-18 00:00:00'),
(56, 'asfgaete', '$2b$10$.uKpMEc1/JgHReSx7/TvPeK2J7HrV/b.QLz1jDK1w1Qdrw.HEUwbm', 'Guest', 34, 'Inactive', '2025-07-18 00:00:00'),
(58, 'ashe', '$2b$10$nyOcTgQ58SbcpYNJHEGqA.IcpZRXeXIMa2HONRxHwl4GQHwYegBrW', 'Guest', 36, 'Inactive', '2025-07-18 00:00:00'),
(60, 'Rui', '$2b$10$WZsQ4zLRAiiU/A82vPS.ceqcxTQ4NUIkyG9DJ8/F.nVgbHU5XBbvO', 'Admin', 38, 'Inactive', '2025-07-19 00:00:00'),
(61, 'afsaf', '$2b$10$vMwbji8VcZV6JJXNFqohdefB0NdnUwzYvzTyFvpgxMh8YS6tH1a9.', 'Juri', 39, 'Inactive', '2025-07-19 00:00:00'),
(62, '1231', '$2b$10$cnSLOtP2.WchJIlIWMYu9u7TKLm12JgTDk28P/0Vt65gR1DF2Y/Pm', 'Juri', 40, 'Inactive', '2025-07-19 16:00:19');

-- --------------------------------------------------------

--
-- Table structure for table `variation_formation`
--

CREATE TABLE `variation_formation` (
  `id_variation` int(11) NOT NULL,
  `variation_name` varchar(255) DEFAULT NULL,
  `id_score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `variation_formation`
--

INSERT INTO `variation_formation` (`id_variation`, `variation_name`, `id_score`) VALUES
(2, 'something', 9);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daton`
--
ALTER TABLE `daton`
  ADD PRIMARY KEY (`id_daton`),
  ADD KEY `fk_daton_score` (`id_score`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `nilai`
--
ALTER TABLE `nilai`
  ADD PRIMARY KEY (`id_nilai`),
  ADD KEY `fk_nilai_dari_juri` (`id_juri`),
  ADD KEY `fk_nilai_perserta` (`id_peserta`),
  ADD KEY `fk_nilai_kategori` (`id_kategori`);

--
-- Indexes for table `nilai_juri`
--
ALTER TABLE `nilai_juri`
  ADD PRIMARY KEY (`id_juri`);

--
-- Indexes for table `pbb_murni`
--
ALTER TABLE `pbb_murni`
  ADD PRIMARY KEY (`id_pbb_murni`),
  ADD KEY `fk_id_score` (`id_score`),
  ADD KEY `fk_id_server` (`id_server`);

--
-- Indexes for table `peserta`
--
ALTER TABLE `peserta`
  ADD PRIMARY KEY (`id_peserta`),
  ADD KEY `fk_nilai_juri` (`id_juri`);

--
-- Indexes for table `real_password`
--
ALTER TABLE `real_password`
  ADD PRIMARY KEY (`id_password`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id_score`);

--
-- Indexes for table `server`
--
ALTER TABLE `server`
  ADD PRIMARY KEY (`id_server`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `fk_real_password` (`id_password`);

--
-- Indexes for table `variation_formation`
--
ALTER TABLE `variation_formation`
  ADD PRIMARY KEY (`id_variation`),
  ADD KEY `fk_variation_score` (`id_score`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daton`
--
ALTER TABLE `daton`
  MODIFY `id_daton` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `nilai`
--
ALTER TABLE `nilai`
  MODIFY `id_nilai` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `nilai_juri`
--
ALTER TABLE `nilai_juri`
  MODIFY `id_juri` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pbb_murni`
--
ALTER TABLE `pbb_murni`
  MODIFY `id_pbb_murni` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `peserta`
--
ALTER TABLE `peserta`
  MODIFY `id_peserta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `real_password`
--
ALTER TABLE `real_password`
  MODIFY `id_password` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `id_score` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `server`
--
ALTER TABLE `server`
  MODIFY `id_server` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `variation_formation`
--
ALTER TABLE `variation_formation`
  MODIFY `id_variation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `daton`
--
ALTER TABLE `daton`
  ADD CONSTRAINT `fk_daton_score` FOREIGN KEY (`id_score`) REFERENCES `score` (`id_score`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `nilai`
--
ALTER TABLE `nilai`
  ADD CONSTRAINT `fk_nilai_dari_juri` FOREIGN KEY (`id_juri`) REFERENCES `nilai_juri` (`id_juri`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nilai_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_nilai_perserta` FOREIGN KEY (`id_peserta`) REFERENCES `peserta` (`id_peserta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pbb_murni`
--
ALTER TABLE `pbb_murni`
  ADD CONSTRAINT `fk_id_score` FOREIGN KEY (`id_score`) REFERENCES `score` (`id_score`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_server` FOREIGN KEY (`id_server`) REFERENCES `server` (`id_server`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `peserta`
--
ALTER TABLE `peserta`
  ADD CONSTRAINT `fk_nilai_juri` FOREIGN KEY (`id_juri`) REFERENCES `nilai_juri` (`id_juri`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_real_password` FOREIGN KEY (`id_password`) REFERENCES `real_password` (`id_password`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `variation_formation`
--
ALTER TABLE `variation_formation`
  ADD CONSTRAINT `fk_variation_score` FOREIGN KEY (`id_score`) REFERENCES `score` (`id_score`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
