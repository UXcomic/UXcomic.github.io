const slugify = (text: string) => {
  if (!text) return '' // Handle empty or null input

  let slug = text
    .toLowerCase()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove invalid characters
    .replace(/[\s-]+/g, '-') // Replace spaces and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
  return slug
}

const isUUID = (value: string) => {
  const uuidRegex = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[0-9a-f]{32})$/i
  return uuidRegex.test(value)
}

export { slugify, isUUID }
