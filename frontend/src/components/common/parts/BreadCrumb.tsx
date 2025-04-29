interface BreadCrumbProps {
    title: string;
    description?: string;
    fontSize?: string;
}

export function PageTitle({
    title,
    description,
    fontSize = "text-3xl",
}: BreadCrumbProps) {
    return (
        <div className='space-y-2 px-4 mb-5'>
            <div className='flex flex-col gap-1'>
                <h2 className={`${fontSize} font-bold tracking-tight`}>
                    {title}
                </h2>
                {description && (
                    <p className='text-muted-foreground'>{description}</p>
                )}
            </div>
        </div>
    );
}
