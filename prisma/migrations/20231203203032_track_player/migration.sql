-- AlterTable
ALTER TABLE `steam_player_bans` ADD COLUMN `track` BOOLEAN NOT NULL DEFAULT true AFTER `note`;
