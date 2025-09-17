export interface ShortenLink {
  id: number
  originalUrl: string
  shortCode: string
  shortLink: string
  createdAt: Date
  expiresAt: Date
  favIcon?: any
}
