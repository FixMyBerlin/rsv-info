import type { APIRoute } from 'astro'

import { listRsvDSubsections } from '../../../lib/trassenscout/listRsvDSubsections'

export const prerender = false

export const GET: APIRoute = async () => {
  try {
    const data = await listRsvDSubsections()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    })
  }
}
