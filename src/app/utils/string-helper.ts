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

export { slugify }
