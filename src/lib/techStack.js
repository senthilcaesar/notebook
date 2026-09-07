import packageInfo from '../../package.json';
import deployWorkflow from '../../.github/workflows/deploy.yml?raw';

function hasDependency(name) {
  return Boolean(packageInfo.dependencies?.[name] || packageInfo.devDependencies?.[name]);
}

function getVersion(name) {
  return packageInfo.dependencies?.[name] || packageInfo.devDependencies?.[name] || '';
}

export function getTechStackItems() {
  const items = [];

  if (hasDependency('react')) {
    items.push({
      id: 'react',
      kind: 'react',
      name: `React ${getVersion('react')}`.trim(),
      category: 'UI & State',
      span: 2,
      description: 'Component-driven declarative architecture powering the application shell, memoized flashcards, and live search views.',
      highlights: ['React 19', 'Memoized Cards', 'Concurrent Rendering'],
    });
  }

  if (hasDependency('firebase')) {
    items.push({
      id: 'firebase',
      kind: 'firebase',
      name: `Firebase ${getVersion('firebase')}`.trim(),
      category: 'Cloud Backend',
      span: 1,
      description: 'Cloud Firestore real-time sync with Google OAuth 2.0 authentication.',
      highlights: ['Cloud Firestore', 'Google Auth'],
    });
  }

  if (hasDependency('vite')) {
    items.push({
      id: 'vite',
      kind: 'vite',
      name: `Vite ${getVersion('vite')}`.trim(),
      category: 'Build Engine',
      span: 1,
      description: 'Next-gen frontend tooling with instant HMR and optimized production bundling.',
      highlights: ['Vite 8', 'Instant HMR'],
    });
  }

  if (hasDependency('framer-motion')) {
    items.push({
      id: 'motion',
      kind: 'motion',
      name: `Framer Motion ${getVersion('framer-motion')}`.trim(),
      category: 'Animations',
      span: 1,
      description: 'Spring physics layout animations, deck transitions, and fluid modal gestures.',
      highlights: ['Spring Physics', 'Deck Transitions'],
    });
  }

  items.push({
    id: 'css',
    kind: 'css',
    name: 'Themeable CSS Tokens',
    category: 'Design System',
    span: 1,
    description: 'Custom token-based margin sheet styling with dark/light themes and 8 deterministic tag color slots.',
    highlights: ['Dark/Light Mode', 'Margin Sheet'],
  });

  if (hasDependency('lucide-react')) {
    items.push({
      id: 'lucide',
      kind: 'lucide',
      name: `Lucide React ${getVersion('lucide-react')}`.trim(),
      category: 'Iconography',
      span: 1,
      description: 'Lightweight, scalable vector icons across toolbars, checklists, and dialogs.',
      highlights: ['Tree-shakable SVG', 'Featherweight'],
    });
  }

  if (deployWorkflow.includes('actions/deploy-pages') || deployWorkflow.includes('actions/upload-pages-artifact')) {
    items.push({
      id: 'deploy',
      kind: 'deploy',
      name: 'GitHub Actions & Pages',
      category: 'CI / CD & Edge Hosting',
      span: 2,
      description: 'Automated CI lint and build workflow delivering zero-downtime static deployment to GitHub Pages.',
      highlights: ['Automated Deploy', 'Continuous Integration', 'Edge CDN'],
    });
  }

  return items;
}
