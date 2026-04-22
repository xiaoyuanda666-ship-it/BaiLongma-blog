'use client'

import { useEffect, useRef } from 'react'

type GraphNode = {
  id: string
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  baseRadius: number
  phase: number
  speed: number
  glowUntil: number
  bornAt: number
  fadeOutAt: number | null
  removing: boolean
}

type GraphEdge = {
  from: string
  to: string
}

type TemplateNode = {
  x: number
  y: number
  radius: number
}

const TEMPLATE_NODES: TemplateNode[] = [
  { x: 0.12, y: 0.62, radius: 4 },
  { x: 0.17, y: 0.59, radius: 4.5 },
  { x: 0.22, y: 0.56, radius: 7 },
  { x: 0.27, y: 0.47, radius: 8 },
  { x: 0.31, y: 0.36, radius: 6 },
  { x: 0.36, y: 0.26, radius: 5 },
  { x: 0.44, y: 0.19, radius: 4.5 },
  { x: 0.55, y: 0.17, radius: 5 },
  { x: 0.67, y: 0.2, radius: 4.5 },
  { x: 0.77, y: 0.28, radius: 5 },
  { x: 0.85, y: 0.38, radius: 6 },
  { x: 0.88, y: 0.5, radius: 7 },
  { x: 0.86, y: 0.62, radius: 7 },
  { x: 0.8, y: 0.73, radius: 5.5 },
  { x: 0.72, y: 0.8, radius: 4.5 },
  { x: 0.61, y: 0.84, radius: 6.5 },
  { x: 0.49, y: 0.85, radius: 4.5 },
  { x: 0.38, y: 0.82, radius: 5 },
  { x: 0.3, y: 0.76, radius: 4.5 },
  { x: 0.24, y: 0.68, radius: 4 },
  { x: 0.23, y: 0.42, radius: 7 },
  { x: 0.31, y: 0.4, radius: 9 },
  { x: 0.41, y: 0.41, radius: 8 },
  { x: 0.53, y: 0.44, radius: 5.5 },
  { x: 0.67, y: 0.47, radius: 6 },
  { x: 0.8, y: 0.46, radius: 12 },
  { x: 0.76, y: 0.56, radius: 8 },
  { x: 0.69, y: 0.64, radius: 7 },
  { x: 0.58, y: 0.69, radius: 6 },
  { x: 0.46, y: 0.68, radius: 5 },
  { x: 0.35, y: 0.65, radius: 5.5 },
  { x: 0.52, y: 0.27, radius: 8 },
  { x: 0.58, y: 0.29, radius: 6 },
  { x: 0.67, y: 0.33, radius: 5 },
  { x: 0.75, y: 0.37, radius: 5 },
  { x: 0.86, y: 0.16, radius: 7 },
  { x: 0.9, y: 0.11, radius: 4 },
  { x: 0.95, y: 0.1, radius: 4 },
  { x: 0.84, y: 0.21, radius: 5.5 },
  { x: 0.89, y: 0.22, radius: 4 },
  { x: 0.34, y: 0.86, radius: 3.5 },
  { x: 0.63, y: 0.9, radius: 3.5 },
  { x: 0.82, y: 0.89, radius: 4 },
  { x: 0.91, y: 0.95, radius: 4.5 },
  { x: 0.97, y: 1.0, radius: 4 },
  { x: 0.84, y: 0.84, radius: 4.5 },
  { x: 0.12, y: 0.21, radius: 4 },
  { x: 0.18, y: 0.25, radius: 5 },
  { x: 0.22, y: 0.32, radius: 6 },
  { x: 0.32, y: 0.31, radius: 8 },
  { x: 0.22, y: 0.75, radius: 3.5 },
  { x: 0.61, y: 0.58, radius: 7.5 },
  { x: 0.7, y: 0.58, radius: 4.5 },
  { x: 0.78, y: 0.68, radius: 7 },
  { x: 0.88, y: 0.76, radius: 7 },
  { x: 0.8, y: 0.92, radius: 3.5 },
  { x: 0.59, y: 0.75, radius: 6 },
  { x: 0.46, y: 0.46, radius: 4.5 },
  { x: 0.37, y: 0.58, radius: 4.5 },
  { x: 0.43, y: 0.57, radius: 5.5 },
]

const TEMPLATE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 20], [20, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 0],
  [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 30], [30, 21],
  [25, 33], [33, 34], [34, 10], [10, 38], [38, 35], [35, 36], [36, 37],
  [31, 32], [32, 33], [31, 23], [31, 7],
  [17, 40], [16, 41], [13, 42], [42, 43], [43, 44], [12, 45], [45, 54], [54, 55],
  [47, 48], [48, 49], [49, 20], [49, 4],
  [21, 49], [21, 50], [30, 50], [22, 57], [57, 58], [58, 59], [59, 30], [59, 29],
  [23, 51], [51, 52], [52, 25], [52, 24], [53, 54], [53, 26], [23, 58], [15, 56], [56, 13],
]

const SPAWN_ANCHORS = [1, 3, 5, 8, 10, 14, 18, 24, 26, 30, 34, 45, 49, 52, 54, 58]
const GLOW_COUNT = 10
const MAX_SPAWN_NODES = 24
const NODE_LIFETIME = 5200
const FADE_DURATION = 900
const NODE_SCALE = 1.35
const TEMPLATE_MIN_X = 0.12
const TEMPLATE_MAX_X = 0.97
const TEMPLATE_MIN_Y = 0.1
const TEMPLATE_MAX_Y = 1.0
const TEMPLATE_WIDTH = TEMPLATE_MAX_X - TEMPLATE_MIN_X
const TEMPLATE_HEIGHT = TEMPLATE_MAX_Y - TEMPLATE_MIN_Y

function createGraph(width: number, height: number, time: number) {
  const paddingX = width * 0.06
  const paddingY = height * 0.06
  const drawableWidth = width - paddingX * 2
  const drawableHeight = height - paddingY * 2
  const scale = Math.min(drawableWidth / TEMPLATE_WIDTH, drawableHeight / TEMPLATE_HEIGHT)
  const offsetX = (width - TEMPLATE_WIDTH * scale) / 2
  const offsetY = (height - TEMPLATE_HEIGHT * scale) / 2

  const nodes: GraphNode[] = TEMPLATE_NODES.map((node, index) => ({
    id: `node-${index}`,
    x: offsetX + (node.x - TEMPLATE_MIN_X) * scale,
    y: offsetY + (node.y - TEMPLATE_MIN_Y) * scale,
    baseX: offsetX + (node.x - TEMPLATE_MIN_X) * scale,
    baseY: offsetY + (node.y - TEMPLATE_MIN_Y) * scale,
    radius: node.radius * NODE_SCALE,
    baseRadius: node.radius * NODE_SCALE,
    phase: index * 0.47,
    speed: 0.75 + (index % 7) * 0.08,
    glowUntil: 0,
    bornAt: time,
    fadeOutAt: null,
    removing: false,
  }))

  const edges: GraphEdge[] = TEMPLATE_EDGES.map(([from, to]) => ({ from: `node-${from}`, to: `node-${to}` }))

  return { nodes, edges }
}

export function MemoryGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let frameId = 0
    let width = 0
    let height = 0
    let nodes: GraphNode[] = []
    let edges: GraphEdge[] = []
    let spawnNodeCount = 0
    let nextGlowAt = 0
    let nextSpawnAt = 0

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect()
      width = Math.max(620, rect.width)
      height = Math.max(520, rect.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const graph = createGraph(width, height, performance.now())
      nodes = graph.nodes
      edges = graph.edges
      spawnNodeCount = 0
      nextGlowAt = performance.now() + 800
      nextSpawnAt = performance.now() + 1200
    }

    const pickGlowBatch = (now: number) => {
      const available = [...nodes]
      for (let index = available.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
        ;[available[index], available[swapIndex]] = [available[swapIndex], available[index]]
      }

      available.slice(0, Math.min(GLOW_COUNT, available.length)).forEach((node) => {
        node.glowUntil = now + 900 + Math.random() * 700
      })

      nextGlowAt = now + 1200 + Math.random() * 1000
    }

    const spawnNode = (now: number) => {
      const activeSpawnNodes = nodes.filter((node) => node.id.startsWith('spawn-'))
      if (activeSpawnNodes.length >= MAX_SPAWN_NODES) {
        const removable = activeSpawnNodes.find((node) => !node.removing)
        if (removable) {
          removable.removing = true
          removable.fadeOutAt = now
        }
      }

      const anchorIndex = SPAWN_ANCHORS[spawnNodeCount % SPAWN_ANCHORS.length]
      const anchor = nodes[anchorIndex]
      if (!anchor) return

      const angle = (spawnNodeCount * 0.72 + now * 0.0002) % (Math.PI * 2)
      const distance = 28 + (spawnNodeCount % 4) * 16
      const newId = `spawn-${now}-${spawnNodeCount}`
      const newNode: GraphNode = {
        id: newId,
        x: anchor.baseX + Math.cos(angle) * distance,
        y: anchor.baseY + Math.sin(angle) * distance,
        baseX: anchor.baseX + Math.cos(angle) * distance,
        baseY: anchor.baseY + Math.sin(angle) * distance,
        radius: 0,
        baseRadius: (3.8 + (spawnNodeCount % 4) * 0.55) * NODE_SCALE,
        phase: spawnNodeCount * 0.8,
        speed: 1 + (spawnNodeCount % 3) * 0.08,
        glowUntil: now + 1300,
        bornAt: now,
        fadeOutAt: null,
        removing: false,
      }

      nodes.push(newNode)
      edges.push({ from: anchor.id, to: newId })
      spawnNodeCount += 1
      nextSpawnAt = now + 650 + Math.random() * 650
    }

    const updateNodeLife = (now: number) => {
      nodes.forEach((node) => {
        if (!node.id.startsWith('spawn-')) return
        if (!node.removing && now - node.bornAt > NODE_LIFETIME) {
          node.removing = true
          node.fadeOutAt = now
        }
      })

      const removingIds = new Set(
        nodes
          .filter((node) => node.removing && node.fadeOutAt !== null && now - node.fadeOutAt > FADE_DURATION)
          .map((node) => node.id),
      )

      if (removingIds.size > 0) {
        nodes = nodes.filter((node) => !removingIds.has(node.id))
        edges = edges.filter((edge) => !removingIds.has(edge.from) && !removingIds.has(edge.to))
      }
    }

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height)

      if (now >= nextGlowAt) pickGlowBatch(now)
      if (now >= nextSpawnAt) spawnNode(now)
      updateNodeLife(now)

      nodes.forEach((node, index) => {
        const baseTwitch = node.id.startsWith('spawn-') ? 5.2 : 3.2
        const twitchX = Math.cos(now * 0.0013 * node.speed + node.phase) * baseTwitch
        const twitchY = Math.sin(now * 0.0016 * node.speed + node.phase * 0.7) * baseTwitch
        const spasmX = Math.sin(now * 0.006 + index * 0.9) * 1.1
        const spasmY = Math.cos(now * 0.0052 + index * 0.7) * 1.1
        node.x += (node.baseX + twitchX + spasmX - node.x) * 0.14
        node.y += (node.baseY + twitchY + spasmY - node.y) * 0.14
        const pulse = 1 + Math.sin(now * 0.003 + node.phase) * 0.09
        node.radius += (node.baseRadius * pulse - node.radius) * 0.12
      })

      const nodeMap = new Map(nodes.map((node) => [node.id, node]))
      context.lineWidth = 1
      edges.forEach((edge) => {
        const from = nodeMap.get(edge.from)
        const to = nodeMap.get(edge.to)
        if (!from || !to) return

        const fromFade = from.removing && from.fadeOutAt !== null ? Math.max(0, 1 - (now - from.fadeOutAt) / FADE_DURATION) : 1
        const toFade = to.removing && to.fadeOutAt !== null ? Math.max(0, 1 - (now - to.fadeOutAt) / FADE_DURATION) : 1
        const opacity = Math.min(fromFade, toFade)
        if (opacity <= 0) return

        context.strokeStyle = `rgba(130, 118, 96, ${0.12 * opacity})`
        context.beginPath()
        context.moveTo(from.x, from.y)
        context.lineTo(to.x, to.y)
        context.stroke()
      })

      nodes.forEach((node, index) => {
        const glowing = node.glowUntil > now
        const bornScale = Math.min(1, (now - node.bornAt) / 500)
        const fadeScale = node.removing && node.fadeOutAt !== null ? Math.max(0, 1 - (now - node.fadeOutAt) / FADE_DURATION) : 1
        const scale = bornScale * fadeScale
        const drawRadius = Math.max(0, node.radius * scale)
        if (drawRadius <= 0.4) return

        const fillColor = glowing ? '#efe6d5' : '#8d816d'
        const haloColor = glowing ? '239, 230, 213' : '141, 129, 109'
        const haloRadius = drawRadius * (glowing ? 4.2 : 2.8)
        const alpha = glowing ? 0.14 * fadeScale : 0.04 * fadeScale

        context.beginPath()
        context.fillStyle = `rgba(${haloColor}, ${alpha})`
        context.arc(node.x, node.y, haloRadius, 0, Math.PI * 2)
        context.fill()

        context.beginPath()
        context.fillStyle = fillColor
        context.globalAlpha = fadeScale
        context.arc(node.x, node.y, drawRadius, 0, Math.PI * 2)
        context.fill()
        context.globalAlpha = 1

        if (glowing && index % 2 === 0) {
          context.beginPath()
          context.fillStyle = `rgba(239, 230, 213, ${0.07 * fadeScale})`
          context.arc(node.x, node.y, haloRadius * 1.18, 0, Math.PI * 2)
          context.fill()
        }
      })

      frameId = window.requestAnimationFrame(draw)
    }

    syncSize()
    frameId = window.requestAnimationFrame(draw)
    window.addEventListener('resize', syncSize)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('resize', syncSize)
    }
  }, [])

  return <canvas ref={canvasRef} className="memory-canvas" aria-label="BaiLongma memory graph" />
}
