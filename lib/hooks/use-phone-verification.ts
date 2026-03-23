'use client'

import { useState, useCallback } from 'react'

export type PhoneVerificationState = 
  | 'idle'
  | 'sending'
  | 'sent'
  | 'verifying'
  | 'verified'
  | 'error'
  | 'cooldown'

interface UsePhoneVerificationOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function usePhoneVerification(options: UsePhoneVerificationOptions = {}) {
  const [state, setState] = useState<PhoneVerificationState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)
  const [lastFourDigits, setLastFourDigits] = useState<string | null>(null)

  // Start cooldown timer
  const startCooldown = useCallback((seconds: number) => {
    setCooldown(seconds)
    setState('cooldown')

    const interval = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setState('sent')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Send OTP
  const sendOtp = useCallback(async (phone: string, countryCode: string) => {
    try {
      setError(null)
      setState('sending')

      const res = await fetch('/api/auth/phone/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, countryCode }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 429 && data.cooldown) {
          startCooldown(data.cooldown)
          return { success: false, cooldown: data.cooldown }
        }
        throw new Error(data.error || 'Failed to send code')
      }

      setLastFourDigits(data.phone)
      setState('sent')
      startCooldown(60) // 60 second cooldown for resend

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setState('error')
      options.onError?.(message)
      return { success: false, error: message }
    }
  }, [options, startCooldown])

  // Verify OTP
  const verifyOtp = useCallback(async (code: string) => {
    try {
      setError(null)
      setState('verifying')

      const res = await fetch('/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setState('verified')
      options.onSuccess?.()

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setState('error')
      options.onError?.(message)
      return { success: false, error: message }
    }
  }, [options])

  // Resend OTP
  const resendOtp = useCallback(async (phone: string, countryCode: string) => {
    if (cooldown > 0) {
      return { success: false, error: `Wait ${cooldown} seconds` }
    }
    return sendOtp(phone, countryCode)
  }, [cooldown, sendOtp])

  // Reset state
  const reset = useCallback(() => {
    setState('idle')
    setError(null)
    setCooldown(0)
    setLastFourDigits(null)
  }, [])

  return {
    state,
    error,
    cooldown,
    lastFourDigits,
    isLoading: state === 'sending' || state === 'verifying',
    isCooldown: state === 'cooldown' || cooldown > 0,
    isVerified: state === 'verified',
    sendOtp,
    verifyOtp,
    resendOtp,
    reset,
  }
}
