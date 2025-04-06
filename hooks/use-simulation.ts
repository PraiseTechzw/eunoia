"use client"

import { useState, useCallback, useEffect } from "react"
import { simulationService } from "@/lib/simulation-service"
import { useToast } from "@/hooks/use-toast"

/**
 * Custom hook for simulating API calls with realistic behavior
 *
 * This hook provides loading states, error handling, and simulated
 * network behavior to make the demo feel like a real application.
 *
 * @param serviceKey - The service to use (auth, entries, ai, etc.)
 * @param serviceFunction - The function to call on the service
 * @param immediate - Whether to call the function immediately
 * @param initialArgs - Initial arguments to pass to the function
 */
export function useSimulation<T, Args extends any[]>(
  serviceKey: keyof typeof simulationService,
  serviceFunction: string,
  immediate = false,
  initialArgs: Args = [] as unknown as Args,
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(immediate)
  const [error, setError] = useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  // Get the service and function
  const service = simulationService[serviceKey]
  const func = service[serviceFunction as keyof typeof service] as (...args: Args) => Promise<T>

  // Function to call the service
  const callService = useCallback(
    async (...args: Args) => {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)

      try {
        const result = await func(...args)
        setData(result)
        setIsSuccess(true)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)

        // Show error toast
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })

        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [func, toast],
  )

  // Call the function immediately if requested
  useEffect(() => {
    if (immediate) {
      callService(...initialArgs).catch(() => {
        // Error is already handled in callService
      })
    }
  }, [immediate, callService, initialArgs])

  return {
    data,
    isLoading,
    error,
    isSuccess,
    execute: callService,
    reset: useCallback(() => {
      setData(null)
      setIsLoading(false)
      setError(null)
      setIsSuccess(false)
    }, []),
  }
}

