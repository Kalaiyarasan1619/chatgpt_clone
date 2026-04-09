package com.quickgpt_backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Older rows stored page_id as varchar (e.g. "home"). The entity now uses Integer.
 * This migrates the column to INTEGER so /api/chat/history can load without JDBC errors.
 */
@Component
@Order(0)
public class ChatPageIdSchemaMigration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(ChatPageIdSchemaMigration.class);
    private final JdbcTemplate jdbcTemplate;

    public ChatPageIdSchemaMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            String dataType = jdbcTemplate.query(
                """
                    SELECT data_type FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'chat' AND column_name = 'page_id'
                    LIMIT 1
                    """,
                rs -> {
                    if (!rs.next()) {
                        return null;
                    }
                    return rs.getString(1);
                }
            );
            if (dataType == null) {
                return;
            }
            if ("integer".equalsIgnoreCase(dataType)
                    || "bigint".equalsIgnoreCase(dataType)
                    || "smallint".equalsIgnoreCase(dataType)) {
                return;
            }
            if (!"character varying".equalsIgnoreCase(dataType) && !"text".equalsIgnoreCase(dataType)) {
                log.warn("chat.page_id has unexpected type {}, skipping automatic migration", dataType);
                return;
            }
            jdbcTemplate.execute(
                """
                    UPDATE chat SET page_id = '1'
                    WHERE page_id IS NULL
                       OR trim(both from cast(page_id as text)) = ''
                       OR trim(both from cast(page_id as text)) !~ '^[0-9]+$'
                    """
            );
            jdbcTemplate.execute("ALTER TABLE chat ALTER COLUMN page_id DROP DEFAULT");
            jdbcTemplate.execute(
                """
                    ALTER TABLE chat ALTER COLUMN page_id TYPE INTEGER USING (
                        CASE WHEN trim(both from cast(page_id as text)) ~ '^[0-9]+$'
                            THEN cast(trim(both from cast(page_id as text)) AS integer)
                            ELSE 1 END
                    )
                    """
            );
            jdbcTemplate.execute("ALTER TABLE chat ALTER COLUMN page_id SET DEFAULT 1");
            log.info("Migrated chat.page_id from {} to INTEGER", dataType);
        } catch (Exception e) {
            log.warn("Chat page_id schema migration skipped: {}", e.getMessage());
        }
    }
}
