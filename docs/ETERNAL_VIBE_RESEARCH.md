# Eternal Vibe - AI Music Generation Research

> Research documentation for audio analysis, AI music generation, and style replication
> Last Updated: 2026-02-14

---

## Table of Contents
1. [Current State: Chord Genesis](#current-state-chord-genesis)
2. [ElevenLabs Capabilities](#elevenlabs-capabilities)
3. [Audio Analysis Tools](#audio-analysis-tools)
4. [Suno & Open Source Alternatives](#suno--open-source-alternatives)
5. [Spotify Algorithm Insights](#spotify-algorithm-insights)
6. [Neurological & Psychological Music Patterns](#neurological--psychological-music-patterns)
7. [Capabilities Analysis](#capabilities-analysis)
8. [Implementation Roadmap](#implementation-roadmap)

---

## Current State: Chord Genesis

### Existing Features
Chord Genesis (`/var/www/zaylegend/apps/chord-genesis`) currently integrates:

| Feature | Implementation |
|---------|---------------|
| ElevenLabs Music API | `@elevenlabs/elevenlabs-js` SDK v2.18.0 |
| Text-to-Music | `generateMusic()` - prompt-based generation |
| Composition Plans | `createCompositionPlan()` - structured song sections |
| Text-to-Speech | `textToSpeech()` - voice synthesis |
| Audio Playback | Web Audio API with gain control |
| Download | MP3 export functionality |

### Current Music Generation Flow
```
User Input (Key/Scale/Genre)
    → Generate Prompt
    → ElevenLabs Music API
    → ArrayBuffer
    → Web Audio Playback
```

### Genre Support (23 styles)
- Ambient, Cinematic, Electronic, Acoustic, Classical, Jazz, Folk, Rock
- Hip Hop, Trap Soul, R&B, City Pop, Vaporwave, West Coast, G-Funk
- Rap, Late Night, UK R&B Jazz, Lo-Fi, Brazilian Jazz, House, Funk, Neo Soul

---

## ElevenLabs Capabilities

### Eleven Music API

| Parameter | Details |
|-----------|---------|
| Duration | 3 seconds - 5 minutes |
| Format | MP3 (44.1kHz, 128-192kbps) |
| Languages | English, Spanish, German, Japanese, more |
| Commercial | Cleared for film, TV, podcasts, ads, gaming |

**New Features (2025-2026):**
- **Inpainting API**: Fine-grained control over music editing - programmatic control over every part of a song
- **Stem Separation**: UI-based stem isolation (drums, bass, vocals, etc.)
- **Composition Plan**: Section-based generation with styles per section
- **Eleven v3 (Alpha)**: State-of-the-art speech synthesis with high emotional range

### Sound Effects API

| Parameter | Details |
|-----------|---------|
| Duration | 0.1 - 30 seconds |
| Looping | Seamless loops for ambient/background |
| Format | MP3 (pro quality), WAV (48kHz) |
| Use Cases | Cinematic, game audio, Foley, ambient |

**Supported Sound Types:**
- Simple effects: "Glass shattering on concrete"
- Complex sequences: "Footsteps on gravel, then a metallic door opens"
- Musical elements: "90s hip-hop drum loop, 90 BPM"

### Image & Video Generation (New)

ElevenLabs now integrates visual generation:
- **Video Models**: Veo, Sora, Wan, Kling, Seedance
- **Image Models**: Nanobanana, Flux Kontext, GPT Image, Seedream
- **Lip-sync**: Veed or OmniHuman integration
- **Quality**: Up to 4K with upscaling
- **Integration**: Overlay voiceovers, music, and SFX in same interface

---

## Audio Analysis Tools

### Librosa (Python)

Primary library for audio feature extraction and analysis.

#### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Spectral Analysis** | STFT, CQT, Mel spectrograms, MFCCs |
| **Rhythm/Tempo** | Beat tracking, tempo estimation |
| **Pitch Detection** | Fundamental frequency, chroma features |
| **Harmonic-Percussive** | Separation of harmonic/percussive components |
| **Timbre** | Spectral centroid, contrast, rolloff |

#### Feature Extraction Pipeline
```python
import librosa

# Load audio
y, sr = librosa.load('track.mp3')

# Extract features
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
chroma = librosa.feature.chroma_stft(y=y, sr=sr)
mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)

# Harmonic-percussive separation
harmonic, percussive = librosa.effects.hpss(y)
```

#### Key Features for Style Replication

| Feature | Use Case |
|---------|----------|
| Chromagram | Chord detection, key estimation |
| Mel Spectrogram | Overall tonal character |
| MFCCs | Timbre fingerprinting |
| Tempo/Beat | Rhythmic pattern analysis |
| Spectral Contrast | Genre/style classification |
| Zero-Crossing Rate | Percussiveness detection |

### Other Tools

| Tool | Use Case |
|------|----------|
| **Essentia** | Production-ready audio analysis (C++/Python) |
| **Aubio** | Real-time pitch/onset detection |
| **Madmom** | Beat/downbeat tracking |
| **Torchaudio** | PyTorch audio processing |

---

## Suno & Open Source Alternatives

### Suno Status (2026)
- **No Official Public API**: Still prioritizes web-based consumer platform
- **Beta Partner Access**: Limited API access for select partners
- **Suno V5**: ELO benchmark 1,293 - studio-grade fidelity, human-like vocals

### Third-Party API Solutions
- Middleware services manage account pools and session management
- Standard REST API wrappers available
- **Note**: Legal/ToS considerations for production use

### Open Source Alternatives

#### ACE-Step 1.5
- Local GPU-based music generation
- Described as "open source Suno killer"
- Full offline control

#### HeartMuLa
- Style prompt + lyrics → complete song with vocals
- Offline runs with privacy control
- January 2026 release

#### gcui-art/suno-api
- GitHub: https://github.com/gcui-art/suno-api
- LGPL-3.0 license
- Integration with AI agents (GPTs)

---

## Spotify Algorithm Insights

### Audio Features (12 Perceptual Features)

| Feature | Description |
|---------|-------------|
| Danceability | How suitable for dancing (0.0-1.0) |
| Energy | Intensity and activity measure |
| Valence | Musical positivity (happy vs sad) |
| Tempo | BPM estimation |
| Acousticness | Acoustic vs electronic |
| Instrumentalness | Vocal presence prediction |
| Speechiness | Spoken word detection |
| Liveness | Live audience presence |
| Loudness | Overall dB level |
| Key | Pitch class (0-11) |
| Mode | Major (1) or Minor (0) |
| Time Signature | Beats per bar |

### Semantic IDs (2025 Research)

Spotify's Text2Tracks system uses:
- Vector discretization for track characteristics
- "Zip codes" identifying portions of vector space
- Collaborative filtering embeddings from playlist patterns

### Technical Architecture

1. **Audio Fingerprinting**: CNN with spectrogram input
2. **Latent Vectors**: Deep learning predicts embeddings from raw audio
3. **Temporal Segmentation**: Sections, bars, beats, tatums
4. **Collaborative Filtering**: Playlist co-occurrence patterns

### Research Accuracy
- 2025 Springer publication: 90.5% accuracy in music recommendation
- Content-based filtering using audio characteristics

---

## Neurological & Psychological Music Patterns

### Music Emotion Recognition (MER)

#### AI Models for Emotion Detection

| Architecture | Purpose |
|--------------|---------|
| CNN | Local audio feature extraction |
| BiGRU | Temporal emotion patterns |
| Attention Mechanism | Focus on emotional peaks |

#### Acoustic Features → Emotion Mapping

| Feature | Emotional Correlation |
|---------|----------------------|
| Tempo | Arousal (fast = energetic) |
| Mode | Valence (major = happy) |
| Loudness | Intensity/power |
| Spectral Content | Brightness/darkness |
| Harmonic Complexity | Sophistication |

### Physiological Responses

| Measurement | Music Response |
|-------------|----------------|
| Pupil Dilation | Enjoyment indicator |
| Heart Rate | Emotional arousal |
| Blood Pressure | Intensity response |
| Skin Conductivity (GSR) | Robust emotion metric |
| EEG | Brain region activation |

### Therapeutic Applications

#### Brainwave Entrainment
- **Binaural Beats**: Frequency synchronization
- **Isochronic Tones**: Rhythmic brain stimulation
- **Alpha Waves**: Focus and flow state
- **Theta Waves**: Relaxation and creativity

#### Music Therapy Effects
- Limbic system engagement (emotion)
- Prefrontal cortex modulation (cognition)
- Reward circuit activation (dopamine)
- Motor system rehabilitation via rhythm

---

## Capabilities Analysis

### What We Can Build NOW

#### 1. Enhanced Chord Genesis
- **Sound Effects Layer**: Add SFX to generated music (risers, impacts, ambience)
- **Longer Compositions**: Up to 5-minute tracks
- **Section-Based Generation**: Intro → Verse → Chorus → Bridge → Outro
- **Looping Backgrounds**: Ambient textures and atmospheric beds

#### 2. Audio Analysis Pipeline (Python Backend)
```
Upload MP3/WAV
    → Librosa Analysis
    → Extract Features (tempo, key, chroma, MFCCs, spectral)
    → Generate Style Profile
    → Feed to ElevenLabs Prompt
```

#### 3. Style Replication System
- Analyze reference track
- Extract: tempo, key, energy, spectral characteristics
- Generate natural language description
- Use as ElevenLabs prompt

#### 4. Video Integration
- Generate music → Add to video generation
- Lip-sync for AI vocals
- Full audiovisual content creation

### What Requires Development

| Feature | Complexity | Dependencies |
|---------|------------|--------------|
| Audio upload/analysis | Medium | Python backend, librosa |
| Style profile generation | Medium | Feature extraction, prompt engineering |
| Reference track matching | High | ML model for similarity |
| Real-time visualization | Medium | Web Audio API, Canvas |
| Stem separation (custom) | High | Spleeter/Demucs integration |

---

## Implementation Roadmap

### Phase 1: Audio Analysis Backend
- [ ] Create Python Flask/FastAPI service
- [ ] Integrate librosa for feature extraction
- [ ] Build style profile generator
- [ ] API endpoint: `/analyze` → returns JSON features

### Phase 2: Enhanced Chord Genesis
- [ ] Add audio upload capability
- [ ] Display extracted features (tempo, key, energy)
- [ ] Generate style-matched prompts
- [ ] Add sound effects layer to compositions

### Phase 3: Eternal Vibe Core
- [ ] Reference track analysis
- [ ] Style fingerprinting
- [ ] Prompt template system
- [ ] A/B comparison (original vs generated)

### Phase 4: Advanced Features
- [ ] Stem separation integration
- [ ] Custom model training (optional)
- [ ] Real-time waveform visualization
- [ ] Playlist analysis (batch style extraction)

---

## Resources

### Documentation
- [ElevenLabs Music Docs](https://elevenlabs.io/docs/overview/capabilities/music)
- [ElevenLabs Sound Effects](https://elevenlabs.io/docs/overview/capabilities/sound-effects)
- [Librosa Documentation](https://librosa.org/doc/0.11.0/tutorial.html)
- [Spotify Research](https://research.atspotify.com/search-recommendations)

### GitHub Repositories
- [gcui-art/suno-api](https://github.com/gcui-art/suno-api) - Suno integration
- [ACE-Step UI](https://github.com/fspecii/ace-step-ui) - Open source music gen
- [BlexBOTTT/Audio-Feat-Extraction](https://github.com/BlexBOTTT/Audio-Feat-Extraction) - Librosa examples

### Research Papers
- [Music Recommendation on Spotify using Deep Learning](https://arxiv.org/abs/2312.10079)
- [Text2Tracks: Generative Retrieval](https://research.atspotify.com/2025/04/text2tracks-improving-prompt-based-music-recommendations-with-generative-retrieval)
- [Music-Evoked EEG Emotion Recognition](https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2024.1400444/full)

---

## Market Context

- AI in Music market: $4.48B (2025), 23.7% CAGR
- Suno V5 benchmark: 1,293 ELO
- ElevenLabs: Industry-leading audio quality
- Growing demand for AI-assisted music production

---

*This document serves as the foundation for the Eternal Vibe concept - combining audio analysis with AI generation to replicate and create specific musical styles.*
