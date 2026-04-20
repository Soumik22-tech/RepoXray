import { useState, useCallback, useRef } from 'react';
import fetchAllRepoData from '../services/github';
import { buildRoastPrompt } from '../services/roastPrompt';
import { callGeminiRoast } from '../services/geminiService';
import { parseRoastResponse } from '../utils/parseRoast';
import { mockRoast } from '../data/mockRoast';

export function useRoast() {
  const [status, setStatus] = useState('idle');
  const [roastData, setRoastData] = useState(null);
  const [repoMeta, setRepoMeta] = useState(null);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const countdownRef = useRef(null);

  function startCountdown(seconds) {
    let remaining = seconds;
    setWaitSeconds(remaining);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setWaitSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
      }
    }, 1000);
  }

  const roast = useCallback(async (repoUrl, apiKey) => {
    setError(null);
    setRoastData(null);
    setRetryAttempt(0);

    // Normalize URL for cache key
    const cleanUrl = repoUrl.toLowerCase().trim().replace(/\/$/, '');
    const cacheKey = `repoxray_cache_${btoa(cleanUrl)}`;

    try {
      if (typeof window !== 'undefined' && window.location.search.includes('mock=true')) {
        setStatus('fetching_github');
        setLoadingMessage('Loading mock data...');
        setTimeout(() => {
             setRoastData({
               ...mockRoast,
               repo: mockRoast.repo
             });
             setStatus('done');
        }, 1500);
        return;
      }

      // Check Cache First
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - timestamp < oneHour) {
          setStatus('fetching_github');
          setLoadingMessage('Retrieving cached roast from memory...');
          setTimeout(() => {
            setRoastData(data);
            setStatus('done');
          }, 1000);
          return;
        }
      }

      setStatus('fetching_github');
      setLoadingMessage('Cloning your crimes against clean code...');
      
      const { owner, repo } = (await import('../utils/repoParser')).parseGitHubURL(repoUrl);
      const repoDataObj = await fetchAllRepoData(owner, repo);
      setRepoMeta(repoDataObj);

      setStatus('building_prompt');
      setLoadingMessage('Preparing the roast chamber...');
      const prompt = buildRoastPrompt(repoDataObj);

      setStatus('calling_ai');
      setLoadingMessage('AI is reading your spaghetti...');

      const onStatusUpdate = (newStatus, seconds) => {
        if (newStatus === 'rate_limited_waiting') {
          setStatus('rate_limited_waiting');
          setWaitSeconds(seconds);
          setRetryAttempt(prev => prev + 1);
          startCountdown(seconds);
        } else if (newStatus === 'calling_ai') {
          setStatus('calling_ai');
          setWaitSeconds(null);
          setLoadingMessage('Retrying the roast...');
        }
      };

      const rawResponse = await callGeminiRoast(prompt, apiKey, onStatusUpdate);

      setStatus('parsing');
      setLoadingMessage('Calculating emotional damage...');
      const parsed = parseRoastResponse(rawResponse);

      parsed.repo = repoDataObj;

      // Save to Cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data: parsed,
        timestamp: Date.now()
      }));

      setRoastData(parsed);
      setStatus('done');

    } catch (err) {
      setStatus('error');
      setError({ message: mapError(err.message), type: err.type || 'UNKNOWN' });
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setRoastData(null);
    setRepoMeta(null);
    setError(null);
    setLoadingMessage('');
    clearInterval(countdownRef.current);
    setWaitSeconds(null);
    setRetryAttempt(0);
  }, []);

  return { status, roastData, repoMeta, error, loadingMessage, waitSeconds, retryAttempt, roast, reset };
}

function mapError(code) {
  const map = {
    'INVALID_API_KEY':       'Your Gemini API key is invalid. Double-check it at aistudio.google.com',
    'API_KEY_FORBIDDEN':     'This API key does not have permission to use Gemini. Check your Google AI Studio project.',
    'RATE_LIMITED':          'Gemini rate limit hit. Wait a minute and try again.',
    'RATE_LIMITED_EXHAUSTED': 'Rate limit exhausted after 4 retries. Wait 2 minutes and try again.',
    'GEMINI_SERVER_ERROR':   'Gemini is having a moment. Try again in 30 seconds.',
    'PARSE_FAILED':          'AI returned malformed data. This is rare — try again.',
    'NO_JSON_FOUND':         'Could not extract roast data from AI response. Try again.',
    'GEMINI_HTTP_503':       'Google\'s API servers are currently overloaded. Please try again.',
    'MISSING_FIELD:overallScore': 'AI response was incomplete. Try again.',
    'INVALID_GRADES':        'AI returned malformed grade data. Try again.',
    'INVALID_ROASTS':        'AI returned too few roasts. Try again.',
    'REPO_NOT_FOUND':        'GitHub repo not found. Check the URL and make sure it\'s public.',
    'PRIVATE_REPO':          'This repo is private. RepoXray only works on public repos.',
    'RATE_LIMIT_GITHUB':     'GitHub API rate limit hit. Wait 60 seconds and try again.',
    'BLOCKED:OTHER':         'Gemini blocked this request. Your code might be too dangerous to roast.',
    'EMPTY_RESPONSE':        'Gemini returned nothing. The AI might be speechless. Try again.',
    'NETWORK_ERROR':         'Check your internet connection. Disable VPN if you are using one.',
    'REQUEST_TIMEOUT':       'Gemini can be slow with large repos. Try again — it usually works on retry.',
  };
  return map[code] || code;
}
