/*
  Warnings:

  - Added the required column `ds_url_imagem` to the `tbl_evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_evento` ADD COLUMN `ds_url_imagem` VARCHAR(255) NOT NULL;
