-- ─── Psicodinamica Sociale — DB schema ──────────────────────────────────────
-- Run once on IONOS MySQL: mysql -u USER -p DBNAME < api/schema.sql

CREATE TABLE IF NOT EXISTS slots (
    id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    slot_date  DATE          NOT NULL,
    slot_time  TIME          NOT NULL,
    is_booked  TINYINT(1)    NOT NULL DEFAULT 0,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_available (slot_date, is_booked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS bookings (
    id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    slot_id    INT UNSIGNED  NOT NULL,
    name       VARCHAR(200)  NOT NULL,
    email      VARCHAR(254)  NOT NULL,
    phone      VARCHAR(30)   NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contacts (
    id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name       VARCHAR(200)  NOT NULL,
    email      VARCHAR(254)  NOT NULL,
    phone      VARCHAR(30)   NOT NULL DEFAULT '',
    message    TEXT,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS applications (
    id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    name             VARCHAR(200)  NOT NULL,
    email            VARCHAR(254)  NOT NULL,
    phone            VARCHAR(30)   NOT NULL DEFAULT '',
    experience_years VARCHAR(50)   NOT NULL DEFAULT '',
    analysis_years   VARCHAR(50)   NOT NULL DEFAULT '',
    supervision      VARCHAR(50)   NOT NULL DEFAULT '',
    portfolio        VARCHAR(500)  NOT NULL DEFAULT '',
    message          TEXT,
    created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
