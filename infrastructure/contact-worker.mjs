const allowedServices = new Set([
  'AI and HPC infrastructure',
  'Enterprise and AI networking',
  'Network and systems operations',
  'Software and automation',
]);
const allowedSources = new Set(['Search', 'LinkedIn', 'Referral', 'Other', '']);

function allowedOrigin(origin) {
  try {
    const url = new URL(origin);
    return url.protocol === 'https:' && (url.hostname === 'flappyware.com' || url.hostname === 'www.flappyware.com' || url.hostname === 'flappyware-website.pages.dev' || url.hostname.endsWith('.flappyware-website.pages.dev'));
  } catch { return false; }
}

function reply(origin, status, body) {
  return new Response(JSON.stringify(body), { status, headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'access-control-allow-origin': origin,
    'vary': 'Origin',
    'x-content-type-options': 'nosniff',
  } });
}

async function readLimited(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  let bytes = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 12000) { await reader.cancel(); throw new Error('too large'); }
    chunks.push(value);
  }
  const decoder = new TextDecoder();
  return JSON.parse(chunks.map(chunk => decoder.decode(chunk, {stream:true})).join('') + decoder.decode());
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!allowedOrigin(origin)) return new Response('Forbidden', {status:403});
    if (request.method === 'OPTIONS') {
      return new Response(null, {status:204, headers:{'access-control-allow-origin':origin,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'Content-Type','access-control-max-age':'600','vary':'Origin'}});
    }
    if (request.method !== 'POST') return reply(origin, 405, {error:'Method not allowed.'});
    if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return reply(origin, 415, {error:'Invalid request.'});
    if (Number(request.headers.get('Content-Length') || 0) > 12000) return reply(origin, 413, {error:'Message is too long.'});
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    const [visitorLimit, globalLimit] = await Promise.all([
      env.CONTACT_LIMIT.limit({key:clientIp}), env.GLOBAL_LIMIT.limit({key:'contact-form'})
    ]);
    if (!visitorLimit.success || !globalLimit.success) return reply(origin, 429, {error:'Please wait a moment and try again.'});
    let data;
    try { data = await readLimited(request); } catch { return reply(origin, 400, {error:'Please check your message and try again.'}); }
    const clean = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    const name = clean(data?.name, 100).replace(/[\r\n]/g, ' ');
    const email = clean(data?.email, 254).replace(/[\r\n]/g, '');
    const message = clean(data?.message, 5000);
    const company = clean(data?.company, 100).replace(/[\r\n]/g, ' ');
    const source = clean(data?.source, 30);
    const services = Array.isArray(data?.services) ? [...new Set(data.services.filter(x => typeof x === 'string' && allowedServices.has(x)))] : [];
    if (clean(data?.website, 300)) return reply(origin, 400, {error:'Please check your message and try again.'});
    if (!name || !email || !message || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) || !allowedSources.has(source)) return reply(origin, 400, {error:'Please enter your name, a valid email address and a message.'});
    const text = ['New Flappyware website inquiry', '', `Name: ${name}`, `Email: ${email}`, `Company: ${company || 'Not provided'}`, `Services: ${services.join(', ') || 'Not specified'}`, `How they found us: ${source || 'Not specified'}`, '', 'Message:', message].join('\n');
    try {
      await env.EMAIL.send({from:'website@inquiries.flappyware.com',to:'brandon@flappyware.com',replyTo:email,subject:'Flappyware website inquiry',text});
      console.log(JSON.stringify({event:'contact_delivered'}));
      return reply(origin, 200, {ok:true});
    } catch (error) {
      console.error(JSON.stringify({event:'contact_delivery_failed',code:String(error?.code || 'unknown')}));
      return reply(origin, 503, {error:'Your message could not be sent. Please email brandon@flappyware.com instead.'});
    }
  }
};

