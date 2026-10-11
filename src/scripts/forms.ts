/**
 * Formularios con Astro Actions: validación campo por campo en el navegador con los mismos esquemas Zod del servidor
 * (src/lib/forms/schemas.ts) y envío a la action del mismo nombre (src/actions).
 *
 * Marcado: <form data-form="contact"> con campos dentro de FormField ([data-form-field] + [data-field-error]) y un
 * [data-form-status] para el resultado. El submit lleva [type=submit].
 * - Al salir de un campo (blur) se valida ese campo; si ya tenía error, se revalida mientras se escribe.
 * - Al enviar se validan todos (los ocultos con [hidden] no); el foco va al primero con error.
 * - El servidor vuelve a validar: sus errores por campo se muestran en el mismo sitio.
 */
import { actions, isInputError } from 'astro:actions';
import { formSchemas, type FormName } from '@/lib/forms/schemas';
import { appear, disappear, swapText } from '@/scripts/animations/presence';

type Messages = { success: string };

const defaults: Record<FormName, Messages> = {
  contact: { success: 'Thanks! Your message is on its way. Check your inbox for a confirmation.' },
  proposal: { success: 'Thanks! We received your request and will reply within one business day.' },
  job: { success: 'Thanks for applying! Check your inbox for a confirmation.' },
  newsletter: { success: 'You’re subscribed. Check your inbox!' },
};

export function bindForm(form: HTMLFormElement) {
  const name = form.dataset.form as FormName;
  const schema = formSchemas[name];
  if (!schema) return () => {};
  const shape = schema.shape as Record<string, { safeParse: (v: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }>;
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const touched = new Set<string>();

  const fieldNames = () => Object.keys(shape).filter((n) => n !== 'website');
  const control = (field: string) => form.elements.namedItem(field) as HTMLInputElement | RadioNodeList | null;
  const wrapper = (field: string) => {
    const el = control(field);
    const node = el instanceof RadioNodeList ? (el[0] as HTMLElement | undefined) : el;
    return node?.closest<HTMLElement>('[data-form-field]') ?? null;
  };
  const isHidden = (field: string) => !!wrapper(field)?.closest('[hidden]');

  const value = (field: string) => {
    const v = new FormData(form).get(field);
    if (v instanceof File) return v.size > 0 ? v : undefined;
    return v ?? undefined;
  };

  const show = (field: string, message: string) => {
    const box = wrapper(field);
    if (!box) return;
    const error = box.querySelector<HTMLElement>('[data-field-error]');
    const text = error?.querySelector<HTMLElement>('[data-field-error-text]') ?? error;
    const input = box.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, button[role="combobox"], [data-sw-select-trigger]');
    box.toggleAttribute('data-invalid', !!message);
    // El mensaje entra y sale con Motion (crece desde 0 para que el resto del formulario no salte)
    if (error && text) {
      if (message) {
        if (error.classList.contains('hidden') || error.hidden) {
          text.textContent = message;
          appear(error, { height: true, y: 0 });
        } else swapText(text, message);
      } else disappear(error, { height: true, y: 0 }).then(() => (text.textContent = ''));
    }
    if (input) {
      if (message) {
        input.setAttribute('aria-invalid', 'true');
        if (text?.id) input.setAttribute('aria-describedby', text.id);
      } else {
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    }
  };

  /** Valida un campo con su esquema; devuelve el mensaje de error o '' */
  const check = (field: string) => {
    const rule = shape[field];
    if (!rule || isHidden(field)) return '';
    const result = rule.safeParse(value(field));
    const message = result.success ? '' : (result.error?.issues[0]?.message ?? 'Check this field.');
    show(field, message);
    return message;
  };

  const say = (text: string, tone: 'info' | 'error' | 'success') => {
    if (!status) return;
    status.dataset.tone = tone;
    swapText(status, text);
  };

  const fieldOf = (target: EventTarget | null) => (target as HTMLInputElement | null)?.name || (target as HTMLElement | null)?.closest<HTMLElement>('[data-form-field]')?.querySelector<HTMLInputElement>('[name]')?.name;

  const onBlur = (e: FocusEvent) => {
    const field = fieldOf(e.target);
    if (!field || !shape[field]) return;
    touched.add(field);
    check(field);
  };
  const onInput = (e: Event) => {
    const field = fieldOf(e.target);
    if (field && touched.has(field) && wrapper(field)?.hasAttribute('data-invalid')) check(field);
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const errors = fieldNames()
      .map((f) => [f, check(f)] as const)
      .filter(([, m]) => m);
    fieldNames().forEach((f) => touched.add(f));
    if (errors.length) {
      // Formularios de un solo campo sin FormField (newsletter): el error va en el mensaje de estado
      const [firstField, firstMessage] = errors[0];
      if (!wrapper(firstField)) {
        say(firstMessage, 'error');
        (control(firstField) as HTMLElement | null)?.focus();
        return;
      }
      say(errors.length === 1 ? 'Please check the highlighted field.' : `Please check the ${errors.length} highlighted fields.`, 'error');
      const first = wrapper(errors[0][0])?.querySelector<HTMLElement>('input:not([type="hidden"]), textarea, button');
      first?.focus();
      return;
    }

    submit?.setAttribute('disabled', '');
    form.setAttribute('aria-busy', 'true');
    say('Sending…', 'info');
    try {
      const { error } = await (actions[name] as (data: FormData) => Promise<{ error?: unknown }>)(new FormData(form));
      if (error) {
        if (isInputError(error)) {
          Object.entries(error.fields).forEach(([f, msgs]) => show(f, (msgs as string[] | undefined)?.[0] ?? ''));
          say('Please check the highlighted fields.', 'error');
        } else {
          say(`${(error as { message?: string }).message ?? 'Something went wrong.'} You can also call ${form.dataset.contactPhone} or email ${form.dataset.contactEmail}.`, 'error');
        }
        return;
      }
      form.reset();
      touched.clear();
      fieldNames().forEach((f) => show(f, ''));
      form.querySelectorAll('[data-segmented]').forEach((g) => g.dispatchEvent(new Event('change')));
      say(defaults[name].success, 'success');
    } catch {
      say(`We could not reach the server. Call ${form.dataset.contactPhone} or email ${form.dataset.contactEmail}.`, 'error');
    } finally {
      submit?.removeAttribute('disabled');
      form.removeAttribute('aria-busy');
    }
  };

  form.addEventListener('focusout', onBlur);
  form.addEventListener('input', onInput);
  form.addEventListener('change', onInput);
  form.addEventListener('starwind:value-change', onInput);
  form.addEventListener('submit', onSubmit);
  return () => {
    form.removeEventListener('focusout', onBlur);
    form.removeEventListener('input', onInput);
    form.removeEventListener('change', onInput);
    form.removeEventListener('starwind:value-change', onInput);
    form.removeEventListener('submit', onSubmit);
  };
}

/** Engancha todos los formularios [data-form] de la página (dentro de onEveryPage) */
export function bindForms() {
  const cleanups = [...document.querySelectorAll<HTMLFormElement>('form[data-form]')].map(bindForm);
  return () => cleanups.forEach((c) => c());
}
