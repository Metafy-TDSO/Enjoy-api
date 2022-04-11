-- CreateTable
CREATE TABLE `tbl_criador` (
    `id_criador` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `vl_avaliacao` INTEGER NULL,
    `dt_criacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_mudanca` DATETIME(0) NOT NULL,

    INDEX `idx_criador_usuario_id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_criador`, `id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_evento` (
    `id_evento` INTEGER NOT NULL AUTO_INCREMENT,
    `ds_nome` VARCHAR(191) NOT NULL,
    `ds_descricao` VARCHAR(255) NOT NULL,
    `vl_avaliacao` TINYINT NULL,
    `dt_inicio` DATETIME(0) NOT NULL,
    `dt_fim` DATETIME(0) NOT NULL,
    `id_criador` INTEGER NOT NULL,
    `dt_criacao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_mudanca` DATETIME(0) NOT NULL,
    `lc_localizacao` GEOMETRY NOT NULL,

    INDEX `idx_evento_id_criador`(`id_criador`),
    INDEX `idx_evento_localizacao`(`lc_localizacao`),
    PRIMARY KEY (`id_evento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_usuario` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `ds_nome` VARCHAR(72) NOT NULL,
    `ds_email` VARCHAR(255) NOT NULL,
    `dt_nascimento` DATE NOT NULL,
    `ds_senha` VARCHAR(72) NOT NULL,
    `im_avatar_url` VARCHAR(200) NULL,
    `nr_telefone` VARCHAR(11) NOT NULL,
    `dt_criacao` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_mudanca` DATETIME(0) NOT NULL,

    UNIQUE INDEX `ds_email_unique`(`ds_email`),
    INDEX `ds_nome`(`ds_nome`),
    INDEX `ds_email`(`ds_email`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_usuario_evento` (
    `id_usuario` INTEGER NOT NULL,
    `id_evento` INTEGER NOT NULL,
    `dt_criacao` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `dt_mudanca` DATETIME(0) NOT NULL,

    INDEX `idx_usuario_evento_id_evento`(`id_evento`),
    INDEX `idx_usuario_evento_id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_usuario`, `id_evento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_criador` ADD CONSTRAINT `fk_criador_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_evento` ADD CONSTRAINT `fk_evento_criador` FOREIGN KEY (`id_criador`) REFERENCES `tbl_criador`(`id_criador`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `tbl_usuario_evento` ADD CONSTRAINT `fk_evento_usuario` FOREIGN KEY (`id_evento`) REFERENCES `tbl_evento`(`id_evento`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_usuario_evento` ADD CONSTRAINT `fk_usuario_evento` FOREIGN KEY (`id_usuario`) REFERENCES `tbl_usuario`(`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;
