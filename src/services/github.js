import { formatRepoData } from '../utils/repoParser';

export class GitHubError extends Error {
  constructor(message, status, type) {
    super(message);
    this.status = status;
    this.type = type;
  }
}

function handleResponseError(res, data) {
  if (res.status === 401) {
    throw new GitHubError("This repo is private. RepoXray only works on public repos.", 401, 'PRIVATE');
  }
  if (res.status === 403) {
    const reset = res.headers.get('X-RateLimit-Reset');
    const resetStr = reset ? new Date(reset * 1000).toLocaleTimeString() : "a few minutes";
    throw new GitHubError(`GitHub rate limit hit. Try again at ${resetStr}.`, 403, 'RATE_LIMIT');
  }
  if (res.status === 404) {
    throw new GitHubError("Repo not found. Check the URL and try again.", 404, 'NOT_FOUND');
  }
  if (res.status === 422) {
    throw new GitHubError("GitHub couldn't process this request.", 422, 'UNKNOWN');
  }
  if (res.status >= 500) {
    throw new GitHubError("GitHub is having issues. Try again shortly.", res.status, 'UNKNOWN');
  }
  throw new GitHubError(data?.message || "Unknown GitHub API error", res.status, 'UNKNOWN');
}

async function apiFetch(endpoint) {
  const token = localStorage.getItem('repoxray_gh_token');
  const headers = { 'Accept': 'application/vnd.github.v3+json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  let res;
  try {
    res = await fetch(`https://api.github.com${endpoint}`, { headers });
  } catch (err) {
    throw new GitHubError("Check your internet connection and try again.", 0, 'NETWORK_ERROR');
  }

  const limitRemaining = res.headers.get('X-RateLimit-Remaining');
  if (limitRemaining === '0') {
    const reset = res.headers.get('X-RateLimit-Reset');
    const resetStr = reset ? new Date(reset * 1000).toLocaleTimeString() : "a few minutes";
    throw new GitHubError(`GitHub rate limit hit. Try again at ${resetStr}.`, 403, 'RATE_LIMIT');
  }

  if (!res.ok) {
    let data;
    try { data = await res.json(); } catch(e) {}
    handleResponseError(res, data);
  }

  return res.json();
}

async function fetchRepoMeta(owner, repo) {
  return apiFetch(`/repos/${owner}/${repo}`);
}

async function fetchREADME(owner, repo) {
  try {
    const data = await apiFetch(`/repos/${owner}/${repo}/readme`);
    if(!data || !data.content) return "";
    return data;
  } catch(err) {
    if (err.type === 'NOT_FOUND') return "";
    throw err;
  }
}

async function fetchFileTree(owner, repo, branch) {
  const data = await apiFetch(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
  let tree = data.tree || [];
  tree = tree.filter(t => !(t.type === 'blob' && t.size > 1000000));
  if (tree.length > 500) {
     tree.sort((a,b) => {
        if (a.type !== b.type) return a.type === 'blob' ? -1 : 1;
        return a.path.split('/').length - b.path.split('/').length;
     });
     tree = tree.slice(0, 500);
  }
  return tree;
}

function decodeBase64(base64Str) {
    try {
        const str = base64Str.replace(/\n/g, '');
        const binary_string = window.atob(str);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    } catch(e) {
        return "";
    }
}

async function fetchSourceFiles(owner, repo, tree, defaultBranch) {
   // Score each file
   const scoredFiles = tree.map(f => {
       let score = 0;
       if (f.type !== 'blob') return { ...f, score: -100 };
       
       const name = f.path.split('/').pop().toLowerCase();
       const ext = name.includes('.') ? '.' + name.split('.').pop() : '';
       const depth = f.path.split('/').length;
       
       // +10 if priority logic names
       if (['index.js', 'main.js', 'app.js', 'index.ts', 'main.ts', 'main.py', 'app.py'].includes(name)) score += 10;
       // +8 if extension is code
       if (['.js', '.ts', '.py', '.go', '.rs', '.java'].includes(ext)) score += 8;
       // +5 if path depth is 1 or 2
       if (depth <= 2) score += 5;
       // +3 if name contains util, helper, service, api, core
       if (/util|helper|service|api|core/.test(name)) score += 3;
       // -5 if path contains node_modules, dist, build, .min., vendor
       if (/node_modules|dist|build|\.min\.|vendor/.test(f.path)) score -= 5;
       
       return { ...f, score, name, ext };
   });
   
   // Sort by score descending and take top 2
   const topFiles = scoredFiles
       .filter(f => f.score > 0)
       .sort((a,b) => b.score - a.score)
       .slice(0, 2);
       
   const fetchPromises = topFiles.map(async (f) => {
       try {
           const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/${f.path}`;
           const res = await fetch(rawUrl);
           if (!res.ok) return null;
           
           let content = await res.text();
           if (content.length > 3000) {
               content = content.substring(0, 3000) + "\n// ... [truncated for analysis]";
           }
           
           let language = "Unknown";
           if (f.ext === '.js' || f.ext === '.jsx') language = "JavaScript";
           else if (f.ext === '.ts' || f.ext === '.tsx') language = "TypeScript";
           else if (f.ext === '.py') language = "Python";
           else if (f.ext === '.go') language = "Go";
           else if (f.ext === '.rs') language = "Rust";
           else if (f.ext === '.java') language = "Java";
           else if (f.ext === '.rb') language = "Ruby";
           else if (f.ext === '.php') language = "PHP";
           
           return {
               path: f.path,
               content: content,
               size: f.size,
               language
           };
       } catch (e) {
           return null;
       }
   });
   
   const results = await Promise.allSettled(fetchPromises);
   return results.filter(r => r.status === 'fulfilled' && r.value !== null).map(r => r.value);
}

export default async function fetchAllRepoData(owner, repo, onProgress = () => {}) {
  const meta = await fetchRepoMeta(owner, repo);
  onProgress('meta');
  
  const [readme, tree, languagesRes] = await Promise.all([
     fetchREADME(owner, repo).then(r => { onProgress('readme'); return r; }),
     fetchFileTree(owner, repo, meta.default_branch).then(t => { onProgress('tree'); return t; }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: localStorage.getItem('repoxray_gh_token') ? { 'Authorization': `Bearer ${localStorage.getItem('repoxray_gh_token')}` } : {}
      }).then(res => res.json()).catch(() => ({}))
  ]);
  meta.languages = languagesRes; // Append languages
  
  const files = await fetchSourceFiles(owner, repo, tree, meta.default_branch);
  onProgress('files');
  
  return formatRepoData(meta, readme, tree, files);
}
