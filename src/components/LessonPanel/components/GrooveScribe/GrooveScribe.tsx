import React from 'react';

export const baseGsUrl = 'https://groovescribe.becomingadrummer.com';

export default function GrooveScribe({ 
    className,
    params
}: { 
    className?: string,
    params?: string
}) {
    const url = params ? baseGsUrl + params : baseGsUrl;

    return (<iframe
                className={className}
                height={500}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="GrooveScribe"
                id="gs-iframe"
                src={url} />);
};
