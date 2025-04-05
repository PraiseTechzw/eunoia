"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"

// Define available languages
export type Language = "en" | "es" | "fr" | "de" | "ja" | "zh"

// Translation context
interface TranslationContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Translation provider component
export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Record<string, string>>({})

  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // In a real app, this would fetch translations from a JSON file or API
        // For this demo, we'll use a mock implementation
        const mockTranslations: Record<Language, Record<string, string>> = {
          en: {
            "app.name": "Eunoia Journal",
            "login.welcome": "Welcome back",
            "login.subtitle": "Sign in to your Eunoia Journal account",
            "login.tabs.email": "Email",
            "login.tabs.sso": "SSO",
            "login.form.email": "Email",
            "login.form.password": "Password",
            "login.form.forgot": "Forgot password?",
            "login.form.remember": "Remember me",
            "login.form.signIn": "Sign In",
            "login.form.signingIn": "Signing in...",
            "login.form.biometric": "Use Biometric Authentication",
            "login.social.title": "Single Sign-On",
            "login.social.description": "Connect with your organization's identity provider.",
            "login.social.google": "Continue with Google",
            "login.social.microsoft": "Continue with Microsoft",
            "login.social.apple": "Continue with Apple",
            "login.social.facebook": "Continue with Facebook",
            "login.social.twitter": "Continue with Twitter",
            "login.noAccount": "Don't have an account?",
            "login.signUp": "Sign up",
            "login.success.title": "Logged in successfully",
            "login.success.description": "Welcome back to Eunoia Journal!",
            "login.testimonial.quote":
              "Eunoia Journal has become an essential part of my daily routine. The insights I gain from my entries have been transformative.",
            "login.testimonial.author": "Alex Chen, Product Designer",

            "biometric.title": "Biometric Authentication",
            "biometric.description": "Use your fingerprint or face ID to sign in securely.",
            "biometric.instructions": "Place your finger on the sensor or look at the camera.",
            "biometric.scanning": "Scanning...",
            "biometric.tryAgain": "Authentication failed. Please try again.",
            "biometric.cancel": "Cancel",
            "biometric.retry": "Retry",
            "biometric.scan": "Scan",
            "biometric.simulateError": "Simulate Error",
            "biometric.error": "Authentication failed. Please try again.",

            "recovery.title": "Reset Your Password",
            "recovery.emailDescription": "Enter your email address and we'll send you a link to reset your password.",
            "recovery.emailLabel": "Email Address",
            "recovery.backToLogin": "Back to Login",
            "recovery.sending": "Sending...",
            "recovery.sendInstructions": "Send Instructions",
            "recovery.emailSent.title": "Check your email",
            "recovery.emailSent.description": "We've sent a password reset link to {email}",
            "recovery.verifyTitle": "Enter Verification Code",
            "recovery.verifyDescription": "Enter the 6-digit code sent to {email}",
            "recovery.codeLabel": "Verification Code",
            "recovery.codeHint": "The code is valid for 10 minutes",
            "recovery.back": "Back",
            "recovery.verifying": "Verifying...",
            "recovery.verify": "Verify Code",
            "recovery.invalidCode.title": "Invalid code",
            "recovery.invalidCode.description": "The code you entered is invalid or has expired.",
            "recovery.resetTitle": "Create New Password",
            "recovery.resetDescription":
              "Your password must be at least 8 characters long and include a mix of letters, numbers, and symbols.",
            "recovery.newPassword": "New Password",
            "recovery.confirmPassword": "Confirm Password",
            "recovery.resetting": "Resetting password...",
            "recovery.resetPassword": "Reset Password",
            "recovery.passwordMismatch.title": "Passwords don't match",
            "recovery.passwordMismatch.description": "Please make sure your passwords match.",
            "recovery.successTitle": "Password Reset Complete",
            "recovery.successDescription":
              "Your password has been reset successfully. You can now log in with your new password.",

            "editor.noContent": "No content to preview",
            "editor.showToolbar": "Show Toolbar",
            "editor.toolbar.bold": "Bold",
            "editor.toolbar.italic": "Italic",
            "editor.toolbar.underline": "Underline",
            "editor.toolbar.heading1": "Heading 1",
            "editor.toolbar.heading2": "Heading 2",
            "editor.toolbar.bulletList": "Bullet List",
            "editor.toolbar.numberedList": "Numbered List",
            "editor.toolbar.quote": "Quote",
            "editor.toolbar.code": "Code Block",
            "editor.toolbar.table": "Table",
            "editor.toolbar.embed": "Embed Media",
            "editor.toolbar.image": "Image",
            "editor.toolbar.video": "Video",
            "editor.toolbar.audio": "Audio",
            "editor.toolbar.map": "Map",
            "editor.toolbar.file": "File",
            "editor.toolbar.link": "Link",
            "editor.toolbar.alignLeft": "Align Left",
            "editor.toolbar.alignCenter": "Align Center",
            "editor.toolbar.alignRight": "Align Right",
            "editor.toolbar.spellCheck": "Spell Check",
            "editor.toolbar.aiAssist": "AI Assist",
            "editor.toolbar.fullscreen": "Fullscreen",
            "editor.toolbar.exitFullscreen": "Exit Fullscreen",
            "editor.toolbar.distractionFree": "Distraction Free",
            "editor.toolbar.write": "Write",
            "editor.toolbar.preview": "Preview",

            "editor.codeBlock.back": "Back",
            "editor.codeBlock.title": "Insert Code Block",
            "editor.codeBlock.selectLanguage": "Select Language",
            "editor.codeBlock.copy": "Copy",
            "editor.codeBlock.copied": "Copied!",
            "editor.codeBlock.placeholder": "Enter your code here...",
            "editor.codeBlock.insert": "Insert Code",

            "editor.tableEditor.back": "Back",
            "editor.tableEditor.title": "Insert Table",
            "editor.tableEditor.rows": "Rows",
            "editor.tableEditor.columns": "Columns",
            "editor.tableEditor.addRow": "Add Row",
            "editor.tableEditor.addColumn": "Add Column",
            "editor.tableEditor.removeRow": "Remove Row",
            "editor.tableEditor.removeColumn": "Remove Column",
            "editor.tableEditor.cancel": "Cancel",
            "editor.tableEditor.insert": "Insert Table",

            "editor.mediaEmbed.back": "Back",
            "editor.mediaEmbed.title": "Insert Media",
            "editor.mediaEmbed.image": "Image",
            "editor.mediaEmbed.video": "Video",
            "editor.mediaEmbed.audio": "Audio",
            "editor.mediaEmbed.map": "Map",
            "editor.mediaEmbed.file": "File",
            "editor.mediaEmbed.title": "Title",
            "editor.mediaEmbed.titlePlaceholder": "Enter a title for the media",
            "editor.mediaEmbed.url": "URL",
            "editor.mediaEmbed.urlPlaceholder": "Enter URL or embed code",
            "editor.mediaEmbed.uploadFile": "Upload File",
            "editor.mediaEmbed.upload": "Upload",
            "editor.mediaEmbed.embedCode": "Embed Code",
            "editor.mediaEmbed.embedPlaceholder": "Paste embed code here...",
            "editor.mediaEmbed.embedHelp": "For videos and maps, you can paste the embed code from the source website.",
            "editor.mediaEmbed.preview": "Preview",
            "editor.mediaEmbed.cancel": "Cancel",
            "editor.mediaEmbed.insert": "Insert Media",

            "editor.spellChecker.checking": "Checking spelling...",
            "editor.spellChecker.noErrors": "No spelling errors found",
            "editor.spellChecker.errorFound": "Spelling error {current} of {total}",
            "editor.spellChecker.skip": "Skip",
            "editor.spellChecker.ignoreAll": "Ignore All",
            "editor.spellChecker.tryAgain": "Try Again",

            "search.placeholder": "Search journal entries...",
            "search.filters": "Filters",
            "search.sort": "Sort",
            "search.aiSearch": "AI Search",
            "search.advancedFilters": "Advanced Filters",
            "search.results": "Results",
            "search.insights": "Insights",
            "search.related": "Related",
            "search.sentimentTimeline": "Sentiment Timeline",
            "search.wordCloud": "Word Cloud",
            "search.topicModeling": "Topic Modeling",
            "search.enterQuery": "Start typing to search your journal entries.",
            "search.noResults": "No entries found matching '{query}'",
            "search.topicEntries": "Entries in this topic",
            "search.noEntriesForTopic": "No entries found for this topic.",
            "search.relatedTo": "Related to entry:",
            "search.commonTopics": "Common topics",
            "search.noRelatedEntries": "No related entries found.",
            "search.noEntriesFound": "No entries found.",

            "search.filters.dateRange": "Date Range",
            "search.filters.sentiment": "Sentiment",
            "search.filters.negative": "Negative",
            "search.filters.neutral": "Neutral",
            "search.filters.positive": "Positive",
            "search.filters.contentType": "Content Type",
            "search.filters.hasImages": "Has Images",
            "search.filters.hasCode": "Has Code",
            "search.filters.hasLinks": "Has Links",
            "search.filters.hasTables": "Has Tables",
            "search.filters.tags": "Tags",
            "search.filters.excludeWords": "Exclude Words",
            "search.filters.excludeWordsPlaceholder": "Enter words to exclude, separated by commas",
            "search.filters.clearAll": "Clear All",
            "search.filters.applyFilters": "Apply Filters",

            "datePicker.selectRange": "Select date range",
          },
          es: {
            // Spanish translations would go here
            "app.name": "Eunoia Journal",
          },
          fr: {
            // French translations would go here
            "app.name": "Eunoia Journal",
          },
          de: {
            // German translations would go here
            "app.name": "Eunoia Journal",
          },
          ja: {
            // Japanese translations would go here
            "app.name": "Eunoia Journal",
          },
          zh: {
            // Chinese translations would go here
            "app.name": "Eunoia Journal",
          },
        }

        setTranslations(mockTranslations[language])
      } catch (error) {
        console.error("Failed to load translations:", error)
      }
    }

    loadTranslations()
  }, [language])

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[key] || key

    // Replace parameters in the translation string
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value)
      })
    }

    return translation
  }

  return <TranslationContext.Provider value={{ language, setLanguage, t }}>{children}</TranslationContext.Provider>
}

// Hook to use translations
export function useTranslation() {
  const context = useContext(TranslationContext)

  if (context === undefined) {
    // Provide a fallback if used outside of provider
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => key,
    }
  }

  return context
}

