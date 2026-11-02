-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 02, 2026 at 12:48 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agribusiness_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `icon_class` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `icon_class`) VALUES
(1, 'Vegetables', 'fa-leaf'),
(2, 'Fruits', 'fa-apple-whole'),
(3, 'Grains', 'fa-wheat-awn'),
(4, 'Tubers', 'fa-carrot'),
(5, 'Dairy', 'fa-cow');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `subject` varchar(250) NOT NULL,
  `message` text NOT NULL,
  `status` enum('Unread','Read','Resolved') DEFAULT 'Unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `status`, `created_at`) VALUES
(1, 'Junior Mzungu', 'junioradamz357@gmail.com', 'Bulk onion inquiry', 'When can we get onions on the site', 'Unread', '2026-11-02 07:12:27');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(20) NOT NULL,
  `buyer_id` int(11) NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `delivery_address` text NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL DEFAULT 250.00,
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(30) DEFAULT 'mpesa',
  `status` varchar(50) DEFAULT 'placed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `buyer_id`, `recipient_name`, `delivery_address`, `subtotal`, `shipping_fee`, `total`, `payment_method`, `status`, `created_at`) VALUES
('ORD-2732', 3, 'Adam Mzungu', 'Nairobi', '450.00', '250.00', '700.00', 'mpesa', 'confirmed', '2026-10-29 05:17:13'),
('ORD-6109', 4, 'Michelle Janet ', 'Mombasa', '740.00', '250.00', '990.00', 'mpesa', 'dispatched', '2026-10-29 09:21:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` varchar(20) NOT NULL,
  `produce_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `produce_id`, `quantity`, `unit_price`) VALUES
(2, 'ORD-6109', 5, 2, '70.00'),
(3, 'ORD-6109', 4, 2, '150.00'),
(4, 'ORD-6109', 3, 3, '100.00');

-- --------------------------------------------------------

--
-- Table structure for table `produce`
--

CREATE TABLE `produce` (
  `id` int(11) NOT NULL,
  `farmer_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `category_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `stock` int(11) NOT NULL,
  `rating` decimal(2,1) DEFAULT 5.0,
  `image_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `produce`
--

INSERT INTO `produce` (`id`, `farmer_id`, `title`, `category_id`, `price`, `unit`, `stock`, `rating`, `image_url`, `description`, `is_approved`, `created_at`) VALUES
(3, 2, 'Kales', 1, '100.00', 'KG', 50, '5.0', 'https://agroduka.com/images/product/malkia.jpg', '', 1, '2026-10-29 06:24:11'),
(4, 2, 'Maize', 3, '150.00', 'KG', 300, '5.0', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO843fDo1GoWPmmWEfab7PTmbZ5AjM50NeSazz71-T8ArEa_mO5HIG17-v&s=10', 'Fresh maize. Great for different cooking recipes', 1, '2026-10-29 06:32:54'),
(5, 2, 'Potatoes', 4, '70.00', 'KG', 50, '5.0', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqdILJlRsmVEi5JVvFZuwoWGqxQt0kXqCA6VwCyYVNNQ&s=10', 'Fresh Potatoes for great cooks', 1, '2026-10-29 09:19:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('farmer','buyer','admin') NOT NULL DEFAULT 'buyer',
  `location` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `location`, `created_at`) VALUES
(1, 'System Administrator', 'admin@agriconnect.co.ke', '$2b$10$QRUm5c/dFxFbmBOlDmPpNOwALT4jbmGe.GklG/djs07e4H.Du70Oe', 'admin', 'Headquarters', '2026-10-29 02:44:18'),
(2, 'Kenneth Mzungu', 'juniormzungu3@gmail.com', '$2b$10$NyF1WwuH9uGAUiMaCc9FuuAlY1XnWqCebkTByBkiznSDYixw8JBki', 'farmer', 'Nairobi', '2026-10-29 05:11:39'),
(3, 'Adam Mzungu', 'adamken91@gmail.com', '$2b$10$clBIIqQAbArDyAZ2o.V20OvBqlGr1bQezIm1O29huot4mUlAPB2.K', 'buyer', 'Nairobi', '2026-10-29 05:17:02'),
(4, 'Michelle Janet ', 'janetmichell004@gmail.com', '$2b$10$UqvYhgPbuoHTHYDd/1JhmuQEBxk2xdl4HE0iBVsl.3hcVF0/iQlXe', 'buyer', 'Mombasa', '2026-10-29 09:14:22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `buyer_id` (`buyer_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `produce_id` (`produce_id`);

--
-- Indexes for table `produce`
--
ALTER TABLE `produce`
  ADD PRIMARY KEY (`id`),
  ADD KEY `farmer_id` (`farmer_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `produce`
--
ALTER TABLE `produce`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`produce_id`) REFERENCES `produce` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `produce`
--
ALTER TABLE `produce`
  ADD CONSTRAINT `produce_ibfk_1` FOREIGN KEY (`farmer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produce_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
