export function getUserAvatarCandidates(user) {
  if (!user) return []

  const metadata = user.user_metadata || {}
  const identityData = user.identities?.[0]?.identity_data || {}
  const generated = user.email
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=2563eb&color=ffffff&size=128`
    : ''

  return [
    metadata.avatar_url ||
      '',
    metadata.picture || '',
    identityData.avatar_url || '',
    identityData.picture || '',
    generated,
  ].filter(Boolean)
}

export function getUserInitial(user) {
  const email = user?.email || user?.user_metadata?.email || ''
  return email ? email[0].toUpperCase() : 'U'
}
