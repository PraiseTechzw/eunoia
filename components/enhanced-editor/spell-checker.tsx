"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { Check, AlertCircle } from "lucide-react"

interface SpellCheckerProps {
  text: string
  onCorrect: (correctedText: string) => void
}

interface SpellingError {
  word: string
  index: number
  suggestions: string[]
}

export function SpellChecker({ text, onCorrect }: SpellCheckerProps) {
  const [errors, setErrors] = useState<SpellingError[]>([])
  const [currentError, setCurrentError] = useState<number>(0)
  const [isChecking, setIsChecking] = useState(true)
  const { t } = useTranslation()

  // Simulate spell checking
  useEffect(() => {
    if (!text) {
      setErrors([])
      return
    }

    // This is a mock implementation
    // In a real app, this would call a spell checking API
    const mockCheck = () => {
      setIsChecking(true)

      setTimeout(() => {
        // Find some common spelling mistakes as an example
        const commonMistakes = [
          { word: "teh", correct: "the" },
          { word: "recieve", correct: "receive" },
          { word: "seperate", correct: "separate" },
          { word: "definately", correct: "definitely" },
          { word: "accomodate", correct: "accommodate" },
          { word: "occured", correct: "occurred" },
          { word: "neccessary", correct: "necessary" },
          { word: "wierd", correct: "weird" },
          { word: "alot", correct: "a lot" },
          { word: "untill", correct: "until" },
        ]

        const foundErrors: SpellingError[] = []

        commonMistakes.forEach((mistake) => {
          let index = text.toLowerCase().indexOf(mistake.word)
          while (index !== -1) {
            // Check if it's a whole word
            const prevChar = index > 0 ? text[index - 1] : " "
            const nextChar = index + mistake.word.length < text.length ? text[index + mistake.word.length] : " "

            if (/\s/.test(prevChar) && /\s/.test(nextChar)) {
              foundErrors.push({
                word: text.substring(index, index + mistake.word.length),
                index,
                suggestions: [mistake.correct, ...generateRandomSuggestions(mistake.correct)],
              })
            }

            index = text.toLowerCase().indexOf(mistake.word, index + 1)
          }
        })

        // Sort errors by their position in the text
        foundErrors.sort((a, b) => a.index - b.index)

        setErrors(foundErrors)
        setCurrentError(foundErrors.length > 0 ? 0 : -1)
        setIsChecking(false)
      }, 1000)
    }

    mockCheck()
  }, [text])

  // Generate random suggestions for demo purposes
  const generateRandomSuggestions = (correctWord: string): string[] => {
    const suggestions = [
      correctWord + "s",
      correctWord + "ed",
      correctWord + "ing",
      correctWord.charAt(0).toUpperCase() + correctWord.slice(1),
    ]

    return suggestions.slice(0, 3)
  }

  // Replace the current error with the selected suggestion
  const replaceError = (suggestion: string) => {
    if (currentError < 0 || currentError >= errors.length) return

    const error = errors[currentError]
    const newText = text.substring(0, error.index) + suggestion + text.substring(error.index + error.word.length)

    onCorrect(newText)

    // Move to the next error
    if (currentError < errors.length - 1) {
      setCurrentError(currentError + 1)
    } else {
      // No more errors
      setErrors([])
      setCurrentError(-1)
    }
  }

  // Skip the current error
  const skipError = () => {
    if (currentError < errors.length - 1) {
      setCurrentError(currentError + 1)
    } else {
      // No more errors
      setErrors([])
      setCurrentError(-1)
    }
  }

  // Ignore all instances of the current error
  const ignoreAll = () => {
    if (currentError < 0 || currentError >= errors.length) return

    const error = errors[currentError]
    const newErrors = errors.filter((e) => e.word.toLowerCase() !== error.word.toLowerCase())

    setErrors(newErrors)

    if (newErrors.length > 0) {
      setCurrentError(0)
    } else {
      setCurrentError(-1)
    }
  }

  if (isChecking) {
    return (
      <div className="border-t p-2 flex items-center justify-center text-sm text-muted-foreground">
        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
        {t("editor.spellChecker.checking")}
      </div>
    )
  }

  if (errors.length === 0) {
    return (
      <div className="border-t p-2 flex items-center justify-center text-sm text-green-600 dark:text-green-400">
        <Check className="mr-2 h-4 w-4" />
        {t("editor.spellChecker.noErrors")}
      </div>
    )
  }

  const currentErrorData = errors[currentError]

  return (
    <div className="border-t p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-amber-600 dark:text-amber-400">
          <AlertCircle className="mr-2 h-4 w-4" />
          <span className="font-medium">
            {t("editor.spellChecker.errorFound", {
              current: currentError + 1,
              total: errors.length,
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={skipError}>
            {t("editor.spellChecker.skip")}
          </Button>
          <Button variant="ghost" size="sm" onClick={ignoreAll}>
            {t("editor.spellChecker.ignoreAll")}
          </Button>
        </div>
      </div>

      <div className="p-2 bg-muted/50 rounded-md">
        <p className="text-sm">
          <span>{text.substring(Math.max(0, currentErrorData.index - 20), currentErrorData.index)}</span>
          <span className="bg-amber-200 dark:bg-amber-900 px-1 rounded">{currentErrorData.word}</span>
          <span>
            {text.substring(
              currentErrorData.index + currentErrorData.word.length,
              Math.min(text.length, currentErrorData.index + currentErrorData.word.length + 20),
            )}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {currentErrorData.suggestions.map((suggestion, index) => (
          <Button key={index} variant="outline" size="sm" onClick={() => replaceError(suggestion)}>
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  )
}

