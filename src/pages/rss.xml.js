import { getCollection } from 'astro:content';
export async function GET(context) {
  const posts = (await getCollection('writing')).sort((a, b) => b.data.date - a.data.date);
  const esc = (s) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);
  const items = posts.map((w) => `<item><title>${esc(w.data.title)}</title><link>${context.site}writing/${w.id}/</link><guid>${context.site}writing/${w.id}/</guid><pubDate>${w.data.date.toUTCString()}</pubDate><description>${esc(w.data.summary)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>George Shostakovych</title><link>${context.site}</link><description>Projects, post-mortems and notes.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
