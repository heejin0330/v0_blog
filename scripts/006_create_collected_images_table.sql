-- =============================================
-- WatchBlogger AI - Migration 006
-- Create collected_images table (수집된 이미지)
-- =============================================

CREATE TABLE IF NOT EXISTS collected_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES generation_history(id) ON DELETE CASCADE,
  
  -- 이미지 정보
  source_url VARCHAR(1000) NOT NULL,
  download_url VARCHAR(1000),
  alt_text VARCHAR(300),
  
  -- 이미지 메타데이터
  width INTEGER,
  height INTEGER,
  file_size INTEGER, -- bytes
  source_domain VARCHAR(200),
  
  -- 표시 순서
  display_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_collected_images_generation_id ON collected_images(generation_id);
CREATE INDEX IF NOT EXISTS idx_collected_images_display_order ON collected_images(generation_id, display_order);

-- RLS 활성화
ALTER TABLE collected_images ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 생성 기록에 연결된 이미지만 조회 가능
CREATE POLICY "Users can view images from own generations"
  ON collected_images FOR SELECT
  USING (
    generation_id IN (
      SELECT id FROM generation_history WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images to own generations"
  ON collected_images FOR INSERT
  WITH CHECK (
    generation_id IN (
      SELECT id FROM generation_history WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images from own generations"
  ON collected_images FOR DELETE
  USING (
    generation_id IN (
      SELECT id FROM generation_history WHERE user_id = auth.uid()
    )
  );
