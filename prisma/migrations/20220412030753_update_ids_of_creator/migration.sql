/*
  Warnings:

  - The primary key for the `tbl_criador` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `tbl_criador` DROP PRIMARY KEY,
    ADD PRIMARY KEY (`id_criador`);
