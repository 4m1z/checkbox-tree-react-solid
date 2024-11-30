import React from 'react';


////////////////////////////// button 
type ButtonProps = {
    children: React.ReactNode;
    title: string;
};

function Button({ children, title = "", ...props }: ButtonProps) {
    return (
        <button
            aria-label={title}
            title={title}
            type="button"
            {...props}
        >
            {children}
        </button>
    );
}



////////////////////////// checkbox check models
const CHECK_MODEL = {
    ALL: 'all',
    PARENT: 'parent',
    LEAF: 'leaf',
};








/////////////// 
