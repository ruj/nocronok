-- CreateTable
CREATE TABLE `steam_player_bans` (
    `id` VARCHAR(191) NOT NULL,
    `note` VARCHAR(250) NULL,
    `community_ban` BOOLEAN NOT NULL DEFAULT false,
    `trade_ban` BOOLEAN NOT NULL DEFAULT false,
    `vac_ban` BOOLEAN NOT NULL DEFAULT false,
    `number_of_vac_bans` INTEGER NOT NULL DEFAULT 0,
    `game_ban` BOOLEAN NOT NULL DEFAULT false,
    `number_of_game_bans` INTEGER NOT NULL DEFAULT 0,
    `added_by` VARCHAR(191) NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `steam_player_bans_id_key`(`id`),
    INDEX `steam_player_bans_added_by_idx`(`added_by`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
