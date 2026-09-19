CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`customerId` int NOT NULL,
	`supplierId` int,
	`assignedToId` int,
	`bookingNo` varchar(40) NOT NULL,
	`serviceType` varchar(80) NOT NULL,
	`destination` varchar(160),
	`status` enum('enquiry','quoted','negotiation','confirmed','ticketed','completed','cancelled') NOT NULL DEFAULT 'enquiry',
	`travelDate` timestamp,
	`quoteAmount` int NOT NULL DEFAULT 0,
	`costAmount` int NOT NULL DEFAULT 0,
	`paidAmount` int NOT NULL DEFAULT 0,
	`currency` varchar(8) NOT NULL DEFAULT 'BDT',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookings_bookingNo_unique` UNIQUE(`bookingNo`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`phone` varchar(32),
	`email` varchar(320),
	`passportNo` varchar(32),
	`status` enum('active','inactive','vip') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`customerId` int,
	`visaCaseId` int,
	`bookingId` int,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(700) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`mimeType` varchar(120) NOT NULL,
	`sizeBytes` int NOT NULL DEFAULT 0,
	`uploadedById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `financialEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`bookingId` int,
	`type` enum('income','expense','payment','refund') NOT NULL,
	`category` varchar(100) NOT NULL,
	`amount` int NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'BDT',
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financialEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `followUps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`customerId` int,
	`bookingId` int,
	`channel` enum('whatsapp','sms','email','call','internal') NOT NULL DEFAULT 'whatsapp',
	`status` enum('queued','sent','failed','done') NOT NULL DEFAULT 'queued',
	`dueAt` timestamp NOT NULL,
	`message` text NOT NULL,
	`createdById` int NOT NULL,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `followUps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`customerId` int NOT NULL,
	`bookingId` int,
	`invoiceNo` varchar(40) NOT NULL,
	`status` enum('draft','sent','partially_paid','paid','overdue','void') NOT NULL DEFAULT 'draft',
	`subtotal` int NOT NULL DEFAULT 0,
	`tax` int NOT NULL DEFAULT 0,
	`total` int NOT NULL DEFAULT 0,
	`dueAmount` int NOT NULL DEFAULT 0,
	`issueDate` timestamp NOT NULL DEFAULT (now()),
	`dueDate` timestamp,
	`notes` text,
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNo_unique` UNIQUE(`invoiceNo`)
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`supplierType` varchar(80) NOT NULL DEFAULT 'DMC',
	`contactPhone` varchar(32),
	`email` varchar(320),
	`status` enum('active','preferred','pending') NOT NULL DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `suppliers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','admin','agent','finance','operations') NOT NULL DEFAULT 'agent',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`timezone` varchar(64) NOT NULL DEFAULT 'Asia/Dhaka',
	`createdById` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `visaCases` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`customerId` int NOT NULL,
	`assignedToId` int,
	`applicationNo` varchar(40) NOT NULL,
	`country` varchar(100) NOT NULL,
	`visaType` varchar(100) NOT NULL,
	`status` enum('lead','documents_pending','in_review','submitted','approved','rejected','completed') NOT NULL DEFAULT 'lead',
	`appointmentDate` timestamp,
	`decisionDate` timestamp,
	`serviceFee` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `visaCases_id` PRIMARY KEY(`id`),
	CONSTRAINT `visaCases_applicationNo_unique` UNIQUE(`applicationNo`)
);
