export async function logAuditEvent({
  action,
  resourceType,
  resourceId,
  details,
}: {
  action: string
  resourceType: string
  resourceId: string
  details: string
}) {
  try {
    await fetch('/api/audit-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        resourceType,
        resourceId,
        details,
      }),
    })
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
} 