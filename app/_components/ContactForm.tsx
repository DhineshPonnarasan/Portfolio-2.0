'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Send } from 'lucide-react';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';

const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message is too long'),
    honeypot: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

/**
 * Contact form. Validation via zod, focus order preserved by react-hook-form's
 * `register`, errors surfaced via `aria-invalid` + `aria-describedby`.
 *
 * The endpoint isn't wired to a backend (no live credentials in the repo).
 * The form falls back to opening the user's mail client with a prefilled
 * `mailto:` URL when the request would otherwise fail — keeps the page
 * fully functional in every environment.
 */
const ContactForm = () => {
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        defaultValues: { name: '', email: '', subject: '', message: '', honeypot: '' },
    });

    const onSubmit = async (values: FormValues) => {
        // Honeypot — bots fill the hidden field, humans don't.
        if (values.honeypot) {
            toast({ title: 'Thanks — message received.', variant: 'success' });
            reset();
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            }).catch(() => null);

            if (!res || !res.ok) {
                // Fallback: open a mailto: so the user is never blocked.
                const mailto =
                    `mailto:dhineshponnarasan@gmail.com?subject=${encodeURIComponent(
                        `[Portfolio] ${values.subject}`,
                    )}&body=${encodeURIComponent(
                        `${values.message}\n\n— ${values.name} (${values.email})`,
                    )}`;
                window.location.href = mailto;
                toast({
                    title: 'Opening your mail client',
                    description: 'No backend configured — falling back to mailto:',
                    variant: 'info',
                });
                reset();
                return;
            }
            toast({ title: 'Message sent', variant: 'success' });
            reset();
        } catch {
            toast({ title: 'Unable to send right now', variant: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    const fieldClasses = (hasError: boolean) =>
        cn(
            'w-full rounded-lg border bg-black/30 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary',
            hasError ? 'border-red-500/60' : 'border-white/10',
        );

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Contact form"
            className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
            {/* Honeypot — visually hidden, still in the tab order for screen readers via aria-hidden */}
            <div aria-hidden="true" className="hidden">
                <label>
                    Don't fill this field
                    <input type="text" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
                </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="cf-name" className="block text-xs uppercase tracking-widest text-white/60 mb-1">
                        Name
                    </label>
                    <input
                        id="cf-name"
                        type="text"
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'cf-name-err' : undefined}
                        className={fieldClasses(Boolean(errors.name))}
                        {...register('name')}
                    />
                    {errors.name && (
                        <p id="cf-name-err" role="alert" className="mt-1 text-xs text-red-300">
                            {errors.name.message}
                        </p>
                    )}
                </div>
                <div>
                    <label htmlFor="cf-email" className="block text-xs uppercase tracking-widest text-white/60 mb-1">
                        Email
                    </label>
                    <input
                        id="cf-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'cf-email-err' : undefined}
                        className={fieldClasses(Boolean(errors.email))}
                        {...register('email')}
                    />
                    {errors.email && (
                        <p id="cf-email-err" role="alert" className="mt-1 text-xs text-red-300">
                            {errors.email.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label htmlFor="cf-subject" className="block text-xs uppercase tracking-widest text-white/60 mb-1">
                    Subject
                </label>
                <input
                    id="cf-subject"
                    type="text"
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? 'cf-subject-err' : undefined}
                    className={fieldClasses(Boolean(errors.subject))}
                    {...register('subject')}
                />
                {errors.subject && (
                    <p id="cf-subject-err" role="alert" className="mt-1 text-xs text-red-300">
                        {errors.subject.message}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="cf-message" className="block text-xs uppercase tracking-widest text-white/60 mb-1">
                    Message
                </label>
                <textarea
                    id="cf-message"
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'cf-message-err' : undefined}
                    className={fieldClasses(Boolean(errors.message))}
                    {...register('message')}
                />
                {errors.message && (
                    <p id="cf-message-err" role="alert" className="mt-1 text-xs text-red-300">
                        {errors.message.message}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <p className="text-[11px] text-white/40">
                    Protected by a honeypot — bots only.
                </p>
                <button
                    type="submit"
                    disabled={submitting || !isValid}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" /> Sending…
                        </>
                    ) : (
                        <>
                            <Send size={14} /> Send
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
