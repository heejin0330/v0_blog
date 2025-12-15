-- =============================================
-- WatchBlogger AI - Migration 004
-- Create watch_models table (시계 모델 캐시)
-- =============================================

CREATE TABLE IF NOT EXISTS watch_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand VARCHAR(100) NOT NULL,
  model_name VARCHAR(200) NOT NULL,
  reference_number VARCHAR(100),
  caliber VARCHAR(100),
  case_size VARCHAR(50),
  case_material VARCHAR(100),
  water_resistance VARCHAR(50),
  release_year INTEGER,
  msrp_usd DECIMAL(12, 2),
  msrp_krw DECIMAL(15, 0),
  specs JSONB DEFAULT '{}',
  search_keywords TEXT[] DEFAULT '{}',
  thumbnail_url VARCHAR(500),
  last_fetched_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_watch_models_brand ON watch_models(brand);
CREATE INDEX IF NOT EXISTS idx_watch_models_reference ON watch_models(reference_number);
CREATE INDEX IF NOT EXISTS idx_watch_models_model_name ON watch_models(model_name);
CREATE INDEX IF NOT EXISTS idx_watch_models_search ON watch_models USING GIN(search_keywords);

-- Full-text 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_watch_models_fts ON watch_models 
  USING GIN(to_tsvector('english', brand || ' ' || model_name || ' ' || COALESCE(reference_number, '')));

-- updated_at 트리거
CREATE TRIGGER trigger_watch_models_updated_at
  BEFORE UPDATE ON watch_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- watch_models는 공개 데이터이므로 RLS 없이 읽기 허용
-- 쓰기는 서버 사이드에서만 수행
