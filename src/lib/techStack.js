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
      description: 'Fast, modern, component-driven UI framework powering the app shell and interactive views.',
    });
  }

  if (hasDependency('vite')) {
    items.push({
      id: 'vite',
      kind: 'vite',
      name: `Vite ${getVersion('vite')}`.trim(),
      description: 'Lightning-fast build tool and dev server used for local development and production bundling.',
    });
  }

  items.push({
    id: 'css',
    kind: 'css',
    name: 'Themeable CSS System',
    description: 'Custom token-based styling layer that drives notebook layouts, themes, spacing, and component visuals.',
  });

  if (hasDependency('firebase')) {
    items.push({
      id: 'firebase',
      kind: 'firebase',
      name: `Firebase ${getVersion('firebase')}`.trim(),
      description: 'Handles authentication, Firestore data sync, and the cloud-backed notebook experience.',
    });
  }

  if (hasDependency('framer-motion')) {
    items.push({
      id: 'motion',
      kind: 'motion',
      name: `Framer Motion ${getVersion('framer-motion')}`.trim(),
      description: 'Provides animated layout transitions, modal motion, and the app’s interaction polish.',
    });
  }

  if (hasDependency('lucide-react')) {
    items.push({
      id: 'lucide',
      kind: 'lucide',
      name: `Lucide React ${getVersion('lucide-react')}`.trim(),
      description: 'Supplies the lightweight icon set used across navigation, cards, dialogs, and actions.',
    });
  }

  if (deployWorkflow.includes('actions/deploy-pages') || deployWorkflow.includes('actions/upload-pages-artifact')) {
    items.push({
      id: 'deploy',
      kind: 'deploy',
      name: 'GitHub Actions + GitHub Pages',
      description: 'Builds the Vite app in CI and deploys the generated dist output automatically to GitHub Pages.',
    });
  }

  return items;
}
