import { onRequest } from 'firebase-functions/v2/https'
import * as admin from 'firebase-admin'
import { Request, Response } from 'express'

admin.initializeApp()

export const nextjsApp = onRequest({
  region: 'asia-east1',
  memory: '256MiB'
}, async (req: Request, res: Response) => {
  // Next.js 서버리스 함수 구현
  res.json({ message: 'Next.js Function' })
}) 