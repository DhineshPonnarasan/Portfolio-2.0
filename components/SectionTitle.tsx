import { ReactNode } from 'react';
import { SectionFlower } from './icons';
import { cn } from '@/lib/utils';

interface Props {
    icon?: ReactNode;
    className?: string;
    classNames?: {
        container?: string;
        title?: string;
        icon?: string;
    };
    title: string;
    /** When provided, renders a focus-visible skip link straight to this id. */
    sectionId?: string;
}

const SectionTitle = ({ icon, title, className, classNames, sectionId }: Props) => {
    return (
        <div
            className={cn(
                'flex items-center gap-4 mb-10',
                className,
                classNames?.container,
            )}
        >
            {icon ? (
                icon
            ) : (
                <SectionFlower
                    width={25}
                    className={cn(
                        'animate-spin duration-7000',
                        classNames?.icon,
                    )}
                />
            )}
            <h2
                className={cn(
                    'text-xl uppercase leading-none',
                    classNames?.title,
                )}
                id={sectionId ? `section-title-${sectionId}` : undefined}
            >
                {title}
            </h2>
            {sectionId && (
                <a
                    href={`#${sectionId}`}
                    className="skip-link"
                    aria-label={`Skip to ${title} section`}
                >
                    Skip to {title}
                </a>
            )}
        </div>
    );
};

export default SectionTitle;

