# Black Box visual system

The reference is the Swiss institutional typography of the [Swiss National Library](https://www.nb.admin.ch/): plain grotesk text, a consistent left edge, clear hierarchy and restrained weights. This follows its typographic approach rather than claiming to reproduce its exact font.

## Type and grid
Schibsted Grotesk (SIL Open Font License, next/font/google) sets headlines and body at 400 and 500. IBM Plex Mono (SIL Open Font License, locally hosted through next/font/local) sets terminal text and uppercase micro-labels. Headlines have tight tracking; labels use .15em spacing. Only labels decode, once, over 180ms, using a dash rather than random glyphs. Major headings are always readable.

The existing hero, RECORD, VERIFY and PRIVATE BRIEFING sequence and copy remain. Text aligns to the 7.3vw column; the product render is positioned on the right quarter of the viewport. Below 820px there is no render: the reserved model slots collapse, sections size to their text, and the hero centres in the first screen. Navigation keeps the briefing action and menu within the viewport.

## Palette
Black #080808, graphite #181818, rule #333333, secondary #aaaaaa, paper #eeeeee, white #ffffff. All surfaces, lights and borders are neutral. Signal red #FF3B30 appears only for integrity failure: the displaced plate, broken links, glass scan, TAMPERED engraving, housing LED and terminal failure row. Bloom stays tight; no scene wash.

## Object and motion

The reference is `design/recorder-concept.jpg`: a sealed matte black flight recorder. A chamfered Shape and bevelled ExtrudeGeometry form the deep solid body and front shell, with a visible shell seam. The envelope is approximately 1 : 1.15 : 0.85. Merged geometric milled ribs carry an emissive white writing pulse. Raised lathed bosses surround countersunk extruded hex sockets. Side fins sit behind raised structural frames. A separate CanvasTexture label engraves BLACK BOX / FDR-01 / SEALED. A stepped extruded cradle and four feet support the enclosure.

VERIFY displaces four ribs by 4.5mm at the model scale, reveals a thin red gap, blinks the red LED, sweeps a red scan once, and changes the label to TAMPERED. Leaving verification reseats the section, fades the red and restores the dim white LED. No glass or internal plate stack remains.

MeshPhysicalMaterial uses matte anodised black, roughness .55, metalness .42, with satin socket hardware and a darker cradle. Local Environment Lightformers provide key, fill and rim without network assets. Contact shadows bake once; half-resolution N8AO and tight bloom finish the scene.

One WebGL canvas is fixed below navigation, outside the main content and without clipping ancestors. Scroll maps real reserved model rectangles into camera space: hero right, RECORD left, VERIFY right opposite the terminal, and briefing smaller below the CTA. Eased position, rotation, scale and camera follow these anchors. Rendering pauses only when no flight section is visible or the document is hidden. DPR caps at 1.5. Repeated ribs, fins, frames and feet use merged geometry. The steady draw budget targets fewer than 60 calls; confirm via a browser GPU capture before release.

No static poster is shown. `public/images/recorder-poster.jpg` is a temporary reference on a light studio background and its plate carries aviation certification marks, so it must not appear on the page. Before reintroducing a fallback image, capture the real scene on the page background with `scripts/render-poster.mjs`. On desktop with reduced motion, during loading or after WebGL failure, the slots stay empty and dark. HeroMedia retains its video mode.
