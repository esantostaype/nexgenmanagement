/**
 * Formularios aún sin backend: valida los campos `required` en el navegador, marca el primero que falle
 * (aria-invalid + foco + mensaje en [data-form-status]) y, si todo está bien, avisa de que el envío no está
 * conectado y da el teléfono y el email de contacto (data-contact-phone / data-contact-email del <form>).
 * Devuelve la función que quita los listeners.
 */
export function bindPendingForm(form: HTMLFormElement, messages: { email?: string; required?: string } = {}) {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const say = (text: string) => {
    if (!status) return;
    status.dataset.tone = 'error';
    status.textContent = text;
  };
  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    const invalid = [...form.querySelectorAll<HTMLInputElement>('input[required]')].find((i) => !i.checkValidity());
    if (invalid) {
      invalid.focus();
      invalid.setAttribute('aria-invalid', 'true');
      say(invalid.type === 'email' ? (messages.email ?? 'Enter a valid email so we can reply.') : (messages.required ?? 'Complete the required fields.'));
      return;
    }
    // TODO: conectar al endpoint real (Astro Action o servicio de formularios) antes de publicar.
    say(`This form is not connected yet. Call ${form.dataset.contactPhone} or email ${form.dataset.contactEmail}.`);
  };
  const onInput = (e: Event) => (e.target as HTMLElement).removeAttribute('aria-invalid');
  form.addEventListener('submit', onSubmit);
  form.addEventListener('input', onInput);
  return () => {
    form.removeEventListener('submit', onSubmit);
    form.removeEventListener('input', onInput);
  };
}
