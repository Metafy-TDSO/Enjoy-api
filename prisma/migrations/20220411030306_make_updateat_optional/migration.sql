-- AlterTable
ALTER TABLE `tbl_criador` MODIFY `dt_mudanca` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `tbl_evento` MODIFY `dt_mudanca` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `tbl_usuario` MODIFY `dt_mudanca` DATETIME(0) NULL;

-- AlterTable
ALTER TABLE `tbl_usuario_evento` MODIFY `dt_criacao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `dt_mudanca` DATETIME(0) NULL;
