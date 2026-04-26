import { NextRequest, NextResponse } from 'next/server';

const EMAILJS_URL = 'https://api.emailjs.com/api/v1.0/email/send';

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: true, message: 'Cuerpo inválido.' }, { status: 400 });
  }

  const { name, phone, email, date, time, guests, notes } = body as Record<string, string>;

  if (!name?.trim() || !phone?.trim() || !date?.trim() || !time?.trim()) {
    return NextResponse.json(
      { error: true, message: 'Nombre, teléfono, fecha y hora son obligatorios.' },
      { status: 400 },
    );
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID_RESERVA;
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
          template_params: {
            from_name: name.trim(),
            telefono: phone.trim(),
            email: email?.trim() || 'No indicado',
            fecha: date,
            hora: time,
            comensales: guests || '2',
            notas: notes?.trim() || '—',
          },
        }),
      });
      if (!res.ok) {
        console.error('[reserva] EmailJS error:', await res.text());
      }
    } catch (err) {
      console.error('[reserva] fetch error:', err);
    }
  }

  return NextResponse.json({ error: false, message: 'Reserva recibida correctamente.' });
}
