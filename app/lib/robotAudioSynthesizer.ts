// Pure Web Audio API Synthesizer for Robotics Physics & Contact Acoustics.
// Generates zero-asset procedural sound effects for footsteps, servo motors,
// contact collisions, and haptic feedback on mobile.

class RobotAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private servoOsc: OscillatorNode | null = null;
  private servoGain: GainNode | null = null;
  private isMuted: boolean = true;

  private initContext() {
    if (this.ctx) return;
    if (typeof window === "undefined") return;
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    } else {
      this.stopServo();
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Synthesizes a hardwood floor footstep impact sound.
   */
  public playFootstep(intensity: number = 1.0, isLeft: boolean = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Filtered noise burst for wood thud
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.015));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(isLeft ? 180 : 210, t);
    filter.Q.setValueAtTime(3.0, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * Math.min(1.5, intensity), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(t);
    noise.stop(t + 0.08);

    // Trigger subtle mobile haptic tap if supported
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {
        // Ignore devices without haptics
      }
    }
  }

  /**
   * Synthesizes an obstacle collision tap / bump sound.
   */
  public playCollisionBump(penetration: number = 0.02) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.09);

    gain.gain.setValueAtTime(Math.min(0.5, 0.2 + penetration * 10), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Modulates continuous actuator servo hum based on robot velocity and joint effort.
   */
  public updateServoHum(activity: number = 0) {
    if (this.isMuted) {
      this.stopServo();
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    if (!this.servoOsc) {
      this.servoOsc = this.ctx.createOscillator();
      this.servoGain = this.ctx.createGain();

      this.servoOsc.type = "triangle";
      this.servoOsc.frequency.setValueAtTime(80, this.ctx.currentTime);
      this.servoGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

      this.servoOsc.connect(this.servoGain);
      this.servoGain.connect(this.ctx.destination);
      this.servoOsc.start();
    }

    const t = this.ctx.currentTime;
    const targetFreq = 90 + activity * 120;
    const targetGain = Math.min(0.08, activity * 0.08);

    if (this.servoOsc && this.servoGain) {
      this.servoOsc.frequency.setTargetAtTime(targetFreq, t, 0.05);
      this.servoGain.gain.setTargetAtTime(targetGain, t, 0.05);
    }
  }

  public stopServo() {
    if (this.servoOsc) {
      try {
        this.servoOsc.stop();
        this.servoOsc.disconnect();
      } catch {
        // Ignore
      }
      this.servoOsc = null;
      this.servoGain = null;
    }
  }
}

export const robotAudio = new RobotAudioSynthesizer();
