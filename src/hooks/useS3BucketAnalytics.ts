import { useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface S3UsageSizes {
  images: number
  videos: number
  audio: number
  documents: number
  total: number
}

export interface S3UsageState {
  sizes: S3UsageSizes
  formatted: S3UsageSizes & { [k: string]: any }
  loading: boolean
  error: string | null
  lastUpdated: number | null
  refetch: () => Promise<void>
}

const formatBytes = (bytes: number): string => {
  if (!bytes) return '0 B'
  const k = 1024
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = parseFloat((bytes / Math.pow(k, i)).toFixed(2))
  return `${value} ${units[i]}`
}

export const useS3BucketAnalytics = (bucketName?: string, region?: string, enabled?: boolean, intervalMs = 5000): S3UsageState => {
  const [sizes, setSizes] = useState<S3UsageSizes>({ images: 0, videos: 0, audio: 0, documents: 0, total: 0 })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)

  const fetchAnalytics = async () => {
    if (!enabled || !bucketName || !region) return
    try {
      setError(null)
      const { data, error } = await supabase.functions.invoke('test-s3-connection', {
        body: {
          testConnection: true,
          bucketName: bucketName.trim(),
          region: region.trim(),
          useStoredCredentials: true,
        },
        headers: { 'Content-Type': 'application/json' },
      })
      if (error) throw new Error(error.message)

      const fileTypes = data?.storageAnalytics?.fileTypes || {}
      const next: S3UsageSizes = {
        images: fileTypes?.images?.size || 0,
        videos: fileTypes?.videos?.size || 0,
        audio: fileTypes?.audio?.size || 0,
        documents: fileTypes?.documents?.size || 0,
        total: data?.storageAnalytics?.totalSize || 0,
      }
      setSizes(next)
      setLastUpdated(Date.now())
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch S3 analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // initial
    fetchAnalytics()
    // polling
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (enabled && bucketName && region) {
      timerRef.current = window.setInterval(fetchAnalytics, intervalMs) as unknown as number
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName, region, enabled, intervalMs])

  const formatted = useMemo(() => ({
    images: formatBytes(sizes.images),
    videos: formatBytes(sizes.videos),
    audio: formatBytes(sizes.audio),
    documents: formatBytes(sizes.documents),
    total: formatBytes(sizes.total),
  }) as unknown as S3UsageSizes & { [k: string]: any }, [sizes])

  return { sizes, formatted, loading, error, lastUpdated, refetch: fetchAnalytics }
}
