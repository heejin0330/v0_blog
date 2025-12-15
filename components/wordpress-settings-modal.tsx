"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Settings, Loader2, CheckCircle2, XCircle, ExternalLink } from "lucide-react"

interface WordPressSettingsModalProps {
  trigger?: React.ReactNode
  onSave?: (settings: WordPressSettings) => void
}

interface WordPressSettings {
  siteUrl: string
  username: string
  appPassword: string
}

export function WordPressSettingsModal({ trigger, onSave }: WordPressSettingsModalProps) {
  const [open, setOpen] = useState(false)
  const [settings, setSettings] = useState<WordPressSettings>({
    siteUrl: "",
    username: "",
    appPassword: "",
  })
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [isEnvConfigured, setIsEnvConfigured] = useState(false)
  const [isLoadingSettings, setIsLoadingSettings] = useState(false)

  // .env 설정 확인 및 로드
  useEffect(() => {
    if (open) {
      loadEnvSettings()
    }
  }, [open])

  const loadEnvSettings = async () => {
    setIsLoadingSettings(true)
    try {
      const response = await fetch("/api/wordpress/get-settings")
      if (response.ok) {
        const data = await response.json()
        if (data.hasEnvSettings) {
          setIsEnvConfigured(true)
          setSettings({
            siteUrl: data.siteUrl || "",
            username: data.username || "",
            appPassword: "", // 보안상 appPassword는 서버에서만 사용
          })
          // .env 설정이 있으면 자동으로 연결 테스트
          await handleTestWithEnv()
        } else {
          setIsEnvConfigured(false)
          // localStorage에서 기존 설정 로드
          const saved = localStorage.getItem("wp_settings")
          if (saved) {
            setSettings(JSON.parse(saved))
          }
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      setIsEnvConfigured(false)
    } finally {
      setIsLoadingSettings(false)
    }
  }

  const handleTestWithEnv = async () => {
    setTestStatus("testing")
    setErrorMessage("")

    try {
      const response = await fetch("/api/wordpress/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // .env 설정이 있으면 빈 객체 전송 (서버에서 .env 사용)
        body: JSON.stringify({}),
      })

      if (response.ok) {
        setTestStatus("success")
      } else {
        const data = await response.json()
        setErrorMessage(data.error || "연결에 실패했습니다.")
        setTestStatus("error")
      }
    } catch {
      setErrorMessage("연결 테스트 중 오류가 발생했습니다.")
      setTestStatus("error")
    }
  }

  const handleTest = async () => {
    // .env 설정이 있으면 자동으로 테스트
    if (isEnvConfigured) {
      handleTestWithEnv()
      return
    }

    if (!settings.siteUrl || !settings.username || !settings.appPassword) {
      setErrorMessage("모든 필드를 입력해주세요.")
      setTestStatus("error")
      return
    }

    setTestStatus("testing")
    setErrorMessage("")

    try {
      const response = await fetch("/api/wordpress/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        setTestStatus("success")
      } else {
        const data = await response.json()
        setErrorMessage(data.error || "연결에 실패했습니다.")
        setTestStatus("error")
      }
    } catch {
      setErrorMessage("연결 테스트 중 오류가 발생했습니다.")
      setTestStatus("error")
    }
  }

  const handleSave = () => {
    // .env 설정이 있으면 저장할 필요 없음 (자동으로 사용됨)
    if (isEnvConfigured) {
      onSave?.({
        siteUrl: settings.siteUrl,
        username: settings.username,
        appPassword: "", // .env에서 사용하므로 빈 값
      })
      setOpen(false)
      return
    }

    if (testStatus !== "success") {
      setErrorMessage("먼저 연결 테스트를 완료해주세요.")
      return
    }

    // Save to localStorage for now (will be replaced with DB later)
    localStorage.setItem("wp_settings", JSON.stringify(settings))
    onSave?.(settings)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
            <span className="sr-only">워드프레스 설정</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">워드프레스 연동 설정</DialogTitle>
          <DialogDescription>
            {isEnvConfigured
              ? ".env 파일에서 설정을 자동으로 불러왔습니다. 연결 테스트를 진행합니다."
              : "워드프레스 사이트 정보를 입력하세요. 앱 비밀번호는 워드프레스 관리자 페이지에서 생성할 수 있습니다."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoadingSettings ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Site URL */}
              <div className="space-y-2">
                <Label htmlFor="siteUrl">사이트 URL</Label>
                <Input
                  id="siteUrl"
                  placeholder="https://yourblog.com"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  disabled={isEnvConfigured}
                  className={isEnvConfigured ? "bg-muted" : ""}
                />
                {isEnvConfigured && (
                  <p className="text-xs text-muted-foreground">.env 파일에서 자동으로 설정되었습니다.</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">사용자명</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  disabled={isEnvConfigured}
                  className={isEnvConfigured ? "bg-muted" : ""}
                />
                {isEnvConfigured && (
                  <p className="text-xs text-muted-foreground">.env 파일에서 자동으로 설정되었습니다.</p>
                )}
              </div>

              {/* App Password */}
              {!isEnvConfigured && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="appPassword">앱 비밀번호</Label>
                    <a
                      href="https://wordpress.org/documentation/article/application-passwords/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-accent hover:underline"
                    >
                      앱 비밀번호 생성 방법
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <Input
                    id="appPassword"
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                    value={settings.appPassword}
                    onChange={(e) => setSettings({ ...settings, appPassword: e.target.value })}
                  />
                </div>
              )}
              {isEnvConfigured && (
                <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  앱 비밀번호는 .env 파일에서 자동으로 사용됩니다.
                </div>
              )}
            </>
          )}

          {/* Status Message */}
          {testStatus === "success" && (
            <div className="flex items-center gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              연결 성공! 워드프레스와 정상적으로 연결되었습니다.
            </div>
          )}

          {testStatus === "error" && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <XCircle className="h-4 w-4" />
              {errorMessage}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          {!isEnvConfigured && (
            <Button variant="outline" onClick={handleTest} disabled={testStatus === "testing"} className="bg-transparent">
              {testStatus === "testing" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  테스트 중...
                </>
              ) : (
                "연결 테스트"
              )}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={!isEnvConfigured && testStatus !== "success"}
            className="bg-primary text-primary-foreground"
          >
            {isEnvConfigured ? "확인" : "저장하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
