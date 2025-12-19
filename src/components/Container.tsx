import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
}

export const Container = ({children}: ContainerProps) => {
    return (
        <div className="mx-auto w-full max-w-md px-4">
            {children}
        </div>
    )
}