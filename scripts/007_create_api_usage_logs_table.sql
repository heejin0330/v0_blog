-- =============================================
-- WatchBlogger AI - Migration 007
-- Create api_usage_logs table (API 사용 로그)
-- =============================================

CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- 요청 정보
  endpoint VARCHAR(100) NOT NULL,
  request_payload JSONB,
  response_status INTEGER,
  
  -- 리소스 사용량
  tokens_used INTEGER DEFAULT 0,
  execution_time_ms INTEGER DEFAULT 0,
  
  -- 클라이언트 정보
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_id ON api_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_created_at ON api_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_logs_user_date ON api_usage_logs(user_id, created_at DESC);

-- 파티셔닝을 위한 준비 (향후 데이터 증가 시)
-- 로그 테이블은 RLS 없이 서버 사이드에서만 관리
