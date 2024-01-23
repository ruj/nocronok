/*
  Warnings:

  - A unique constraint covering the columns `[module,name]` on the table `config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `config_module_name_key` ON `config`(`module`, `name`);
