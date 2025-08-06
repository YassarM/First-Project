-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 06, 2025 at 01:08 PM
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
-- Database: `poinix`
--

-- --------------------------------------------------------

--
-- Table structure for table `asisten`
--

CREATE TABLE `asisten` (
  `id_asisten` int(11) NOT NULL,
  `id_juri` int(11) DEFAULT NULL,
  `id_asisten_juri` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `asisten`
--

INSERT INTO `asisten` (`id_asisten`, `id_juri`, `id_asisten_juri`) VALUES
(1, 4, 7);

-- --------------------------------------------------------

--
-- Table structure for table `graded`
--

CREATE TABLE `graded` (
  `id_graded` int(11) NOT NULL,
  `id_peserta` int(11) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `nilai` int(11) DEFAULT NULL,
  `id_juri` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graded`
--

INSERT INTO `graded` (`id_graded`, `id_peserta`, `status`, `nilai`, `id_juri`) VALUES
(1, 1, 'Locked', NULL, 4),
(2, 2, 'Locked', NULL, 4);

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(100) DEFAULT NULL,
  `prioritas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `prioritas`) VALUES
(11, 'PBB Murni', 1),
(12, 'Variasi', 2);

-- --------------------------------------------------------

--
-- Table structure for table `motion`
--

CREATE TABLE `motion` (
  `id_motion` int(11) NOT NULL,
  `motion` varchar(255) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `id_score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `motion`
--

INSERT INTO `motion` (`id_motion`, `motion`, `id_kategori`, `id_score`) VALUES
(3, 'Hormat', 11, 7),
(4, 'Jalan Jalan', 11, 10),
(5, 'AJGIEIG', 12, 11),
(8, 'ghsj', 12, 14),
(9, '13516', 12, 15);

-- --------------------------------------------------------

--
-- Table structure for table `nilai`
--

CREATE TABLE `nilai` (
  `id_nilai` int(11) NOT NULL,
  `nilai` int(11) NOT NULL,
  `id_peserta` int(11) NOT NULL,
  `id_juri` int(11) NOT NULL,
  `id_motion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nilai`
--

INSERT INTO `nilai` (`id_nilai`, `nilai`, `id_peserta`, `id_juri`, `id_motion`) VALUES
(1, 8, 1, 4, 3),
(2, 3, 1, 4, 4),
(3, 8, 1, 4, 3),
(4, 3, 1, 4, 4),
(5, 3, 1, 4, 5),
(6, 33, 1, 4, 8),
(7, 0, 1, 4, 9),
(8, 8, 1, 4, 3),
(9, 3, 1, 4, 4),
(10, 3, 1, 4, 5),
(11, 33, 1, 4, 8),
(12, 0, 1, 4, 9),
(13, 9, 2, 4, 3),
(14, 4, 2, 4, 4),
(15, 9, 2, 4, 3),
(16, 4, 2, 4, 4),
(17, 1, 2, 4, 5),
(18, 1, 2, 4, 8),
(19, 123, 2, 4, 9);

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `id_note` int(11) NOT NULL,
  `id_peserta` int(11) DEFAULT NULL,
  `id_asisten` int(11) DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`id_note`, `id_peserta`, `id_asisten`, `note`) VALUES
(1, 1, 7, 'Apapun dah'),
(2, 2, 7, 'LHfgyagfaguiqeghf');

-- --------------------------------------------------------

--
-- Table structure for table `peserta`
--

CREATE TABLE `peserta` (
  `id_peserta` int(11) NOT NULL,
  `nama_peserta` varchar(100) DEFAULT NULL,
  `sekolah` varchar(100) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `status` enum('aktif','tidak aktif') DEFAULT 'aktif',
  `id_pelatih` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peserta`
--

INSERT INTO `peserta` (`id_peserta`, `nama_peserta`, `sekolah`, `logo`, `status`, `id_pelatih`) VALUES
(1, 'sekola1', 'sekolah1', '1754435663153-WIN_20250611_22_19_32_Pro.jpg', 'aktif', 3),
(2, 'Sekolah2', 'sekolah2', '1754477027295-WIN_20250611_22_19_29_Pro.jpg', 'aktif', 8);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id_roles` int(11) NOT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id_roles`, `role`) VALUES
(1, 'Admin'),
(2, 'Panitia'),
(3, 'Pelatih'),
(4, 'Juri'),
(5, 'Asjur'),
(6, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `score`
--

CREATE TABLE `score` (
  `id_score` int(11) NOT NULL,
  `1st` varchar(50) DEFAULT NULL,
  `2nd` varchar(50) DEFAULT NULL,
  `3th` varchar(50) DEFAULT NULL,
  `4th` varchar(50) DEFAULT NULL,
  `5th` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `score`
--

INSERT INTO `score` (`id_score`, `1st`, `2nd`, `3th`, `4th`, `5th`) VALUES
(7, '9', '8', '7', '6', '5'),
(8, '1', '2', '3', '4', '5'),
(9, '1', '2', '3', '4', '5'),
(10, '1', '2', '3', '4', '5'),
(11, '1', '2', '3', '6', ''),
(12, '1', '2', '3', '0', ''),
(13, '1', '2', '3', '0', ''),
(14, '1', '2', '33', '44', '55'),
(15, '123', '', '32', '123', '');

-- --------------------------------------------------------

--
-- Table structure for table `server`
--

CREATE TABLE `server` (
  `id` int(11) NOT NULL,
  `key_name` varchar(100) DEFAULT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` int(11) NOT NULL,
  `expires` int(11) DEFAULT NULL,
  `data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `id_role` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'Inactive',
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `username`, `password`, `id_role`, `status`, `date`) VALUES
(2, 'Yassar', '$2b$10$BZBKx6wQm/vUDEYIeSA.muh8c//Xa0x0K/tLNq9ff9BKX3f5uiKU.', 1, 'Active', '2025-08-03 17:32:05'),
(3, 'SOmefn', '$2b$10$G140zMptH.P2nvLvrk822u0jVVx5Am1aLKVDUQs8wXQsmcfVWngiG', 3, 'Active', '2025-08-06 06:13:43'),
(4, 'Jury', '$2b$10$N5T8tGUP6Se7p5RTPN14b.9ut12Jn95k3B4oFxZoDXBwGgkJzRW2m', 4, 'Active', '2025-08-06 16:10:24'),
(7, 'Yss', '$2b$10$FcY9.ljdO/LZ0U/wb.8D7.iTqEvi3zGWAzg97lk9BS9CE/1C0I44y', 5, 'Inactive', '2025-08-06 17:04:57'),
(8, 'Bla bla', '$2b$10$RxIUnxrbKmLXnBmKX35wXuYHr9tDgKpm3dKwM/gS0aC0ZJ/CA/n5q', 3, 'Inactive', '2025-08-06 17:43:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asisten`
--
ALTER TABLE `asisten`
  ADD PRIMARY KEY (`id_asisten`),
  ADD KEY `id_pelatih` (`id_juri`);

--
-- Indexes for table `graded`
--
ALTER TABLE `graded`
  ADD PRIMARY KEY (`id_graded`),
  ADD KEY `id_peserta` (`id_peserta`),
  ADD KEY `id_juri` (`id_juri`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `motion`
--
ALTER TABLE `motion`
  ADD PRIMARY KEY (`id_motion`);

--
-- Indexes for table `nilai`
--
ALTER TABLE `nilai`
  ADD PRIMARY KEY (`id_nilai`);

--
-- Indexes for table `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id_note`),
  ADD KEY `id_peserta` (`id_peserta`),
  ADD KEY `id_juri` (`id_asisten`);

--
-- Indexes for table `peserta`
--
ALTER TABLE `peserta`
  ADD PRIMARY KEY (`id_peserta`),
  ADD KEY `id_pelatih` (`id_pelatih`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_roles`);

--
-- Indexes for table `score`
--
ALTER TABLE `score`
  ADD PRIMARY KEY (`id_score`);

--
-- Indexes for table `server`
--
ALTER TABLE `server`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asisten`
--
ALTER TABLE `asisten`
  MODIFY `id_asisten` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `graded`
--
ALTER TABLE `graded`
  MODIFY `id_graded` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `motion`
--
ALTER TABLE `motion`
  MODIFY `id_motion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `nilai`
--
ALTER TABLE `nilai`
  MODIFY `id_nilai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `notes`
  MODIFY `id_note` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `peserta`
--
ALTER TABLE `peserta`
  MODIFY `id_peserta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id_roles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `score`
--
ALTER TABLE `score`
  MODIFY `id_score` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `server`
--
ALTER TABLE `server`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asisten`
--
ALTER TABLE `asisten`
  ADD CONSTRAINT `asisten_ibfk_1` FOREIGN KEY (`id_juri`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `graded`
--
ALTER TABLE `graded`
  ADD CONSTRAINT `graded_ibfk_1` FOREIGN KEY (`id_peserta`) REFERENCES `peserta` (`id_peserta`),
  ADD CONSTRAINT `graded_ibfk_2` FOREIGN KEY (`id_juri`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`id_peserta`) REFERENCES `peserta` (`id_peserta`),
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`id_asisten`) REFERENCES `users` (`id_user`);

--
-- Constraints for table `peserta`
--
ALTER TABLE `peserta`
  ADD CONSTRAINT `peserta_ibfk_1` FOREIGN KEY (`id_pelatih`) REFERENCES `users` (`id_user`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
