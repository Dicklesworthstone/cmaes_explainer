// CMA-ES Visualization - Enhanced Application
// This file contains all the enhancements: tooltips, keyboard shortcuts, state management, etc.

import init, { WasmCmaes } from "../pkg/cmaes_wasm.js";
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/controls/OrbitControls.js";

// ============================================================================
// GLOBAL STATE
// ============================================================================
const state = {
  wasmInitialized: false,
  currentBenchmark: 'sphere',
  history: [],
  playbackFrames: [],
  playbackIdx: 0,
  playing: false,
  tutorialStep: 0,
  commandPaletteActive: false,
  isMobile: window.innerWidth < 768,
  isDark: true,
  chartMode: 'log' // 'log' or 'linear'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const mustGet = (id) => {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Missing DOM element: ${id}`);
    return null;
  }
  return el;
};

const announceToScreenReader = (message) => {
  const el = mustGet('sr-announcements');
  if (el) {
    el.textContent = message;
    setTimeout(() => el.textContent = '', 100);
  }
};

// Toast notifications
const showToast = (message, type = 'info', duration = 3000) => {
  const container = mustGet('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast panel rounded-lg p-4 flex items-start gap-3 ${
    type === 'success' ? 'border-l-4 border-emerald-400' :
    type === 'error' ? 'border-l-4 border-red-400' :
    type === 'warning' ? 'border-l-4 border-amber-400' :
    'border-l-4 border-sky-400'
  }`;

  const icon = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  }[type] || 'ℹ';

  const iconEl = document.createElement('div');
  iconEl.className = 'text-lg';
  iconEl.textContent = icon;

  const msgEl = document.createElement('div');
  msgEl.className = 'flex-1 text-sm';
  msgEl.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'text-slate-400 hover:text-slate-200';
  closeBtn.setAttribute('aria-label', 'Close toast');
  const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  closeSvg.setAttribute('class', 'w-4 h-4');
  closeSvg.setAttribute('fill', 'none');
  closeSvg.setAttribute('stroke', 'currentColor');
  closeSvg.setAttribute('viewBox', '0 0 24 24');
  const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  closePath.setAttribute('stroke-linecap', 'round');
  closePath.setAttribute('stroke-linejoin', 'round');
  closePath.setAttribute('stroke-width', '2');
  closePath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
  closeSvg.appendChild(closePath);
  closeBtn.appendChild(closeSvg);
  closeBtn.addEventListener('click', () => toast.remove());

  toast.replaceChildren(iconEl, msgEl, closeBtn);

  container.appendChild(toast);
  announceToScreenReader(message);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// Save/load state
const saveState = () => {
  const config = {
    benchmark: mustGet('bench')?.value || 'sphere',
    lambda: mustGet('lambda')?.value || 32,
    sigma: mustGet('sigma')?.value || 1.2,
    iters: mustGet('iters')?.value || 250,
    seed: mustGet('seed')?.value || 42,
    boundsEnabled: mustGet('bounds-toggle')?.checked || false,
    boundLo: mustGet('bound-lo')?.value || -5,
    boundHi: mustGet('bound-hi')?.value || 5,
    theme: state.isDark ? 'dark' : 'light'
  };
  localStorage.setItem('cmaes-config', JSON.stringify(config));
  updateURL(config);
};

const loadState = () => {
  // Try URL params first
  const params = new URLSearchParams(window.location.search);
  if (params.has('bench')) {
    return {
      benchmark: params.get('bench') || 'sphere',
      lambda: params.get('lambda') || 32,
      sigma: params.get('sigma') || 1.2,
      iters: params.get('iters') || 250,
      seed: params.get('seed') || 42,
      theme: params.get('theme') || 'dark'
    };
  }

  // Fallback to localStorage
  const saved = localStorage.getItem('cmaes-config');
  return saved ? JSON.parse(saved) : null;
};

const updateURL = (config) => {
  const params = new URLSearchParams({
    bench: config.benchmark,
    lambda: config.lambda,
    sigma: config.sigma,
    seed: config.seed
  });
  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', newURL);
};

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

const toggleTheme = () => {
  state.isDark = !state.isDark;
  const root = document.documentElement;
  if (root) {
    root.classList.toggle('light', !state.isDark);
    root.classList.toggle('dark', state.isDark);
  }

  const moonIcon = mustGet('moon-icon');
  const sunIcon = mustGet('sun-icon');
  if (moonIcon && sunIcon) {
    moonIcon.classList.toggle('hidden', !state.isDark);
    sunIcon.classList.toggle('hidden', state.isDark);
  }

  localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
  showToast(`Switched to ${state.isDark ? 'dark' : 'light'} mode`, 'info', 2000);
};

// ============================================================================
// BENCHMARK METADATA
// ============================================================================

const benchmarkMetadata = {
  sphere: {
    title: "Sphere Function",
    type: "Unimodal, Separable",
    difficulty: "⭐",
    minimum: "f(0,...,0) = 0",
    domain: "[-∞, ∞]ⁿ (typical: [-5.12, 5.12])",
    description: "The simplest continuous optimization test function. Perfectly convex with a single global minimum at the origin. Ideal for testing basic convergence behavior.",
    recommendedLambda: 16,
    recommendedSigma: 1.0,
    reason: "Simple unimodal function requires minimal exploration",
    link: "https://en.wikipedia.org/wiki/Test_functions_for_optimization#Sphere_function"
  },
  rastrigin: {
    title: "Rastrigin Function",
    type: "Multimodal, Separable",
    difficulty: "⭐⭐⭐⭐",
    minimum: "f(0,...,0) = 0",
    domain: "[-5.12, 5.12]ⁿ",
    description: "Highly multimodal with regularly distributed local minima arranged in a grid pattern. The large number of local minima makes this a challenging test for global optimization.",
    recommendedLambda: 64,
    recommendedSigma: 2.0,
    reason: "Multimodal landscape requires large population and exploration radius",
    link: "https://en.wikipedia.org/wiki/Rastrigin_function"
  },
  ackley: {
    title: "Ackley Function",
    type: "Multimodal, Non-separable",
    difficulty: "⭐⭐⭐",
    minimum: "f(0,...,0) = 0",
    domain: "[-32.768, 32.768]ⁿ (typical: [-5, 5])",
    description: "Features a nearly flat outer region and a central peak with many local minima. The exponential terms create a challenging landscape with a deceptively flat plateau.",
    recommendedLambda: 48,
    recommendedSigma: 1.5,
    reason: "Nearly flat valleys require moderate exploration",
    link: "https://en.wikipedia.org/wiki/Ackley_function"
  },
  griewank: {
    title: "Griewank Function",
    type: "Multimodal, Non-separable",
    difficulty: "⭐⭐⭐",
    minimum: "f(0,...,0) = 0",
    domain: "[-600, 600]ⁿ (typical: [-10, 10])",
    description: "Has many widespread local minima regularly distributed. The product term introduces dependencies between variables, making it non-separable.",
    recommendedLambda: 40,
    recommendedSigma: 1.8,
    reason: "Oscillatory structure benefits from balanced exploration",
    link: "https://en.wikipedia.org/wiki/Griewank_function"
  },
  schwefel: {
    title: "Schwefel Function",
    type: "Multimodal, Separable",
    difficulty: "⭐⭐⭐⭐⭐",
    minimum: "f(420.9687,...,420.9687) ≈ 0",
    domain: "[-500, 500]ⁿ",
    description: "Deceptive function where the global minimum is far from the next-best local minima. The second-best minimum is located near the origin, making it a difficult trap.",
    recommendedLambda: 80,
    recommendedSigma: 100.0,
    reason: "Deceptive landscape requires very large search radius",
    link: "https://en.wikipedia.org/wiki/Schwefel_function"
  },
  levy: {
    title: "Levy Function",
    type: "Multimodal, Non-separable",
    difficulty: "⭐⭐⭐",
    minimum: "f(1,...,1) = 0",
    domain: "[-10, 10]ⁿ",
    description: "Features broad ridges and many local minima. Named after mathematician Monique Levy, it tests an algorithm's ability to navigate ridge structures.",
    recommendedLambda: 48,
    recommendedSigma: 1.5,
    reason: "Ridge navigation requires moderate population",
    link: "https://www.sfu.ca/~ssurjano/levy.html"
  },
  zakharov: {
    title: "Zakharov Function",
    type: "Unimodal, Non-separable",
    difficulty: "⭐⭐",
    minimum: "f(0,...,0) = 0",
    domain: "[-5, 10]ⁿ (typically [-5, 5])",
    description: "Ill-conditioned unimodal function with axes of different sensitivities. Good for testing covariance matrix adaptation on elongated basins.",
    recommendedLambda: 24,
    recommendedSigma: 1.2,
    reason: "Ill-conditioning benefits from CMA adaptation",
    link: "https://www.sfu.ca/~ssurjano/zakharov.html"
  },
  alpine: {
    title: "Alpine N.1 Function",
    type: "Multimodal, Separable",
    difficulty: "⭐⭐⭐⭐",
    minimum: "f(0,...,0) = 0",
    domain: "[-10, 10]ⁿ (typically [-5, 5])",
    description: "Features many sharp spikes across the landscape. The sinusoidal absolute value creates numerous local minima with varying magnitudes.",
    recommendedLambda: 56,
    recommendedSigma: 1.8,
    reason: "Spiky landscape requires robust sampling",
    link: "https://www.sfu.ca/~ssurjano/alpine1.html"
  },
  bukin6: {
    title: "Bukin N.6 Function",
    type: "Multimodal, Non-separable",
    difficulty: "⭐⭐⭐⭐",
    minimum: "f(-10, 1) = 0",
    domain: "x₁ ∈ [-15, -5], x₂ ∈ [-3, 3]",
    description: "Features a narrow valley that is difficult to traverse. The steep gradients and valley structure make this challenging for many optimizers.",
    recommendedLambda: 48,
    recommendedSigma: 2.0,
    reason: "Narrow valley requires careful exploration",
    link: "https://www.sfu.ca/~ssurjano/bukin6.html"
  }
};

// Update benchmark info display
const updateBenchmarkInfo = (benchKey) => {
  const meta = benchmarkMetadata[benchKey];
  if (!meta) return;

  const setElText = (id, text) => {
    const el = mustGet(id);
    if (el) el.textContent = text;
  };

  setElText('info-type', meta.type);
  setElText('info-difficulty', meta.difficulty);
  setElText('info-minimum', meta.minimum);
  setElText('info-domain', meta.domain);
  setElText('info-description', meta.description);

  const linkEl = mustGet('info-link');
  if (linkEl) {
    linkEl.href = meta.link;
    linkEl.classList.remove('hidden');
  }

  // Show parameter recommendation
  const recEl = mustGet('param-recommendation');
  const recTextEl = mustGet('param-recommendation-text');
  if (recEl && recTextEl && meta.recommendedLambda) {
    recTextEl.textContent = `For ${meta.title}, try λ=${meta.recommendedLambda}, σ=${meta.recommendedSigma}. ${meta.reason}.`;
    recEl.classList.remove('hidden');
  }
};

// ============================================================================
// TOOLTIP SYSTEM
// ============================================================================

const initTooltips = () => {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.id = 'global-tooltip';
  document.body.appendChild(tooltip);

  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const text = el.dataset.tooltip;
      tooltip.textContent = text;
      tooltip.classList.add('show');

      const rect = el.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.bottom + 8}px`;
      tooltip.style.transform = 'translateX(-50%)';
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });
};

// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================

const keyboardShortcuts = {
  ' ': { action: 'run', description: 'Run optimization', handler: () => runOptimization() },
  'r': { action: 'reset', description: 'Reset to defaults', handler: () => resetToDefaults() },
  'k': { action: 'commandPalette', description: 'Open command palette', ctrl: true, handler: () => toggleCommandPalette() },
  'h': { action: 'help', description: 'Open tutorial', handler: () => startTutorial() },
  'Escape': { action: 'close', description: 'Close overlays', handler: () => closeAllOverlays() },
  'b': { action: 'cycleBenchmark', description: 'Cycle benchmark', handler: () => cycleBenchmark(1) },
  't': { action: 'toggleTheme', description: 'Toggle theme', handler: () => toggleTheme() },
  's': { action: 'share', description: 'Share configuration', ctrl: true, handler: () => shareConfiguration() },
  'e': { action: 'export', description: 'Export CSV', ctrl: true, handler: () => exportCSV() }
};

const initKeyboardShortcuts = () => {
  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    const key = e.key;
    const shortcut = keyboardShortcuts[key];

    if (!shortcut) return;

    // Check for Ctrl/Cmd modifier
    if (shortcut.ctrl && !(e.ctrlKey || e.metaKey)) return;
    if (!shortcut.ctrl && (e.ctrlKey || e.metaKey)) return;

    e.preventDefault();
    shortcut.handler();
  });
};

// ============================================================================
// COMMAND PALETTE
// ============================================================================

const commands = [
  { id: 'run', title: 'Run Optimization', icon: '🚀', hotkey: 'Space', handler: () => runOptimization() },
  { id: 'run-js', title: 'Run JS Baseline', icon: '🧪', handler: () => runJsBaselineOnly() },
  { id: 'tutorial', title: 'Start Tutorial', icon: '📚', hotkey: 'H', handler: () => startTutorial() },
  { id: 'sphere', title: 'Load Sphere Function', icon: '⚪', handler: () => loadBenchmark('sphere') },
  { id: 'rastrigin', title: 'Load Rastrigin Function', icon: '🎯', handler: () => loadBenchmark('rastrigin') },
  { id: 'ackley', title: 'Load Ackley Function', icon: '🌊', handler: () => loadBenchmark('ackley') },
  { id: 'export-csv', title: 'Export Results as CSV', icon: '📄', hotkey: 'Ctrl+E', handler: () => exportCSV() },
  { id: 'export-json', title: 'Export Results as JSON', icon: '📋', handler: () => exportJSON() },
  { id: 'share', title: 'Share Configuration', icon: '🔗', hotkey: 'Ctrl+S', handler: () => shareConfiguration() },
  { id: 'reset', title: 'Reset to Defaults', icon: '↺', hotkey: 'R', handler: () => resetToDefaults() },
  { id: 'theme', title: 'Toggle Dark/Light Mode', icon: '🌓', hotkey: 'T', handler: () => toggleTheme() },
  { id: 'bounds', title: 'Toggle Bounds', icon: '📏', handler: () => toggleBounds() },
  { id: 'race', title: 'Run WASM vs JS Race', icon: '⚡', handler: () => runRace() },
  { id: 'capture', title: 'Capture 3D Screenshot', icon: '📷', handler: () => capture3D() },
  { id: 'export-chart', title: 'Export Chart as PNG', icon: '📊', handler: () => exportChart() }
];

const toggleCommandPalette = () => {
  state.commandPaletteActive = !state.commandPaletteActive;
  const palette = mustGet('command-palette');
  const backdrop = mustGet('command-palette-backdrop');

  if (state.commandPaletteActive) {
    if (palette) palette.classList.add('active');
    if (backdrop) backdrop.classList.remove('hidden');
    const searchInput = mustGet('command-search');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    renderCommands();
  } else {
    if (palette) palette.classList.remove('active');
    if (backdrop) backdrop.classList.add('hidden');
  }
};

const renderCommands = (filter = '') => {
  const list = mustGet('command-list');
  if (!list) return;

  const filtered = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(filter.toLowerCase())
  );

  list.replaceChildren();
  filtered.forEach((cmd, idx) => {
    const item = document.createElement('div');
    item.className = `command-item ${idx === 0 ? 'selected' : ''}`;
    item.dataset.commandId = cmd.id;

    const row = document.createElement('div');
    row.className = 'flex items-center justify-between';

    const left = document.createElement('div');
    left.className = 'flex items-center gap-3';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'text-lg';
    iconSpan.textContent = cmd.icon;
    const titleSpan = document.createElement('span');
    titleSpan.className = 'text-sm text-slate-200';
    titleSpan.textContent = cmd.title;
    left.append(iconSpan, titleSpan);

    row.appendChild(left);

    if (cmd.hotkey) {
      const kbd = document.createElement('kbd');
      kbd.className = 'text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded';
      kbd.textContent = cmd.hotkey;
      row.appendChild(kbd);
    }

    item.appendChild(row);
    item.addEventListener('click', () => {
      const found = commands.find(c => c.id === cmd.id);
      if (found) {
        found.handler();
        toggleCommandPalette();
      }
    });

    list.appendChild(item);
  });
};

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

const exportCSV = () => {
  if (!state.history || state.history.length === 0) {
    showToast('No data to export. Run an optimization first!', 'warning');
    return;
  }

  const csv = state.history.map(h => `${h.iter},${h.best}`).join('\n');
  const blob = new Blob([`iteration,best_f\n${csv}`], { type: 'text/csv' });
  downloadBlob(blob, `cmaes-${state.currentBenchmark}-${Date.now()}.csv`);
  showToast('CSV exported successfully', 'success');
};

const exportJSON = () => {
  if (!state.history || state.history.length === 0) {
    showToast('No data to export. Run an optimization first!', 'warning');
    return;
  }

  const data = {
    config: {
      benchmark: state.currentBenchmark,
      lambda: mustGet('lambda')?.value,
      sigma: mustGet('sigma')?.value,
      seed: mustGet('seed')?.value,
      maxIters: mustGet('iters')?.value
    },
    results: {
      history: state.history,
      finalBest: state.history[state.history.length - 1]?.best
    },
    timestamp: new Date().toISOString(),
    generator: 'CMA-ES WebAssembly Benchmark Gallery'
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `cmaes-${state.currentBenchmark}-${Date.now()}.json`);
  showToast('JSON exported successfully', 'success');
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const shareConfiguration = () => {
  saveState(); // This updates the URL
  const url = window.location.href;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Configuration URL copied to clipboard!', 'success');
    }).catch(() => {
      fallbackCopyToClipboard(url);
    });
  } else {
    fallbackCopyToClipboard(url);
  }
};

const fallbackCopyToClipboard = (text) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showToast('Configuration URL copied!', 'success');
  } catch (err) {
    showToast('Failed to copy URL', 'error');
  }
  document.body.removeChild(textarea);
};

// ============================================================================
// CHART EXPORT
// ============================================================================

const exportChart = () => {
  const svg = mustGet('line');
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  downloadBlob(blob, `cmaes-chart-${Date.now()}.svg`);
  showToast('Chart exported as SVG', 'success');
};

const capture3D = () => {
  // Will be implemented when Three.js renderer is set up
  showToast('3D capture feature coming soon!', 'info');
};

// ============================================================================
// PRESET SYSTEM
// ============================================================================

const presets = {
  'quick-sphere': {
    benchmark: 'sphere',
    lambda: 16,
    sigma: 1.0,
    iters: 100,
    seed: 42
  },
  'multimodal': {
    benchmark: 'rastrigin',
    lambda: 64,
    sigma: 2.0,
    iters: 300,
    seed: 123
  },
  'high-dim': {
    benchmark: 'ackley',
    lambda: 96,
    sigma: 1.5,
    iters: 400,
    seed: 999
  },
  'bounded': {
    benchmark: 'schwefel',
    lambda: 48,
    sigma: 50.0,
    iters: 250,
    seed: 777,
    boundsEnabled: true,
    boundLo: -500,
    boundHi: 500
  }
};

const loadPreset = (presetId) => {
  const preset = presets[presetId];
  if (!preset) return;

  // Apply preset values
  const setVal = (id, val) => {
    const el = mustGet(id);
    if (el) {
      if (el.type === 'checkbox') {
        el.checked = val;
      } else {
        el.value = val;
      }
    }
  };

  setVal('bench', preset.benchmark);
  setVal('lambda', preset.lambda);
  setVal('sigma', preset.sigma);
  setVal('iters', preset.iters);
  setVal('seed', preset.seed);

  if (preset.boundsEnabled) {
    setVal('bounds-toggle', true);
    setVal('bound-lo', preset.boundLo);
    setVal('bound-hi', preset.boundHi);
  }

  // Update mobile controls too if they exist
  setVal('bench-mobile', preset.benchmark);
  setVal('lambda-mobile', preset.lambda);
  setVal('sigma-mobile', preset.sigma);

  updateBenchmarkInfo(preset.benchmark);
  showToast(`Loaded preset: ${presetId}`, 'success', 2000);
};

// ============================================================================
// TUTORIAL SYSTEM
// ============================================================================

const tutorialSteps = [
  {
    title: "Welcome!",
    content: `<p class="mb-3">Welcome to the CMA-ES Benchmark Playground! This interactive tool lets you visualize how the Covariance Matrix Adaptation Evolution Strategy optimizes various test functions.</p>
              <p class="mb-3">CMA-ES is a state-of-the-art optimization algorithm that:</p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Adapts its search distribution based on the landscape</li>
                <li>Handles ill-conditioned and non-separable problems</li>
                <li>Requires no gradient information (derivative-free)</li>
                <li>Scales well to medium-dimensional problems</li>
              </ul>`
  },
  {
    title: "Choosing a Benchmark",
    content: `<p class="mb-3">The benchmark selector lets you choose from 9 classic test functions, each with unique characteristics:</p>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li><strong>Sphere:</strong> Simple unimodal - great for beginners</li>
                <li><strong>Rastrigin:</strong> Highly multimodal - many local minima</li>
                <li><strong>Ackley:</strong> Nearly flat with central peak</li>
                <li><strong>Schwefel:</strong> Deceptive landscape</li>
              </ul>
              <p class="mt-3 text-sm text-slate-400">💡 Start with Sphere to see basic convergence behavior!</p>`
  },
  {
    title: "Parameters Matter",
    content: `<p class="mb-3">The two key parameters you'll adjust are:</p>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li><strong>Lambda (λ):</strong> Population size - how many candidates to sample per iteration. Higher = more exploration but slower.</li>
                <li><strong>Sigma (σ):</strong> Step size - controls the search radius. Larger values explore farther from the current mean.</li>
              </ul>
              <p class="mt-3 text-sm bg-amber-500/10 border border-amber-500/30 rounded p-2">
                <strong>Pro tip:</strong> CMA-ES automatically adapts σ during optimization, but setting a good initial value helps!
              </p>`
  },
  {
    title: "Visualizations",
    content: `<p class="mb-3">The playground provides two complementary views:</p>
              <ol class="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Convergence Plot (top):</strong> Shows best fitness over iterations. Watch it drop as CMA-ES finds better solutions!</li>
                <li><strong>3D Surface (bottom):</strong> Real-time view of candidate points on the optimization landscape. The blue points are current candidates, the yellow sphere is the best point found.</li>
              </ol>
              <p class="mt-3 text-sm text-slate-400">Use the scrubber at the bottom to replay any iteration!</p>`
  },
  {
    title: "Interactive Features",
    content: `<p class="mb-3">Explore these powerful features:</p>
              <ul class="list-disc list-inside space-y-2 ml-4">
                <li><strong>Race Mode:</strong> Compare WASM performance vs JavaScript baseline</li>
                <li><strong>Custom Functions:</strong> Write your own f(x) to optimize</li>
                <li><strong>Bounds:</strong> Constrain the search space</li>
                <li><strong>Export:</strong> Download results as CSV/JSON</li>
                <li><strong>Share:</strong> Copy URL to share your configuration</li>
              </ul>
              <p class="mt-3 text-sm bg-sky-500/10 border border-sky-500/30 rounded p-2">
                <strong>Keyboard shortcuts:</strong> Press <kbd class="bg-slate-800 px-2 py-1 rounded text-xs">Ctrl+K</kbd> for the command palette!
              </p>`
  },
  {
    title: "Ready to Go!",
    content: `<p class="mb-3">You're all set! Here's what to do next:</p>
              <ol class="list-decimal list-inside space-y-2 ml-4">
                <li>Click the big "🚀 Run Optimization" button</li>
                <li>Watch the algorithm explore the landscape</li>
                <li>Try different benchmarks and parameters</li>
                <li>Experiment with your own custom functions</li>
              </ol>
              <p class="mt-4 text-center text-sm text-slate-400">
                Have fun optimizing! 🎯
              </p>`
  }
];

const startTutorial = () => {
  state.tutorialStep = 0;
  const overlay = mustGet('tutorial-overlay');
  if (overlay) {
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    renderTutorialStep();
  }
};

const renderTutorialStep = () => {
  const step = tutorialSteps[state.tutorialStep];
  if (!step) return;

  const content = mustGet('tutorial-content');
  const stepCount = mustGet('tutorial-step-count');
  const prevBtn = mustGet('tutorial-prev');
  const nextBtn = mustGet('tutorial-next');

  if (content) {
    const parser = new DOMParser();
    const fragmentDoc = parser.parseFromString(
      `<div><h4 class="text-lg font-semibold mb-2">${step.title}</h4>${step.content}</div>`,
      'text/html'
    );
    const wrapper = fragmentDoc.body.firstElementChild;
    if (wrapper) {
      const nodes = Array.from(wrapper.childNodes).map((n) => content.ownerDocument.importNode(n, true));
      content.replaceChildren(...nodes);
    }
  }

  if (stepCount) {
    stepCount.textContent = `Step ${state.tutorialStep + 1} of ${tutorialSteps.length}`;
  }

  if (prevBtn) {
    prevBtn.disabled = state.tutorialStep === 0;
  }

  if (nextBtn) {
    nextBtn.textContent = state.tutorialStep === tutorialSteps.length - 1 ? 'Finish' : 'Next';
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const runOptimization = () => {
  const runBtn = mustGet('run');
  if (runBtn) runBtn.click();
};

const runJsBaselineOnly = () => {
  // Enhanced UI does not expose a standalone JS baseline button; reuse race handler
  runRace();
  showToast('Running JS baseline via race mode', 'info', 1800);
};

const runRace = () => {
  const raceBtn = mustGet('run-race');
  if (raceBtn) raceBtn.click();
};

const loadBenchmark = (benchKey) => {
  const benchSelect = mustGet('bench');
  if (benchSelect) {
    benchSelect.value = benchKey;
    benchSelect.dispatchEvent(new Event('change'));
  }
  updateBenchmarkInfo(benchKey);
  state.currentBenchmark = benchKey;
};

const cycleBenchmark = (direction) => {
  const benchSelect = mustGet('bench');
  if (!benchSelect) return;

  const options = Array.from(benchSelect.options);
  const currentIndex = options.findIndex(opt => opt.selected);
  const newIndex = (currentIndex + direction + options.length) % options.length;
  benchSelect.value = options[newIndex].value;
  benchSelect.dispatchEvent(new Event('change'));
  updateBenchmarkInfo(options[newIndex].value);
};

const resetToDefaults = () => {
  const setVal = (id, val) => {
    const el = mustGet(id);
    if (el) el.value = val;
  };

  setVal('bench', 'sphere');
  setVal('lambda', 32);
  setVal('sigma', 1.2);
  setVal('iters', 250);
  setVal('seed', 42);
  setVal('bound-lo', -5);
  setVal('bound-hi', 5);

  const boundsToggle = mustGet('bounds-toggle');
  if (boundsToggle) boundsToggle.checked = false;

  showToast('Reset to default values', 'info', 2000);
};

const toggleBounds = () => {
  const boundsToggle = mustGet('bounds-toggle');
  if (!boundsToggle) return;
  boundsToggle.checked = !boundsToggle.checked;
  boundsToggle.dispatchEvent(new Event('change'));
  showToast(boundsToggle.checked ? 'Bounds enabled' : 'Bounds disabled', 'info', 1500);
};

const closeAllOverlays = () => {
  const tutorialOverlay = mustGet('tutorial-overlay');
  if (tutorialOverlay) {
    tutorialOverlay.classList.add('hidden');
    tutorialOverlay.classList.remove('flex');
  }

  if (state.commandPaletteActive) {
    toggleCommandPalette();
  }
};

// ============================================================================
// MOBILE BOTTOM SHEET
// ============================================================================

const initMobileSheet = () => {
  const sheet = mustGet('mobile-sheet');
  const handleBar = sheet?.querySelector('.handle-bar');
  const closeBtn = mustGet('close-sheet');

  if (!sheet || !handleBar) return;

  let startY = 0;
  let currentY = 0;
  let isDragging = false;

  const open = () => sheet.classList.add('open');
  const close = () => sheet.classList.remove('open');
  const toggle = () => sheet.classList.contains('open') ? close() : open();

  handleBar.addEventListener('click', toggle);
  handleBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Touch gestures
  handleBar.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isDragging = true;
  });

  handleBar.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    // Only allow dragging down when open, or up when closed
    if (sheet.classList.contains('open') && deltaY > 50) {
      close();
      isDragging = false;
    } else if (!sheet.classList.contains('open') && deltaY < -50) {
      open();
      isDragging = false;
    }
  });

  handleBar.addEventListener('touchend', () => {
    isDragging = false;
  });
};

// Sync mobile and desktop controls
const syncControls = () => {
  const pairs = [
    ['bench', 'bench-mobile'],
    ['lambda', 'lambda-mobile'],
    ['sigma', 'sigma-mobile'],
    ['iters', 'iters-mobile'],
    ['seed', 'seed-mobile']
  ];

  pairs.forEach(([desktopId, mobileId]) => {
    const desktop = mustGet(desktopId);
    const mobile = mustGet(mobileId);

    if (desktop && mobile) {
      desktop.addEventListener('change', () => {
        mobile.value = desktop.value;
      });

      mobile.addEventListener('change', () => {
        desktop.value = mobile.value;
      });
    }
  });
};

// ============================================================================
// INITIALIZATION
// ============================================================================

export const initEnhancedApp = () => {
  console.log('Initializing enhanced CMA-ES app...');

  // Load saved state
  const saved = loadState();
  if (saved) {
    const setVal = (id, val) => {
      const el = mustGet(id);
      if (el) el.value = val;
    };

    setVal('bench', saved.benchmark);
    setVal('lambda', saved.lambda);
    setVal('sigma', saved.sigma);
    setVal('iters', saved.iters);
    setVal('seed', saved.seed);

    if (saved.theme) {
      state.isDark = saved.theme === 'dark';
      const root = document.documentElement;
      if (root) {
        root.classList.toggle('light', !state.isDark);
        root.classList.toggle('dark', state.isDark);
      }
    }
  }

  // Initialize all systems
  initTooltips();
  initKeyboardShortcuts();
  initMobileSheet();
  syncControls();

  // Set up event listeners
  const themeToggle = mustGet('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  const startTutorialBtn = mustGet('start-tutorial');
  if (startTutorialBtn) {
    startTutorialBtn.addEventListener('click', startTutorial);
  }

  const tutorialClose = mustGet('tutorial-close');
  if (tutorialClose) {
    tutorialClose.addEventListener('click', closeAllOverlays);
  }

  const tutorialSkip = mustGet('tutorial-skip');
  if (tutorialSkip) {
    tutorialSkip.addEventListener('click', closeAllOverlays);
  }

  const tutorialPrev = mustGet('tutorial-prev');
  if (tutorialPrev) {
    tutorialPrev.addEventListener('click', () => {
      if (state.tutorialStep > 0) {
        state.tutorialStep--;
        renderTutorialStep();
      }
    });
  }

  const tutorialNext = mustGet('tutorial-next');
  if (tutorialNext) {
    tutorialNext.addEventListener('click', () => {
      if (state.tutorialStep < tutorialSteps.length - 1) {
        state.tutorialStep++;
        renderTutorialStep();
      } else {
        closeAllOverlays();
      }
    });
  }

  // Command palette
  const commandSearch = mustGet('command-search');
  if (commandSearch) {
    commandSearch.addEventListener('input', (e) => {
      renderCommands(e.target.value);
    });

    commandSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleCommandPalette();
      } else if (e.key === 'Enter') {
        const selected = document.querySelector('.command-item.selected');
        if (selected) selected.click();
      }
    });
  }

  const commandBackdrop = mustGet('command-palette-backdrop');
  if (commandBackdrop) {
    commandBackdrop.addEventListener('click', toggleCommandPalette);
  }

  // Preset cards
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const presetId = card.dataset.preset;
      if (presetId) loadPreset(presetId);
    });
  });

  // Export buttons
  const exportCSVBtn = mustGet('export-csv');
  if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportCSV);

  const exportJSONBtn = mustGet('export-json');
  if (exportJSONBtn) exportJSONBtn.addEventListener('click', exportJSON);

  const exportChartBtn = mustGet('export-chart');
  if (exportChartBtn) exportChartBtn.addEventListener('click', exportChart);

  const shareBtn = mustGet('share-config');
  if (shareBtn) shareBtn.addEventListener('click', shareConfiguration);

  // Benchmark change handler
  const benchSelect = mustGet('bench');
  if (benchSelect) {
    benchSelect.addEventListener('change', (e) => {
      updateBenchmarkInfo(e.target.value);
      state.currentBenchmark = e.target.value;
      saveState();
    });

    // Initial update
    updateBenchmarkInfo(benchSelect.value);
  }

  // Mobile advanced options toggle
  const toggleAdvanced = mustGet('toggle-advanced');
  const advancedOptions = mustGet('advanced-options');
  if (toggleAdvanced && advancedOptions) {
    toggleAdvanced.addEventListener('click', () => {
      const isHidden = advancedOptions.classList.contains('hidden');
      advancedOptions.classList.toggle('hidden');
      const arrow = toggleAdvanced.querySelector('svg');
      if (arrow) {
        arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0)';
      }
    });
  }

  // Save state on changes
  ['lambda', 'sigma', 'iters', 'seed', 'bounds-toggle', 'bound-lo', 'bound-hi'].forEach(id => {
    const el = mustGet(id);
    if (el) {
      el.addEventListener('change', saveState);
    }
  });

  console.log('Enhanced app initialized!');
  showToast('Welcome to CMA-ES Playground! Press Ctrl+K for commands.', 'info', 4000);
};

// Auto-initialize when loaded as module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancedApp);
} else {
  initEnhancedApp();
}
