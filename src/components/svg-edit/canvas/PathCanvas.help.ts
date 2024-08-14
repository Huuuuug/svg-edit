/**
 * 计算当指定的svg的box
 * @param path Svg
 * @returns DOMRect
 */
export function browserComputePathBoundingBox(path: string) {
  const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgEl.style.position = 'absolute'
  svgEl.style.width = '0px'
  svgEl.style.height = '0px'
  const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  pathEl.setAttributeNS(null, 'd', path)
  svgEl.appendChild(pathEl)
  document.body.appendChild(svgEl)
  const box = pathEl.getBBox()
  document.body.removeChild(svgEl)
  return box
}
