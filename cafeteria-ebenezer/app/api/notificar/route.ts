import { NextRequest, NextResponse } from 'next/server';

const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: 'Cuerpo inválido.' }, { status: 400 });
  }

  const { from_name, ciudad, calificacion, comentario, fecha } = body as Record<string, string>;

  if (!from_name?.trim() || !comentario?.trim()) {
    return NextResponse.json(
      { error: true, message: 'Nombre y comentario son obligatorios.' },
      { status: 400 },
    );
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (serviceId && templateId && publicKey && !serviceId.startsWith('service_X')) {
    try {
      const res = await fetch(EMAILJS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: { from_name, ciudad, calificacion, comentario, fecha },
        }),
      });
      if (!res.ok) {
        console.error('[notificar] EmailJS error:', await res.text());
      }
    } catch (err) {
      console.error('[notificar] fetch error:', err);
    }
  }

  return NextResponse.json({ error: false });
}
