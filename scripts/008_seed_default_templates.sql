-- =============================================
-- WatchBlogger AI - Migration 008
-- Seed default templates (기본 템플릿 데이터)
-- =============================================

-- 기존 시스템 템플릿 삭제 후 재생성
DELETE FROM templates WHERE is_system = true;

-- 템플릿 A: 상세 리뷰형
INSERT INTO templates (name, slug, description, structure, is_default, is_system) VALUES (
  '상세 리뷰형',
  'detailed-review',
  '신제품 리뷰, 상세 분석에 적합한 템플릿입니다. 디자인부터 스펙, 착용감까지 꼼꼼하게 다룹니다.',
  '{
    "type": "detailed_review",
    "sections": [
      {
        "id": "intro",
        "title": "소개",
        "description": "시계 모델에 대한 전반적인 소개와 첫인상",
        "required": true,
        "minWords": 100
      },
      {
        "id": "design",
        "title": "디자인 및 외관",
        "description": "케이스, 베젤, 다이얼, 핸즈, 브레이슬릿 상세 분석",
        "required": true,
        "minWords": 200,
        "subSections": ["케이스 & 베젤", "다이얼 & 핸즈", "브레이슬릿 & 스트랩"]
      },
      {
        "id": "specs",
        "title": "상세 스펙",
        "description": "기술적 사양 테이블 형태로 정리",
        "required": true,
        "minWords": 100,
        "includeTable": true
      },
      {
        "id": "movement",
        "title": "무브먼트",
        "description": "칼리버 정보, 정확도, 파워리저브 등",
        "required": true,
        "minWords": 150
      },
      {
        "id": "wearing",
        "title": "착용감 및 실사용 후기",
        "description": "실제 착용 시 느낌, 무게감, 편의성",
        "required": false,
        "minWords": 100
      },
      {
        "id": "price",
        "title": "가격 및 구매 정보",
        "description": "정가, 시세, 구매처 정보",
        "required": true,
        "minWords": 100
      },
      {
        "id": "conclusion",
        "title": "결론",
        "description": "총평 및 추천 대상",
        "required": true,
        "minWords": 100
      }
    ],
    "minWordCount": 1000,
    "maxWordCount": 3000,
    "seoKeywords": ["리뷰", "스펙", "가격", "착용감"]
  }'::jsonb,
  true,  -- 기본 선택
  true   -- 시스템 템플릿
);

-- 템플릿 B: 비교 분석형
INSERT INTO templates (name, slug, description, structure, is_default, is_system) VALUES (
  '비교 분석형',
  'comparison',
  '구매 가이드, 경쟁 모델 비교에 적합한 템플릿입니다. 장단점을 명확히 비교합니다.',
  '{
    "type": "comparison",
    "sections": [
      {
        "id": "intro",
        "title": "소개",
        "description": "비교 대상과 비교 목적 설명",
        "required": true,
        "minWords": 100
      },
      {
        "id": "overview",
        "title": "모델 개요",
        "description": "해당 모델의 기본 정보와 포지셔닝",
        "required": true,
        "minWords": 150
      },
      {
        "id": "competitors",
        "title": "경쟁 모델 비교",
        "description": "가격대가 비슷한 경쟁 모델들과의 비교",
        "required": true,
        "minWords": 250,
        "includeTable": true
      },
      {
        "id": "pros_cons",
        "title": "장단점 분석",
        "description": "객관적인 장점과 단점 정리",
        "required": true,
        "minWords": 200
      },
      {
        "id": "recommendation",
        "title": "추천 대상",
        "description": "어떤 사용자에게 적합한지 안내",
        "required": true,
        "minWords": 100
      },
      {
        "id": "conclusion",
        "title": "결론",
        "description": "최종 평가 및 구매 조언",
        "required": true,
        "minWords": 100
      }
    ],
    "minWordCount": 1000,
    "maxWordCount": 2500,
    "seoKeywords": ["비교", "vs", "장단점", "추천"]
  }'::jsonb,
  false,
  true
);

-- 템플릿 C: 히스토리형
INSERT INTO templates (name, slug, description, structure, is_default, is_system) VALUES (
  '히스토리형',
  'history',
  '스토리텔링, 컬렉터 대상 콘텐츠에 적합한 템플릿입니다. 브랜드와 모델의 역사를 깊이 있게 다룹니다.',
  '{
    "type": "history",
    "sections": [
      {
        "id": "intro",
        "title": "소개",
        "description": "모델의 상징성과 의미",
        "required": true,
        "minWords": 100
      },
      {
        "id": "brand_history",
        "title": "브랜드 역사",
        "description": "브랜드의 설립과 철학, 주요 이정표",
        "required": true,
        "minWords": 200
      },
      {
        "id": "model_origin",
        "title": "모델 탄생 배경",
        "description": "해당 모델이 만들어진 배경과 목적",
        "required": true,
        "minWords": 200
      },
      {
        "id": "evolution",
        "title": "진화 과정",
        "description": "세대별 변화와 개선점",
        "required": true,
        "minWords": 250
      },
      {
        "id": "current_model",
        "title": "현재 모델",
        "description": "현행 모델의 특징과 스펙",
        "required": true,
        "minWords": 150
      },
      {
        "id": "value",
        "title": "가치와 의미",
        "description": "컬렉터 가치, 시장에서의 위치",
        "required": true,
        "minWords": 100
      }
    ],
    "minWordCount": 1000,
    "maxWordCount": 3500,
    "seoKeywords": ["역사", "히스토리", "컬렉션", "클래식"]
  }'::jsonb,
  false,
  true
);
