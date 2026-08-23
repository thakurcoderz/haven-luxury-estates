import { useForm, usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Auth, Property } from '@/types';

interface EnquiryFormProps {
    property?: Property;
    className?: string;
    onSuccess?: () => void;
}

const ENQUIRY_TYPES = [
    {
        value: 'schedule_tour',
        label: 'Viewing',
        message: 'I would like to arrange a viewing of this property.',
    },
    {
        value: 'property_inquiry',
        label: 'Question',
        message: 'Could you send more detail on this property?',
    },
    {
        value: 'make_offer',
        label: 'Offer',
        message: 'I would like to discuss making an offer on this property.',
    },
];

const MESSAGE_PRESETS = [
    'Send me the floor plan and brochure.',
    'Is the asking price negotiable?',
    'What are the monthly running costs?',
    'Can I view it this weekend?',
];

export default function EnquiryForm({
    property,
    className = '',
    onSuccess,
}: EnquiryFormProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const currentUser = auth?.user;

    const initialMessage = property
        ? 'I am interested in this property and would like more detail or a viewing.'
        : '';

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        property_id: property ? property.id : null,
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        subject: property ? `Inquiry for ${property.title}` : '',
        message: initialMessage,
        enquiry_type: property ? 'schedule_tour' : 'general',
        preferred_date: '',
    });

    /* Only replace suggested copy, never something the visitor typed. */
    const [suggestedMessage, setSuggestedMessage] = useState(initialMessage);

    const suggestMessage = (message: string) => {
        if (data.message === suggestedMessage || data.message.trim() === '') {
            setData('message', message);
        }

        setSuggestedMessage(message);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/enquiries', {
            preserveScroll: true,
            onSuccess: () => {
                if (currentUser) {
                    reset('message', 'preferred_date');
                } else {
                    reset(
                        'name',
                        'email',
                        'phone',
                        'message',
                        'preferred_date',
                    );
                }

                onSuccess?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className={`space-y-5 ${className}`}>
            {recentlySuccessful && (
                <div
                    role="status"
                    className="flex animate-in items-start gap-2.5 border border-brand bg-brand-soft p-4 text-sm duration-300 fade-in"
                >
                    <Check
                        className="mt-0.5 size-4 shrink-0 text-brand"
                        strokeWidth={2}
                    />
                    <div>
                        <p className="font-medium text-foreground">
                            Message sent
                        </p>
                        <p className="mt-0.5 text-muted-foreground">
                            An advisor will reply by email or phone, usually the
                            same working day.
                        </p>
                    </div>
                </div>
            )}

            {property && (
                <fieldset>
                    <legend className="mb-2 text-sm font-medium text-foreground">
                        What do you need?
                    </legend>
                    <div className="flex gap-1 rounded-sm border border-border p-1">
                        {ENQUIRY_TYPES.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    setData('enquiry_type', option.value);
                                    suggestMessage(option.message);
                                }}
                                aria-pressed={
                                    data.enquiry_type === option.value
                                }
                                className={`flex-1 rounded-sm px-3 py-1.5 text-sm transition-colors ${
                                    data.enquiry_type === option.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </fieldset>
            )}

            {data.enquiry_type === 'schedule_tour' && (
                <div className="flex animate-in flex-col gap-2 duration-200 fade-in">
                    <Label htmlFor="preferred_date">Preferred date</Label>
                    <Input
                        id="preferred_date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={data.preferred_date}
                        onChange={(e) =>
                            setData('preferred_date', e.target.value)
                        }
                        className="h-10"
                    />
                    <InputError message={errors.preferred_date} />
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">
                        Name{' '}
                        <span className="text-muted-foreground">
                            (required)
                        </span>
                    </Label>
                    <Input
                        id="name"
                        type="text"
                        autoComplete="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        className="h-10"
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="email">
                        Email{' '}
                        <span className="text-muted-foreground">
                            (required)
                        </span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className="h-10"
                    />
                    <InputError message={errors.email} />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="phone">
                    Phone{' '}
                    <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="h-10"
                />
                <InputError message={errors.phone} />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="message">
                    Message{' '}
                    <span className="text-muted-foreground">(required)</span>
                </Label>
                <textarea
                    id="message"
                    rows={4}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    required
                    placeholder="Your timeframe, any questions, or what you are looking for."
                    className="w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
                <InputError message={errors.message} />

                {property && (
                    <div className="flex flex-wrap gap-2 pt-1">
                        {MESSAGE_PRESETS.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => {
                                    setData('message', preset);
                                    setSuggestedMessage(preset);
                                }}
                                className="rounded-sm border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <Button type="submit" disabled={processing} className="h-10 w-full">
                {processing ? 'Sending' : 'Send message'}
            </Button>
        </form>
    );
}
