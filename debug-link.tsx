import React from 'react';
import { renderToString } from 'react-dom/server';
import { Link, Navigation } from './lib/multimodal/v1';
import { renderToMarkdown } from './lib/multimodal/v1';

// Test a single Link in markdown mode
const linkComponent = <Link modality="markdown" href="/">Home</Link>;
console.log('Single Link rendered:', renderToString(linkComponent));

// Test Navigation with multiple Links
const navComponent = (
  <Navigation modality="markdown">
    <Link modality="markdown" href="/">Home</Link>
    <Link modality="markdown" href="/articles">Articles</Link>
    <Link modality="markdown" href="/community">Community</Link>
  </Navigation>
);
console.log('Navigation raw:', renderToString(navComponent));
console.log('Navigation clean:', renderToMarkdown(navComponent));
