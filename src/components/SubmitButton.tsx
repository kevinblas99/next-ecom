"use client";

import { ComponentProps } from "react";
import { useFormStatus} from "react-dom";

type SubmitButtonProps = {
    children: React.ReactNode,
    className?: string,
} & ComponentProps<"button">

export default function SubmitButton({
    children,
    className,
    ...props
    } : SubmitButtonProps) 
    
    {
        const { pending } = useFormStatus();
    return(
    <button
    {...props}
    className={`btn btn-primary ${className}`}
    type="submit"
    disabled={pending}
    >
        {pending && <span className="loading loading-spinner" />}
        {children}
    </button>
    )
}