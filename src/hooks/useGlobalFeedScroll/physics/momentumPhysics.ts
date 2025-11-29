
export interface MomentumConfig {
  friction: number;
  elasticity: number;
  bounceResistance: number;
  velocityThreshold: number;
  maxVelocity: number;
}

export class MomentumPhysics {
  private velocity = 0;
  private animationFrame: number | null = null;
  private config: MomentumConfig;

  constructor(config: MomentumConfig) {
    this.config = config;
  }

  setVelocity(velocity: number) {
    this.velocity = Math.max(-this.config.maxVelocity, Math.min(this.config.maxVelocity, velocity));
  }

  addVelocity(deltaVelocity: number) {
    this.velocity += deltaVelocity;
    this.velocity = Math.max(-this.config.maxVelocity, Math.min(this.config.maxVelocity, this.velocity));
  }

  getVelocity() {
    return this.velocity;
  }

  calculatePosition(currentPosition: number, maxPosition: number): number {
    let newPosition = currentPosition + this.velocity;

    // Elastic boundaries with progressive resistance
    if (newPosition < 0) {
      const overflow = Math.abs(newPosition);
      const resistance = Math.min(overflow / 100, 1); // Progressive resistance
      newPosition = newPosition * (this.config.bounceResistance * (1 - resistance));
      this.velocity *= this.config.elasticity * (1 - resistance * 0.5);
    } else if (newPosition > maxPosition) {
      const overflow = newPosition - maxPosition;
      const resistance = Math.min(overflow / 100, 1);
      newPosition = maxPosition + (overflow * this.config.bounceResistance * (1 - resistance));
      this.velocity *= this.config.elasticity * (1 - resistance * 0.5);
    }

    // Apply friction
    this.velocity *= this.config.friction;

    return Math.max(0, Math.min(maxPosition, newPosition));
  }

  isActive(): boolean {
    return Math.abs(this.velocity) > this.config.velocityThreshold;
  }

  stop() {
    this.velocity = 0;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }
}
