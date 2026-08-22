import { useForm, usePage } from '@inertiajs/react';
import {
    Calendar,
    CheckCircle2,
    Clock,
    DollarSign,
    HelpCircle,
    Mail,
    MessageSquare,
    Phone,
    Send,
    Sparkles,
    User,
} from 'lucide-react';
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

export default function EnquiryForm({ property, className = '', onSuccess }: EnquiryFormProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const currentUser = auth?.user;

    const defaultType = property ? 'schedule_tour' : 'general';

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        property_id: property ? property.id : null,
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        subject: property ? `Inquiry for ${property.title}` : '',
        message: property
            ? 'Hello, I am interested in this property and would like to receive additional details or schedule a private showing.'
            : '',
        enquiry_type: defaultType,
        preferred_date: '',
    });

    const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

    const messagePresets = [
        'I would like to schedule a private tour.',
        'Please send me the full floor plan and brochure.',
        'Is the asking price negotiable?',
        'I am ready to submit a formal offer.',
    ];

    const handlePresetClick = (preset: string) => {
        setSelectedPreset(preset);
        setData('message', preset);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/enquiries', {
            preserveScroll: true,
            onSuccess: () => {
                if (!currentUser) {
                    reset('name', 'email', 'phone', 'message', 'preferred_date');
                } else {
                    reset('message', 'preferred_date');
                }
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className={`space-y-4 ${className}`}>
            {/* Success state */}
            {recentlySuccessful && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in duration-300">
                    <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold">Inquiry Dispatched Successfully!</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Our premier broker has received your message and will respond promptly via email or phone.
                        </p>
                    </div>
                </div>
            )}

            {/* Type Selector Tabs */}
            {property && (
                <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Inquiry Purpose
                    </Label>
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-muted rounded-xl text-xs font-medium">
                        <button
                            type="button"
                            onClick={() => {
                                setData('enquiry_type', 'schedule_tour');
                                setData('message', 'I would like to schedule a private viewing of this property.');
                            }}
                            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                data.enquiry_type === 'schedule_tour'
                                    ? 'bg-background text-foreground shadow-sm font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Calendar className="size-3.5" />
                            <span>Tour</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setData('enquiry_type', 'property_inquiry');
                                setData('message', 'Please provide more details regarding property specifications.');
                            }}
                            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                data.enquiry_type === 'property_inquiry'
                                    ? 'bg-background text-foreground shadow-sm font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <HelpCircle className="size-3.5" />
                            <span>Inquiry</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setData('enquiry_type', 'make_offer');
                                setData('message', 'We would like to discuss submitting an offer on this residence.');
                            }}
                            className={`py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                data.enquiry_type === 'make_offer'
                                    ? 'bg-background text-foreground shadow-sm font-semibold'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <DollarSign className="size-3.5" />
                            <span>Offer</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Tour Preferred Date if tour selected */}
            {data.enquiry_type === 'schedule_tour' && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                    <Label htmlFor="preferred_date" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-emerald-600" />
                        Preferred Tour Date
                    </Label>
                    <Input
                        id="preferred_date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={data.preferred_date}
                        onChange={(e) => setData('preferred_date', e.target.value)}
                        className="rounded-xl"
                    />
                    <InputError message={errors.preferred_date} />
                </div>
            )}

            {/* Contact Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                        Your Full Name *
                    </Label>
                    <div className="relative">
                        <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="pl-9 rounded-xl"
                        />
                    </div>
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                        Email Address *
                    </Label>
                    <div className="relative">
                        <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            className="pl-9 rounded-xl"
                        />
                    </div>
                    <InputError message={errors.email} />
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">
                    Phone Number (Optional)
                </Label>
                <div className="relative">
                    <Phone className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="pl-9 rounded-xl"
                    />
                </div>
                <InputError message={errors.phone} />
            </div>

            {/* Quick message presets */}
            {property && (
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground">Quick Question Suggestions</Label>
                    <div className="flex flex-wrap gap-1.5">
                        {messagePresets.map((preset) => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => handlePresetClick(preset)}
                                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                                    selectedPreset === preset
                                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-medium'
                                        : 'bg-muted/60 border-border hover:bg-muted text-muted-foreground'
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Message Area */}
            <div className="space-y-1.5">
                <Label htmlFor="message" className="text-xs font-medium text-muted-foreground">
                    Message / Special Requests *
                </Label>
                <div className="relative">
                    <textarea
                        id="message"
                        rows={3}
                        value={data.message}
                        onChange={(e) => setData('message', e.target.value)}
                        required
                        placeholder="Tell the listing team about your move timeframe, questions, or requirements..."
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                    />
                </div>
                <InputError message={errors.message} />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={processing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
                {processing ? (
                    <span>Sending Inquiry...</span>
                ) : (
                    <>
                        <Send className="size-4" />
                        <span>Send Message to Agent</span>
                    </>
                )}
            </Button>
        </form>
    );
}
