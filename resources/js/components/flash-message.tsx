import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage<{ flash?: { success?: string | null; error?: string | null; message?: string | null } }>().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setIsError(false);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setMessage(flash.error);
            setIsError(true);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 7000);
            return () => clearTimeout(timer);
        } else if (flash?.message) {
            setMessage(flash.message);
            setIsError(false);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !message) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div
                className={`flex items-start gap-3 p-4 rounded-md border shadow-xl backdrop-blur-md ${
                    isError
                        ? 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
                        : 'bg-brand-soft border-brand text-foreground'
                }`}
            >
                {isError ? (
                    <AlertCircle className="size-5 shrink-0 text-red-500 mt-0.5" />
                ) : (
                    <CheckCircle2 className="size-5 shrink-0 text-brand mt-0.5" />
                )}
                <div className="flex-1 text-sm font-medium leading-relaxed">
                    {message}
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
                >
                    <X className="size-4" />
                </button>
            </div>
        </div>
    );
}
