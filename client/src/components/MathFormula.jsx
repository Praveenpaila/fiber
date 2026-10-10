import React, { useMemo } from 'react';
import katex from 'katex';

export function MathFormula({ math, block = false, className = '' }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false
      });
    } catch (e) {
      return math;
    }
  }, [math, block]);

  if (block) {
    return (
      <div
        className={`py-2 overflow-x-auto text-charcoal-900 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block text-charcoal-900 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
