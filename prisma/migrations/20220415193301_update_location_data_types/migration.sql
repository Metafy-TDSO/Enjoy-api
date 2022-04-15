/*
  Warnings:

  - You are about to drop the column `lc_localizacao` on the `tbl_evento` table. All the data in the column will be lost.
  - Added the required column `ds_endereco` to the `tbl_evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vl_latitude` to the `tbl_evento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vl_longitude` to the `tbl_evento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tbl_evento` DROP COLUMN `lc_localizacao`,
    ADD COLUMN `ds_endereco` MEDIUMTEXT NOT NULL,
    ADD COLUMN `vl_latitude` DECIMAL(11, 7) NOT NULL,
    ADD COLUMN `vl_longitude` DECIMAL(11, 7) NOT NULL;
