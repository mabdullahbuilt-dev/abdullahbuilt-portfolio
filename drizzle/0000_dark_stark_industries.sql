CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_inquiries_created_at` ON `inquiries` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_inquiries_email_created_at` ON `inquiries` (`email`,`created_at`);