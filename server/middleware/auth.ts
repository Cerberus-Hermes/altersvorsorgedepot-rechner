const PASSWORD = 'Riester2026!'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)

  // Skip auth for API routes
  if (url.pathname.startsWith('/api')) return

  const auth = getHeader(event, 'authorization')

  if (!auth || !auth.startsWith('Basic ')) {
    setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Altersvorsorgedepot Rechner"')
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  try {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8')
    const [, pass] = decoded.split(':')

    if (pass !== PASSWORD) {
      setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Altersvorsorgedepot Rechner"')
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
  } catch {
    setResponseHeader(event, 'WWW-Authenticate', 'Basic realm="Altersvorsorgedepot Rechner"')
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
})
