import CategoriesData from '../../../public/data/categoriesAndTags.json'

const getDefaultRoute = (config: any) => {
  if (!config) return '/not-found'

  const cheatSheetRoute = CategoriesData.find((i) => i.slug === config.defaultCategory)
  return `/blog/${cheatSheetRoute?.slug}/${cheatSheetRoute?.tags?.[0]?.slug}`
}

const getNotFoundRoute = () => '/not-found'

export { getDefaultRoute, getNotFoundRoute }
