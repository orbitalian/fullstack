// Демонстрація TypeScript

interface Feature {
  name: string;
  enabled: boolean;
}

const webpackFeatures: Feature[] = [
  { name: 'DevServer',       enabled: true },
  { name: 'CSS',             enabled: true },
  { name: 'LESS',            enabled: true },
  { name: 'SCSS',            enabled: true },
  { name: 'TypeScript',      enabled: true },
  { name: 'Babel',           enabled: true },
  { name: 'ESLint',          enabled: true },
  { name: 'BundleAnalyzer',  enabled: true },
];

function getEnabledFeatures(features: Feature[]): string[] {
  return features
    .filter(f => f.enabled)
    .map(f => f.name);
}

const enabled = getEnabledFeatures(webpackFeatures);
console.log('Активні можливості Webpack:', enabled);

export { getEnabledFeatures, webpackFeatures };
