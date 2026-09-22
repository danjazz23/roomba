// ============================================
// SISTEMA DE BATERÍA — Core del juego
// ============================================

class BatterySystem {
  constructor(startEnergy = 15) {
    this.energy = startEnergy;
    this.maxEnergy = 100;
    this.minEnergy = 0;
    this.dischargeRate = 0.01; // % por frame en reposo (~0.6%/s a 60fps)
    this.turboMultiplier = 3;
    this.attackCost = 2;
    this.shieldCost = 0.5;
    this.shieldActive = false;
    this.lastLowBatteryTime = 0;
    this.onLowBattery = null;
    this.onDeath = null;
  }

  // Actualizar sistema de batería
  update(gameTime) {
    // Regeneración pasiva extremadamente lenta
    this.energy = Math.max(this.minEnergy, this.energy - this.dischargeRate);

    // Alerta de batería baja
    if (this.energy <= 15 && this.energy > 0) {
      const now = Date.now();
      if (now - this.lastLowBatteryTime > 3000) { // Cada 3 segundos
        this.lastLowBatteryTime = now;
        if (this.onLowBattery) this.onLowBattery();
      }
    }

    // Muerte por agotamiento
    if (this.energy <= 0) {
      this.energy = 0;
      if (this.onDeath) this.onDeath();
    }
  }

  // Gastar energía para una acción
  spend(amount) {
    if (this.energy >= amount) {
      this.energy -= amount;
      return true;
    }
    return false;
  }

  // Recargar energía
  recharge(amount) {
    this.energy = Math.min(this.maxEnergy, this.energy + amount);
  }

  // Recarga completa
  fullRecharge() {
    this.energy = this.maxEnergy;
  }

  // Estado para el HUD
  getStatus() {
    const pct = (this.energy / this.maxEnergy) * 100;
    let color = PALETTE.GREEN_LT; // Verde
    if (pct <= 20) color = PALETTE.RED; // Rojo
    else if (pct <= 50) color = PALETTE.YELLOW; // Amarillo

    return {
      energy: this.energy,
      percent: Math.round(pct),
      color: color,
      critical: this.energy <= 10,
      low: this.energy <= 25
    };
  }

  // Reset
  reset(startEnergy = 15) {
    this.energy = startEnergy;
    this.shieldActive = false;
    this.lastLowBatteryTime = 0;
  }
}
