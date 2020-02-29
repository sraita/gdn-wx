import defaultSettings from '@/settings'

const title = defaultSettings.title || '唐能翻译小程序'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
