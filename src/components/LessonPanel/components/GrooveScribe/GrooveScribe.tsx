import React from 'react';

export default function GrooveScribe({ 
    className,
    urlParams
}: { 
    className?: string,
    urlParams?: string
}) {
    return (<iframe
                className={className}
                height={500}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="GrooveScribe"
                src={`https://montulli.github.io/GrooveScribe/?${urlParams}`} />);
};
