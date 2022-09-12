-- DropForeignKey
ALTER TABLE `tbl_criador` DROP FOREIGN KEY `fk_criador_usuario`;

-- DropForeignKey
ALTER TABLE `tbl_evento` DROP FOREIGN KEY `fk_evento_criador`;

-- DropForeignKey
ALTER TABLE `tbl_usuario_evento` DROP FOREIGN KEY `fk_evento_usuario`;

-- DropForeignKey
ALTER TABLE `tbl_usuario_evento` DROP FOREIGN KEY `fk_usuario_evento`;
