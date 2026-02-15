# thebadg.es web guidelines

## Brand direction
- Audience: technology events, hackers, security conferences, and maker communities.
- Tone: confident, practical, hardware-forward, and modern.
- Logo: use the primary logo at logo/logo.png.
- Palette: derived from logo; focus on deep green, bright green, and matte neutral.
- Typography: Quantico for headings and UI; Space Grotesk for body copy.

## Page structure
- Single static page (index.html) with anchored sections.
- Sections: hero, product lineup, Infobadge configurator, process, contact.
- Infobadge configurator must stay on the same page.

## Infobadge payload format
- UART data is 5 strings, sent in this order:
  1) Name
  2) Role
  3) Company
  4) X or Facebook
  5) Webpage (used for QR generation on-device)
- Output should be a newline-delimited payload and available for copy or download.

## Design rules
- Keep layouts bold and intentional; avoid generic template feel.
- Use subtle gradients or glows; avoid flat backgrounds.
- Maintain responsive behavior for desktop and mobile.
- Avoid non-ASCII characters unless already present in existing copy.
