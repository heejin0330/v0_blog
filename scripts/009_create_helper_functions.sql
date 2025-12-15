-- =============================================
-- WatchBlogger AI - Migration 009
-- Create helper functions (유틸리티 함수)
-- =============================================

-- 글자 수 계산 함수 (공백 제외)
CREATE OR REPLACE FUNCTION count_words_no_space(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN LENGTH(REGEXP_REPLACE(content, '\s', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 시계 모델 검색 함수
CREATE OR REPLACE FUNCTION search_watch_models(search_query TEXT, limit_count INTEGER DEFAULT 10)
RETURNS SETOF watch_models AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM watch_models
  WHERE 
    to_tsvector('english', brand || ' ' || model_name || ' ' || COALESCE(reference_number, '')) 
    @@ plainto_tsquery('english', search_query)
    OR brand ILIKE '%' || search_query || '%'
    OR model_name ILIKE '%' || search_query || '%'
    OR reference_number ILIKE '%' || search_query || '%'
    OR search_query = ANY(search_keywords)
  ORDER BY 
    CASE 
      WHEN reference_number ILIKE search_query THEN 1
      WHEN model_name ILIKE search_query || '%' THEN 2
      ELSE 3
    END,
    last_fetched_at DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- 사용자별 일일 생성 횟수 확인 함수 (Rate Limiting용)
CREATE OR REPLACE FUNCTION get_user_daily_generation_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  count_result INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count_result
  FROM generation_history
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day';
  
  RETURN count_result;
END;
$$ LANGUAGE plpgsql STABLE;

-- 최근 생성 기록 조회 함수
CREATE OR REPLACE FUNCTION get_recent_generations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  model_name_input VARCHAR,
  model_alias VARCHAR,
  generated_title VARCHAR,
  template_name VARCHAR,
  status generation_status,
  word_count INTEGER,
  wp_post_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    gh.id,
    gh.model_name_input,
    gh.model_alias,
    gh.generated_title,
    t.name as template_name,
    gh.status,
    gh.word_count,
    gh.wp_post_url,
    gh.created_at
  FROM generation_history gh
  LEFT JOIN templates t ON gh.template_id = t.id
  WHERE gh.user_id = p_user_id
  ORDER BY gh.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
