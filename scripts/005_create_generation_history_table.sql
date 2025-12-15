-- =============================================
-- WatchBlogger AI - Migration 005
-- Create generation_history table (콘텐츠 생성 히스토리)
-- =============================================

-- 생성 상태 ENUM 타입
DO $$ BEGIN
  CREATE TYPE generation_status AS ENUM (
    'pending',      -- 대기 중
    'confirming',   -- 모델 확인 중
    'generating',   -- 콘텐츠 생성 중
    'saving',       -- WP 저장 중
    'completed',    -- 완료
    'failed'        -- 실패
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES templates(id),
  watch_model_id UUID REFERENCES watch_models(id), -- 캐시된 모델 참조 (선택)
  
  -- 입력 정보
  model_name_input VARCHAR(200) NOT NULL,
  model_alias VARCHAR(200),
  
  -- 생성된 콘텐츠
  generated_title VARCHAR(300),
  generated_content TEXT,
  meta_description VARCHAR(200),
  tags JSONB DEFAULT '[]',
  
  -- 콘텐츠 메트릭
  word_count INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  
  -- 워드프레스 연동 정보
  wp_post_id INTEGER,
  wp_post_url VARCHAR(500),
  wp_post_status VARCHAR(20), -- draft, publish 등
  
  -- 상태 관리
  status generation_status DEFAULT 'pending',
  error_message TEXT,
  
  -- 타임스탬프
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_generation_history_user_id ON generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_template_id ON generation_history(template_id);
CREATE INDEX IF NOT EXISTS idx_generation_history_status ON generation_history(status);
CREATE INDEX IF NOT EXISTS idx_generation_history_created_at ON generation_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_history_user_status ON generation_history(user_id, status);

-- RLS 활성화
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 생성 기록만 관리 가능
CREATE POLICY "Users can view own generation_history"
  ON generation_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation_history"
  ON generation_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation_history"
  ON generation_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generation_history"
  ON generation_history FOR DELETE
  USING (auth.uid() = user_id);
