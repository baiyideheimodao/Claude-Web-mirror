export const getDisplayFilename = (localFilename?: string | null, serverFilename?: string | null): string => {
  const preferredName = localFilename?.trim()
  if (preferredName) return preferredName

  const fallbackName = serverFilename?.trim()
  return fallbackName || 'unnamed-file'
}
