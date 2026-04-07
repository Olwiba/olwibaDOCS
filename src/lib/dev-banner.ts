import type { PluginOption, ViteDevServer } from "vite"
import { renderDosRebel } from "./dos-rebel-font"

const RESET = "\x1b[0m"
const DEFAULT_HEX = "#22D3EE"
const WHITE_HEX = "#ffffff"

export type BannerSegment = {
  text: string
  colorHex?: string
}

type BannerOptions = {
  segments: BannerSegment[]
}

type LegacyBannerOptions = {
  baseText: string
  suffix?: string
  colorHex?: string
  baseColorHex?: string
}

function hexToAnsi24(hex: string) {
  const normalized = hex.trim().replace(/^#/, "")
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null
  }
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return `\x1b[38;2;${r};${g};${b}m`
}

function normalizeSegments(
  input: string | BannerOptions | LegacyBannerOptions
): BannerSegment[] {
  if (typeof input === "string") {
    return [{ text: input, colorHex: WHITE_HEX }]
  }

  if ("segments" in input) {
    return input.segments
      .filter((segment) => segment.text.trim().length > 0)
      .map((segment) => ({
        text: segment.text,
        colorHex: segment.colorHex ?? WHITE_HEX,
      }))
  }

  const suffix = input.suffix ?? ""
  if (!suffix) {
    return [{ text: input.baseText, colorHex: input.colorHex ?? DEFAULT_HEX }]
  }

  return [
    { text: input.baseText, colorHex: input.baseColorHex ?? WHITE_HEX },
    { text: suffix, colorHex: input.colorHex ?? DEFAULT_HEX },
  ]
}

export async function printBanner(input: string | BannerSegment[] | BannerOptions) {
  const segments = Array.isArray(input) ? input : normalizeSegments(input)
  if (!segments.length) return

  process.stdout.write(`${RESET}\n`)

  const cumulativeTexts: string[] = []
  let textSoFar = ""
  for (const segment of segments) {
    textSoFar += segment.text
    cumulativeTexts.push(textSoFar)
  }

  const renderedByBoundary = await Promise.all(
    cumulativeTexts.map((text) => renderDosRebel(text))
  )
  const fullLines = renderedByBoundary[renderedByBoundary.length - 1] ?? []
  const boundaryLines = renderedByBoundary.slice(0, -1)
  const ansiBySegment = segments.map(
    (segment) => hexToAnsi24(segment.colorHex ?? WHITE_HEX) ?? "\x1b[97m"
  )

  for (let i = 0; i < fullLines.length; i++) {
    const full = fullLines[i] ?? ""
    let cursor = 0
    let out = ""

    for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
      const boundaryLine =
        segmentIndex < boundaryLines.length
          ? boundaryLines[segmentIndex]?.[i] ?? ""
          : full
      const end = Math.min(boundaryLine.length, full.length)
      const chunk = full.slice(cursor, end)
      out += `${ansiBySegment[segmentIndex]}${chunk}`
      cursor = end
    }

    process.stdout.write(`${out}${RESET}\n`)
  }
}

export function createDevBannerPlugin(
  project: string | BannerOptions | LegacyBannerOptions
): PluginOption {
  let shown = false
  const segments = normalizeSegments(project)
  const bannerText = segments.map((segment) => segment.text).join("")
  return {
    name: `nexus-dev-banner-${bannerText.toLowerCase()}`,
    apply: "serve",
    configureServer(_server: ViteDevServer) {
      if (shown) return
      shown = true
      void printBanner(segments)
    },
  }
}
