
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  fluid?: boolean;
}

export const Container = ({ children, className = '', fluid = false }: ContainerProps) => {
  return (
    <div className={`
      w-full mx-auto px-4 sm:px-6 lg:px-8 
      ${fluid ? '' : 'max-w-7xl'} 
      ${className}
    `}>
      {children}
    </div>
  );
};

export const Section = ({ children, className = '', containerClassName = '', fluid = false }: { 
  children: React.ReactNode; 
  className?: string;
  containerClassName?: string;
  fluid?: boolean;
}) => {
  return (
    <section className={`w-full py-16 md:py-24 ${className}`}>
      <Container className={containerClassName} fluid={fluid}>
        {children}
      </Container>
    </section>
  );
};
