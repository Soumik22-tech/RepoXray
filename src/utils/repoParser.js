export function parseGitHubURL(url) {
  if (!url) throw new Error("Invalid URL");
  
  let cleanUrl = url.trim();
  cleanUrl = cleanUrl.replace(/\.git$/, '');
  
  cleanUrl = cleanUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  if (cleanUrl.startsWith('github.com/')) {
    cleanUrl = cleanUrl.substring('github.com/'.length);
  } else if (cleanUrl.includes('github.com')) {
    throw new Error("Not a valid GitHub URL");
  }

  const parts = cleanUrl.split('/').filter(Boolean);
  if (parts.length < 1) {
    throw new Error("Not a valid GitHub URL");
  }
  if (parts.length === 1) {
    throw new Error("Missing repository name");
  }
  
  const owner = parts[0];
  const repo = parts[1];
  
  const regex = /^[a-zA-Z0-9._-]+$/;
  if (!regex.test(owner) || !regex.test(repo)) {
    throw new Error("Invalid characters in URL");
  }
  
  return { owner, repo };
}

export function getRelativeTime(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

export function formatRepoData(rawMeta, readme, tree, files) {
  let readmeContent = "";
  if (readme && readme.content) {
    try {
      const base64Str = readme.content.replace(/\n/g, '');
      const binary_string = window.atob(base64Str);
      const len = binary_string.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      readmeContent = new TextDecoder().decode(bytes);
    } catch(e) {}
  } else if (typeof readme === 'string') {
    readmeContent = readme;
  }

  const readmeLower = readmeContent.toLowerCase();
  
  let totalFiles = 0;
  let totalDirs = 0;
  let hasTests = false;
  let hasCI = false;
  let hasDocs = false;
  let hasDockerfile = false;
  let hasLintConfig = false;
  let hasEnvExample = false;
  let hasEnvActual = false;
  let depth = 0;
  let rootFiles = [];
  let packageManager = "unknown";
  
  if (tree && Array.isArray(tree)) {
    tree.forEach(item => {
      const pathParts = item.path.split('/');
      depth = Math.max(depth, pathParts.length);
      
      if (item.type === 'blob') totalFiles++;
      if (item.type === 'tree') totalDirs++;
      
      const fileName = pathParts[pathParts.length - 1];
      const isRoot = pathParts.length === 1;
      
      if (isRoot) rootFiles.push(fileName);
      
      if (fileName.includes('test') || fileName.includes('.spec.')) hasTests = true;
      if (item.path.includes('test/') || item.path.includes('__tests__/')) hasTests = true;
      
      if (item.path.includes('.github/workflows') || item.path.includes('.travis.yml')) hasCI = true;
      if (item.path.includes('docs/') || item.path.includes('documentation/')) hasDocs = true;
      
      if (fileName === 'Dockerfile') hasDockerfile = true;
      if (fileName.includes('.eslintrc') || fileName.includes('.prettierrc')) hasLintConfig = true;
      if (fileName === '.env.example') hasEnvExample = true;
      if (fileName === '.env') hasEnvActual = true;
      
      if (fileName === 'package.json' || fileName === 'yarn.lock' || fileName === 'pnpm-lock.yaml') {
        if (fileName === 'yarn.lock') packageManager = 'yarn';
        else if (fileName === 'pnpm-lock.yaml') packageManager = 'pnpm';
        else if (packageManager === 'unknown') packageManager = 'npm';
      } else if (fileName === 'requirements.txt' || fileName === 'pyproject.toml') {
        packageManager = 'pip';
      } else if (fileName === 'Cargo.toml') {
        packageManager = 'cargo';
      } else if (fileName === 'go.mod') {
        packageManager = 'go';
      }
    });
  }
  
  let dependencyInfo = null;
  const packageJsonFile = files.find(f => f.path === 'package.json');
  if (packageJsonFile) {
    try {
      const parsed = JSON.parse(packageJsonFile.content);
      const count = Object.keys(parsed.dependencies || {}).length;
      const devCount = Object.keys(parsed.devDependencies || {}).length;
      const hasOutdatedClues = packageJsonFile.content.includes('"react": "^16') || packageJsonFile.content.includes('webpack": "^3');
      dependencyInfo = {
        raw: packageJsonFile.content,
        parsed,
        count,
        devCount,
        hasOutdatedClues
      };
    } catch(e) {
      dependencyInfo = { raw: packageJsonFile.content, parsed: null, count: 0, devCount: 0, hasOutdatedClues: false };
    }
  } else {
      const depFile = files.find(f => ['requirements.txt', 'Cargo.toml', 'go.mod', 'pyproject.toml'].includes(f.path));
      if (depFile) {
           dependencyInfo = { raw: depFile.content, parsed: null, count: 0, devCount: 0, hasOutdatedClues: false };
      }
  }

  return {
    name: rawMeta.name,
    owner: rawMeta.owner?.login || '',
    fullName: rawMeta.full_name,
    url: rawMeta.html_url,
    description: rawMeta.description,
    language: rawMeta.language,
    stars: rawMeta.stargazers_count,
    forks: rawMeta.forks_count,
    openIssues: rawMeta.open_issues_count,
    watchers: rawMeta.watchers_count,
    size: rawMeta.size,
    defaultBranch: rawMeta.default_branch,
    createdAt: rawMeta.created_at,
    updatedAt: rawMeta.updated_at,
    pushedAt: rawMeta.pushed_at,
    lastCommitRelative: getRelativeTime(rawMeta.pushed_at),
    license: rawMeta.license?.spdx_id || null,
    topics: rawMeta.topics || [],
    hasWiki: rawMeta.has_wiki,
    hasIssues: rawMeta.has_issues,
    isArchived: rawMeta.archived,
    isFork: rawMeta.fork,
    readme: {
      content: readmeContent,
      size: readmeContent.length,
      isEmpty: readmeContent.length < 100,
      hasBadges: readmeLower.includes('img.shields.io') || readmeLower.includes('badge'),
      hasInstallInstructions: readmeLower.includes('install') || readmeLower.includes('npm i') || readmeLower.includes('pip install'),
      hasUsageExamples: readmeLower.includes('usage') || readmeLower.includes('example') || readmeLower.includes('```'),
      wordCount: readmeContent.split(/\s+/).filter(Boolean).length
    },
    fileTree: {
      totalFiles,
      totalDirs,
      depth,
      hasTests,
      hasCI,
      hasDocs,
      hasDockerfile,
      hasLintConfig,
      hasEnvExample,
      hasEnvActual,
      packageManager,
      rootFiles
    },
    sourceFiles: files,
    dependencyInfo
  };
}
