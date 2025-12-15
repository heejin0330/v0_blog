-- =============================================
-- WatchBlogger AI - Migration 010
-- Create views (뷰)
-- =============================================

-- 생성 기록 상세 뷰
CREATE OR REPLACE VIEW v_generation_details AS
SELECT 
  gh.id,
  gh.user_id,
  gh.model_name_input,
  gh.model_alias,
  gh.generated_title,
  gh.generated_content,
  gh.meta_description,
  gh.tags,
  gh.word_count,
  gh.seo_score,
  gh.status,
  gh.wp_post_id,
  gh.wp_post_url,
  gh.wp_post_status,
  gh.created_at,
  gh.completed_at,
  t.name as template_name,
  t.slug as template_slug,
  wm.brand as watch_brand,
  wm.reference_number as watch_reference,
  (
    SELECT json_agg(json_build_object(
      'id', ci.id,
      'source_url', ci.source_url,
      'download_url', ci.download_url,
      'alt_text', ci.alt_text
    ) ORDER BY ci.display_order)
    FROM collected_images ci
    WHERE ci.generation_id = gh.id
  ) as images
FROM generation_history gh
LEFT JOIN templates t ON gh.template_id = t.id
LEFT JOIN watch_models wm ON gh.watch_model_id = wm.id;

-- 사용자 통계 뷰
CREATE OR REPLACE VIEW v_user_stats AS
SELECT 
  u.id as user_id,
  u.email,
  u.name,
  u.created_at as user_created_at,
  (SELECT COUNT(*) FROM generation_history WHERE user_id = u.id) as total_generations,
  (SELECT COUNT(*) FROM generation_history WHERE user_id = u.id AND status = 'completed') as completed_generations,
  (SELECT COUNT(*) FROM generation_history WHERE user_id = u.id AND wp_post_id IS NOT NULL) as wp_posts_created,
  (SELECT MAX(created_at) FROM generation_history WHERE user_id = u.id) as last_generation_at,
  (SELECT AVG(word_count) FROM generation_history WHERE user_id = u.id AND status = 'completed') as avg_word_count,
  (SELECT AVG(seo_score) FROM generation_history WHERE user_id = u.id AND status = 'completed') as avg_seo_score,
  ws.is_connected as wp_connected
FROM users u
LEFT JOIN wp_settings ws ON u.id = ws.user_id;

-- 인기 시계 모델 뷰
CREATE OR REPLACE VIEW v_popular_watch_models AS
SELECT 
  wm.*,
  COUNT(gh.id) as generation_count,
  MAX(gh.created_at) as last_used_at
FROM watch_models wm
LEFT JOIN generation_history gh ON wm.id = gh.watch_model_id
GROUP BY wm.id
ORDER BY generation_count DESC, last_used_at DESC NULLS LAST;
