'use client';
import { useId } from 'react';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
export function Input({ label, hint, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const generated = useId(); const id = props.id || generated;
  return <div className="field"><label htmlFor={id}>{label}</label><input className="input" {...props} id={id} aria-invalid={Boolean(error)} aria-describedby={error || hint ? `${id}-hint` : undefined} />{(error || hint) && <p id={`${id}-hint`} className={error ? 'field-error' : 'field-hint'}>{error || hint}</p>}</div>;
}
export function Select({ label, children, className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  const generated = useId(); const id = props.id || generated;
  return <div className={`field ${className}`}><label htmlFor={id}>{label}</label><div className="select-wrap"><select className="input" {...props} id={id}>{children}</select><ChevronDown size={15} aria-hidden="true" /></div></div>;
}
export function Textarea({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const generated = useId(); const id = props.id || generated;
  return <div className="field"><label htmlFor={id}>{label}</label><textarea className="input textarea" {...props} id={id} /></div>;
}
export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (checked: boolean) => void; label: string; hint?: string }) {
  const id = useId();
  return <div className="toggle-row"><div><label id={id}>{label}</label>{hint && <p className="muted small">{hint}</p>}</div><button type="button" role="switch" aria-checked={checked} aria-labelledby={id} className={`toggle ${checked ? 'is-checked' : ''}`} onClick={() => onChange(!checked)}><span /></button></div>;
}
