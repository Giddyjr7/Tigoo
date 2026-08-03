-- Manual schema migration applied directly to Neon (project: Tigo, calm-meadow-23687557).
-- Not run automatically: spring.jpa.hibernate.ddl-auto=validate and there is no Flyway/Liquibase
-- in this project, so the schema is managed by hand. This file is a record of what was applied;
-- re-run it (or the individual statements) against any new branch/environment that needs it.
-- All statements are idempotent (IF NOT EXISTS) and safe to re-run.

-- Missing foreign-key-column indexes.
-- Each of these FK columns was previously either the *non-leading* column of a composite
-- index (so a btree index can't serve lookups on it alone) or had no index at all. Without
-- an index, deleting/updating the referenced parent row (users, posts, tags) forces Postgres
-- to sequentially scan the child table to enforce the foreign key.
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments (author_id);
CREATE INDEX IF NOT EXISTS idx_claps_user ON claps (user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_post ON saved_posts (post_id);
CREATE INDEX IF NOT EXISTS idx_hidden_posts_post ON hidden_posts (post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags (tag_id);

-- Trigram support for the leading-wildcard search in PostRepository.findFeed
-- ("LOWER(p.title) LIKE :search" / "LOWER(p.content) LIKE :search" with '%term%' patterns).
-- A plain btree index can't serve a leading-wildcard LIKE, so these queries were doing a full
-- table scan on title/content. gin_trgm_ops indexes on the same lower(...) expression used by
-- the query let Postgres use the index for '%term%' matches.
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm ON posts USING gin (lower(title) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_posts_content_trgm ON posts USING gin (lower(content) gin_trgm_ops);
