/*
  Warnings:

  - A unique constraint covering the columns `[id_usuario]` on the table `tbl_criador` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tbl_criador_id_usuario_key` ON `tbl_criador`(`id_usuario`);
