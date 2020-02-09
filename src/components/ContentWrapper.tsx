import React from 'react';

interface Props {
    children: React.ReactNode;
}

const ContentWrapper = ({ children }: Props) => <div className="content-wrapper">{children}</div>;

export default ContentWrapper;
