-- =============================================
-- WatchBlogger AI - Migration 002
-- Create wp_settings table (워드프레스 연동 설정)
-- =============================================

CREATE TABLE IF NOT EXISTS wp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  site_url VARCHAR(500) NOT NULL,
  username VARCHAR(100) NOT NULL,
  app_password VARCHAR(255) NOT NULL, -- 암호화하여 저장
  is_connected BOOLEAN DEFAULT FALSE,
  last_tested_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_wp_settings_user_id ON wp_settings(user_id);

-- updated_at 트리거
CREATE TRIGGER trigger_wp_settings_updated_at
  BEFORE UPDATE ON wp_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE wp_settings ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 WP 설정만 관리 가능
CREATE POLICY "Users can manage own wp_settings"
  ON wp_settings FOR ALL
  USING (auth.uid() = user_id);
