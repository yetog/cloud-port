# AI Development

A comprehensive guide to integrating AI technologies into web applications, based on real-world implementations and production deployments.

## Overview

This guide covers practical AI integration patterns, focusing on conversational AI, music generation, and text-to-speech implementations. All examples are based on actual production deployments in the zaylegend.com portfolio.

## Contents

- [ElevenLabs Integration](#elevenlabs-integration)
- [Conversational AI Setup](#conversational-ai-setup)
- [Music Generation with AI](#music-generation-with-ai)
- [Real-World Problem Solving](#real-world-problem-solving)
- [Common Issues & Solutions](#common-issues--solutions)

## ElevenLabs Integration

### API Client Setup

The modern approach uses the official `@elevenlabs/client` SDK:

```typescript
import { ElevenLabsClient } from '@elevenlabs/client';

// Lazy initialization with fallback API key
let elevenlabsClient: ElevenLabsClient | null = null;

const getElevenLabsClient = () => {
  if (!elevenlabsClient) {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || 'fallback_key';
    elevenlabsClient = new ElevenLabsClient({ apiKey });
  }
  return elevenlabsClient;
};
```

**Key Learning**: Always use lazy initialization to prevent constructor errors during build time.

### Text-to-Speech Implementation

```typescript
export const generateSpeech = async (
  text: string,
  voiceId: string = 'EXAVITQu4vr4xnSDxMaL'
) => {
  try {
    const client = getElevenLabsClient();
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      }
    });

    // Convert stream to ArrayBuffer for browser compatibility
    const chunks: Uint8Array[] = [];
    const reader = audioStream.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const audioBuffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
    let offset = 0;
    for (const chunk of chunks) {
      audioBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    return audioBuffer;
  } catch (error) {
    console.error('Speech generation error:', error);
    throw new Error('Failed to generate speech');
  }
};
```

### Music Generation API

```typescript
export const generateMusic = async (
  prompt: string,
  durationMs: number = 30000,
  includeVocals: boolean = false
) => {
  try {
    const client = getElevenLabsClient();
    
    // Parameter structure is critical - use camelCase
    const requestBody = {
      prompt,
      musicLengthMs: durationMs, // NOT music_length_ms
      forceInstrumental: !includeVocals,
      modelId: "music_v1",
      respectSectionsDurations: true
    };

    const response = await client.music.generate(requestBody);
    return await streamToArrayBuffer(response);
  } catch (error) {
    if (error.message?.includes('copyrighted')) {
      throw new Error('Content may contain copyrighted material. Try a different prompt.');
    }
    throw error;
  }
};
```

**Critical Detail**: ElevenLabs API uses `musicLengthMs` (camelCase) not `music_length_ms` (snake_case). This was discovered through debugging production issues.

## Conversational AI Setup

### Modern Implementation Architecture

```
Frontend (Conversation SDK)
    ↓
    GET /api/signed-url (Backend)
    ↓
    ElevenLabs Conversational AI (Direct WebSocket)
```

### Backend Authentication Endpoint

```javascript
// Express.js endpoint for secure authentication
app.get('/api/signed-url', async (req, res) => {
  try {
    const signedUrl = await elevenlabs.convos.getSignedUrl({
      agent_id: process.env.ELEVEN_LABS_AGENT_ID
    });
    
    res.json({ signedUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get signed URL' });
  }
});
```

### Frontend Conversation Handler

```javascript
import { Conversation } from '@elevenlabs/client';

const startConversation = async () => {
  const response = await fetch('/api/signed-url');
  const { signedUrl } = await response.json();

  const conversation = await Conversation.startSession({
    signedUrl,
    onConnect: () => {
      console.log('Connected to AI agent');
      updateConnectionStatus(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from AI agent');
      updateConnectionStatus(false);
    },
    onModeChange: (mode) => {
      // mode.mode can be 'speaking' or 'listening'
      updateSpeakingIndicator(mode.mode === 'speaking');
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      showErrorMessage(error.message);
    }
  });

  return conversation;
};
```

## Music Generation with AI

### Contextual Music Creation

The key innovation is generating music that reflects the user's actual musical context:

```typescript
const generateContextualMusic = (chordProgression, selectedGenre, selectedKey, selectedScale) => {
  const chordNames = chordProgression.chords.map(chord => chord.name).join(', ');
  const moodDescription = selectedScale === 'minor' ? 'contemplative and emotional' : 'uplifting and bright';
  const genreInfo = genres.find(g => g.id === selectedGenre);
  
  return `Create a ${moodDescription} ${selectedGenre} composition in ${selectedKey} ${selectedScale} 
          featuring the chord progression: ${chordNames}. ${genreInfo?.description}. 
          Medium tempo, professional arrangement. ${includeVocals ? 'Include subtle vocal harmonies' : 'Pure instrumental'}.`;
};
```

### Genre Configuration

```typescript
const musicGenres = [
  { 
    id: 'ambient', 
    name: 'Ambient / Atmospheric', 
    description: 'Ethereal, spacious soundscapes with subtle progressions and atmospheric textures' 
  },
  { 
    id: 'cinematic', 
    name: 'Cinematic / Orchestral', 
    description: 'Epic orchestral arrangements with dramatic builds and emotional depth' 
  },
  { 
    id: 'electronic', 
    name: 'Electronic / Synth', 
    description: 'Modern electronic production with synthesizers and digital textures' 
  }
  // ... more genres
];
```

## Real-World Problem Solving

### Case Study: ElevenLabs API Constructor Error

**Problem**: `Lq.ElevenLabsApi is not a constructor`
**Investigation**: Discovered incorrect class name in documentation
**Solution**: Use `ElevenLabsClient` instead of `ElevenLabsApi`

```typescript
// ❌ Wrong (from outdated docs)
import { ElevenLabsApi } from '@elevenlabs/client';
const client = new ElevenLabsApi({ apiKey });

// ✅ Correct
import { ElevenLabsClient } from '@elevenlabs/client';
const client = new ElevenLabsClient({ apiKey });
```

### Case Study: Duration Parameter Not Respected

**Problem**: Generated music ignored duration settings
**Investigation**: API calls succeeded but duration was always ~30 seconds
**Solution**: Parameter naming convention fix

```typescript
// ❌ Wrong (snake_case)
{
  music_length_ms: 60000
}

// ✅ Correct (camelCase)  
{
  musicLengthMs: 60000
}
```

**Learning**: Always verify API parameter naming conventions in official documentation, not community examples.

### Case Study: Volume Disparity Issues

**Problem**: Generated AI music was much louder than chord progression playback
**Investigation**: Audio context volume levels were extremely low (0.008-0.015)
**Solution**: Increased base volume 15-20x and adjusted compression

```typescript
// Before (too quiet)
const baseVolume = preview ? 0.008 : 0.015;

// After (audible)
const baseVolume = preview ? 0.15 : 0.25;

// Also adjusted compressor settings
compressorRef.current.threshold.setValueAtTime(-12, audioContext.currentTime);
compressorRef.current.ratio.setValueAtTime(6, audioContext.currentTime);
```

## Common Issues & Solutions

### API Key Configuration in Docker

**Issue**: Environment variables not available during Docker build
**Solution**: Use build arguments

```dockerfile
# Dockerfile
ARG VITE_ELEVENLABS_API_KEY=your_fallback_key
ENV VITE_ELEVENLABS_API_KEY=${VITE_ELEVENLABS_API_KEY}

# Build command
docker build --build-arg VITE_ELEVENLABS_API_KEY=your_actual_key -t app .
```

### Browser Audio Compatibility

**Issue**: Streams don't work directly in browsers
**Solution**: Convert to ArrayBuffer

```typescript
const streamToArrayBuffer = async (stream: ReadableStream): Promise<ArrayBuffer> => {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result.buffer;
};
```

### Error Handling Best Practices

```typescript
try {
  const result = await generateMusic(prompt, duration);
  return result;
} catch (error) {
  // Specific error handling for known issues
  if (error.message?.includes('copyrighted')) {
    throw new Error('Content may contain copyrighted material. Try a different prompt.');
  }
  
  if (error.message?.includes('rate limit')) {
    throw new Error('Rate limit exceeded. Please wait before trying again.');
  }
  
  // Generic fallback
  console.error('AI generation error:', error);
  throw new Error('Failed to generate content. Please try again.');
}
```

## Performance Optimization

### Lazy Loading AI Features

```typescript
const AIMusicGenerator = React.lazy(() => import('./components/AIMusicGenerator'));

// Only load when chord progression exists
{currentProgression && (
  <Suspense fallback={<LoadingSpinner />}>
    <AIMusicGenerator progression={currentProgression} />
  </Suspense>
)}
```

### Caching Strategies

```typescript
// Cache generated content to avoid repeated API calls
const audioCache = new Map<string, ArrayBuffer>();

const getCachedAudio = async (cacheKey: string, generator: () => Promise<ArrayBuffer>) => {
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }
  
  const audio = await generator();
  audioCache.set(cacheKey, audio);
  return audio;
};
```

## Integration Architecture

### White-Label Implementation

Key principle: AI features should feel native to your application, not like third-party integrations.

```typescript
// Brand integration
const AI_BRANDING = {
  primaryColor: '#f59e0b', // Amber to match Chord Genesis
  secondaryColor: '#92400e',
  componentName: 'Chord Genesis AI Music Generator', // Not "ElevenLabs"
  description: 'Generate contextual music from your chord progressions'
};
```

### Progressive Enhancement

```typescript
// Feature detection and graceful degradation
const AIFeatures = () => {
  const [isAIAvailable, setIsAIAvailable] = useState(false);
  
  useEffect(() => {
    // Test AI availability
    const testAI = async () => {
      try {
        await fetch('/api/health/ai');
        setIsAIAvailable(true);
      } catch {
        setIsAIAvailable(false);
      }
    };
    
    testAI();
  }, []);

  if (!isAIAvailable) {
    return <StandardMusicPlayer />;
  }

  return <AIEnhancedMusicPlayer />;
};
```

## Resources

- [ElevenLabs API Documentation](https://elevenlabs.io/docs)
- [Session Recap: ElevenLabs Integration](https://github.com/yetog/portfolio/blob/main/session-recap-2025-10-11/)
- [Conversational AI Examples](https://github.com/elevenlabs/elevenlabs-examples)

## Next Steps

1. **Voice Cloning**: Implement custom voice training for personalized narration
2. **Real-time Generation**: Live music creation as users modify chord progressions
3. **Advanced Prompting**: Implement genre-specific prompting strategies
4. **Analytics Integration**: Track usage patterns and optimization opportunities

---

*Last Updated: October 11, 2025*  
*Based on production implementations in the zaylegend.com portfolio*