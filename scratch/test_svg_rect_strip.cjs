const init = require('@rdkit/rdkit');
const assert = require('assert');

init().then(R => {
  const m = R.get_mol('C1CCN(CC1)C(=O)C2=CC=C(C=C2)N');
  const details = { width: 280, height: 210, backgroundColour: [0, 0, 0, 0] };
  let rawSvg = m.get_svg_with_highlights(JSON.stringify(details));

  // Strip XML comments
  let cleanSvg = rawSvg.replace(/^<\?xml[^>]*\?>/i, '').trim().replace(/<!--[\s\S]*?-->/g, '');

  // Strip ALL background rects (both paired <rect>...</rect> and self-closing <rect.../>)
  cleanSvg = cleanSvg.replace(/<rect[\s\S]*?<\/rect>/gi, '');
  cleanSvg = cleanSvg.replace(/<rect[^>]*\/>/gi, '');

  // Inject rounded line-caps and rounded line-joins
  cleanSvg = cleanSvg.replace(/<path\s/gi, '<path stroke-linecap="round" stroke-linejoin="round" ');
  cleanSvg = cleanSvg.replace(/<line\s/gi, '<line stroke-linecap="round" stroke-linejoin="round" ');
  cleanSvg = cleanSvg
    .replace(/stroke-linecap:\s*butt/gi, 'stroke-linecap:round')
    .replace(/stroke-linejoin:\s*miter/gi, 'stroke-linejoin:round');

  const resolvedStroke = 'var(--structure-bond-stroke, #475569)';
  cleanSvg = cleanSvg
    .replace(/stroke:\s*(#000000(?![0-9a-fA-F])|#000\b|black|rgb\(0,\s*0,\s*0\)|#475569|#e2e8f0|#cbd5e1)/gi, `stroke: ${resolvedStroke}`)
    .replace(/stroke=['"]*(#000000(?![0-9a-fA-F])|#000\b|black|#475569|#e2e8f0|#cbd5e1)['"]*/gi, `stroke="${resolvedStroke}"`)
    .replace(/fill:\s*(#000000(?![0-9a-fA-F])|#000\b|black|rgb\(0,\s*0,\s*0\)|#475569|#e2e8f0|#cbd5e1)/gi, `fill: ${resolvedStroke}`)
    .replace(/fill=['"]*(#000000(?![0-9a-fA-F])|#000\b|black|#475569|#e2e8f0|#cbd5e1)['"]*/gi, `fill="${resolvedStroke}"`);

  assert(!cleanSvg.includes('<rect'), 'cleanSvg must NOT contain any <rect> tags');
  assert(!cleanSvg.includes('#475569)00'), 'cleanSvg must NOT contain malformed trailing hex digits');
  assert(cleanSvg.includes('var(--structure-bond-stroke'), 'cleanSvg must contain var(--structure-bond-stroke)');

  console.log('✓ Verified: cleanSvg is completely transparent with no black background rect!');
  console.log('Preview:', cleanSvg.slice(0, 300));
});
