"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft, Copy, Check } from "lucide-react"

interface CodeBlockProps {
  value: string
  onChange: (value: string) => void
  onBack: () => void
}

export function CodeBlock({ value, onChange, onBack }: CodeBlockProps) {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
    { value: "bash", label: "Bash" },
    { value: "json", label: "JSON" },
    { value: "yaml", label: "YAML" },
    { value: "markdown", label: "Markdown" },
    { value: "plaintext", label: "Plain Text" },
  ]

  const handleInsert = () => {
    const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``
    onChange(value + codeBlock)
    onBack()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("editor.codeBlock.back")}
          </Button>
          <h3 className="text-lg font-medium">{t("editor.codeBlock.title")}</h3>
        </div>

        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("editor.codeBlock.selectLanguage")} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!code}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                {t("editor.codeBlock.copied")}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                {t("editor.codeBlock.copy")}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <pre className="border rounded-md p-4 bg-muted/50 overflow-auto max-h-[400px] min-h-[200px]">
          <code className={`language-${language}`}>
            <textarea
              className="w-full h-full bg-transparent resize-none focus:outline-none font-mono"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("editor.codeBlock.placeholder")}
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              data-gramm="false"
            />
          </code>
        </pre>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleInsert}>{t("editor.codeBlock.insert")}</Button>
      </div>
    </div>
  )
}

