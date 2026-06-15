CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`conversationId` varchar(64) NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`context` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `frequent_journeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`originLatitude` decimal(10,8) NOT NULL,
	`originLongitude` decimal(11,8) NOT NULL,
	`originLabel` varchar(255),
	`destinationLatitude` decimal(10,8) NOT NULL,
	`destinationLongitude` decimal(11,8) NOT NULL,
	`destinationLabel` varchar(255),
	`tripCount` int DEFAULT 1,
	`lastUsed` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `frequent_journeys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journeys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`routeId` int,
	`status` enum('planned','in_progress','completed','cancelled') DEFAULT 'planned',
	`plannedStartTime` timestamp,
	`actualStartTime` timestamp,
	`plannedEndTime` timestamp,
	`actualEndTime` timestamp,
	`currentLatitude` decimal(10,8),
	`currentLongitude` decimal(11,8),
	`currentSegmentIndex` int DEFAULT 0,
	`actualDurationMinutes` int,
	`actualCostInRupees` decimal(8,2),
	`delayMinutes` int DEFAULT 0,
	`co2SavedGrams` decimal(10,2) DEFAULT '0',
	`greenPointsEarned` int DEFAULT 0,
	`rating` int,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journeys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`originLatitude` decimal(10,8) NOT NULL,
	`originLongitude` decimal(11,8) NOT NULL,
	`originAddress` text,
	`destinationLatitude` decimal(10,8) NOT NULL,
	`destinationLongitude` decimal(11,8) NOT NULL,
	`destinationAddress` text,
	`durationMinutes` int NOT NULL,
	`costInRupees` decimal(8,2) NOT NULL,
	`co2EmissionsGrams` decimal(10,2) NOT NULL,
	`transferCount` int DEFAULT 0,
	`modes` varchar(255) NOT NULL,
	`segments` json,
	`safetyScore` decimal(3,2),
	`comfortScore` decimal(3,2),
	`womenSafeIndicator` boolean DEFAULT false,
	`isFavorite` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `routes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `safety_incidents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`area` varchar(255),
	`incidentType` varchar(100) NOT NULL,
	`severity` enum('low','medium','high') DEFAULT 'medium',
	`description` text,
	`transportMode` varchar(50),
	`timeOfDay` varchar(50),
	`reportCount` int DEFAULT 1,
	`verified` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `safety_incidents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `safety_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`gridResolution` varchar(50) DEFAULT '500m',
	`transportMode` varchar(50) NOT NULL,
	`timeOfDay` varchar(50) NOT NULL,
	`dayOfWeek` varchar(20),
	`score` decimal(3,2) NOT NULL,
	`womenSafeScore` decimal(3,2),
	`incidentCount` int DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `safety_scores_id` PRIMARY KEY(`id`),
	CONSTRAINT `safety_scores_unique` UNIQUE(`latitude`)
);
--> statement-breakpoint
CREATE TABLE `saved_places` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`label` varchar(255) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`address` text,
	`placeId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `saved_places_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transit_status` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` varchar(100) NOT NULL,
	`serviceName` varchar(255) NOT NULL,
	`serviceType` varchar(50) NOT NULL,
	`status` enum('operational','delayed','cancelled','disrupted') DEFAULT 'operational',
	`delayMinutes` int DEFAULT 0,
	`crowdLevel` enum('low','moderate','high','very_high') DEFAULT 'moderate',
	`alert` text,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp,
	CONSTRAINT `transit_status_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalGreenPoints` int DEFAULT 0,
	`totalGreenCoins` decimal(10,2) DEFAULT '0',
	`currentStreak` int DEFAULT 0,
	`longestStreak` int DEFAULT 0,
	`lastStreakDate` timestamp,
	`badges` json,
	`totalJourneysCompleted` int DEFAULT 0,
	`totalCo2Saved` decimal(12,2) DEFAULT '0',
	`leaderboardRank` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_rewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_rewards_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `preferredLanguage` varchar(10) DEFAULT 'en';--> statement-breakpoint
ALTER TABLE `users` ADD `theme` enum('light','dark') DEFAULT 'light';--> statement-breakpoint
CREATE INDEX `chat_messages_userId_idx` ON `chat_messages` (`userId`);--> statement-breakpoint
CREATE INDEX `chat_messages_conversationId_idx` ON `chat_messages` (`conversationId`);--> statement-breakpoint
CREATE INDEX `frequent_journeys_userId_idx` ON `frequent_journeys` (`userId`);--> statement-breakpoint
CREATE INDEX `journeys_userId_idx` ON `journeys` (`userId`);--> statement-breakpoint
CREATE INDEX `journeys_status_idx` ON `journeys` (`status`);--> statement-breakpoint
CREATE INDEX `journeys_createdAt_idx` ON `journeys` (`createdAt`);--> statement-breakpoint
CREATE INDEX `routes_userId_idx` ON `routes` (`userId`);--> statement-breakpoint
CREATE INDEX `routes_createdAt_idx` ON `routes` (`createdAt`);--> statement-breakpoint
CREATE INDEX `safety_incidents_location_idx` ON `safety_incidents` (`latitude`);--> statement-breakpoint
CREATE INDEX `safety_incidents_createdAt_idx` ON `safety_incidents` (`createdAt`);--> statement-breakpoint
CREATE INDEX `saved_places_userId_idx` ON `saved_places` (`userId`);--> statement-breakpoint
CREATE INDEX `transit_status_serviceId_idx` ON `transit_status` (`serviceId`);--> statement-breakpoint
CREATE INDEX `transit_status_status_idx` ON `transit_status` (`status`);--> statement-breakpoint
CREATE INDEX `user_rewards_userId_idx` ON `user_rewards` (`userId`);--> statement-breakpoint
CREATE INDEX `user_rewards_leaderboard_idx` ON `user_rewards` (`totalGreenPoints`);