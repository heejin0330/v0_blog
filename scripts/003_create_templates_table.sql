-- =============================================
-- WatchBlogger AI - Migration 003
-- Create templates table (포스팅 템플릿)
-- =============================================

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL이면 시스템 템플릿
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  structure JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_is_system ON templates(is_system);

-- updated_at 트리거
CREATE TRIGGER trigger_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- 시스템 템플릿은 모두 읽기 가능, 커스텀 템플릿은 본인만
CREATE POLICY "Anyone can read system templates"
  ON templates FOR SELECT
  USING (is_system = true OR user_id = auth.uid());

CREATE POLICY "Users can manage own templates"
  ON templates FOR ALL
  USING (user_id = auth.uid());
