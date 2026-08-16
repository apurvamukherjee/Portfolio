import type { IconType } from 'react-icons'
import {
  SiAstro,
  SiC,
  SiCplusplus,
  SiCss,
  SiDart,
  SiDocker,
  SiGnubash,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiMarkdown,
  SiMysql,
  SiOpenjdk,
  SiPhp,
  SiPython,
  SiRuby,
  SiRust,
  SiSwift,
  SiTypescript,
  SiYaml,
} from 'react-icons/si'
import { TbCode, TbDatabase } from 'react-icons/tb'

const LANGUAGE_ICONS: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  java: SiOpenjdk,
  c: SiC,
  'c++': SiCplusplus,
  'html/css': SiHtml5,
  html: SiHtml5,
  css: SiCss,
  sql: TbDatabase,
  mysql: SiMysql,
  shell: SiGnubash,
  dockerfile: SiDocker,
  php: SiPhp,
  ruby: SiRuby,
  go: SiGo,
  rust: SiRust,
  swift: SiSwift,
  kotlin: SiKotlin,
  dart: SiDart,
  astro: SiAstro,
  markdown: SiMarkdown,
  json: SiJson,
  yaml: SiYaml,
}

/** Case-insensitive lookup with a generic code icon for anything not explicitly mapped. */
export function getLanguageIcon(name: string): IconType {
  return LANGUAGE_ICONS[name.toLowerCase()] ?? TbCode
}
