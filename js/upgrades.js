// ============================================
// SISTEMA DE MEJORAS — Tuning de KISOU
// ============================================

class UpgradeSystem {
  constructor() {
    this.upgrades = {
      motor: { level: 0, maxLevel: 3, name: 'Motor', icon: '⚙️', levels: ['Estándar', 'Turbo', 'Hyperdrive', 'Quantum'] },
      chasis: { level: 0, maxLevel: 3, name: 'Chasis', icon: '🛡️', levels: ['Standard', 'Blindado', 'Nanochasis', 'Adaptive'] },
      sensor: { level: 0, maxLevel: 3, name: 'Sensor', icon: '👁️', levels: ['Básico', 'Térmico', 'Cuántico', 'Omnisciente'] },
      arma: { level: 0, maxLevel: 3, name: 'Arma', icon: '⚔️', levels: ['Ninguna', 'Cuchilla', 'Láser', 'EMP'] },
      solar: { level: 0, maxLevel: 3, name: 'Panel Solar', icon: '☀️', levels: ['Ninguno', 'Mini', 'Extendido', 'Plegable'] },
      memoria: { level: 0, maxLevel: 3, name: 'Memoria', icon: '🧠', levels: ['0', '1', '2', '3 fragmentos'] }
    };
    this.totalUpgrades = 0;
    this.scrap = 0;
    this.memoryFragments = 0;
    this.onUpgrade = null;
    this.onCollectScrap = null;
    this.onCollectMemory = null;
  }

  // Recoger chatarra
  collectScrap(amount) {
    this.scrap += amount;
    if (this.onCollectScrap) this.onCollectScrap(amount);
  }

  // Recoger fragmento de memoria
  collectMemory() {
    this.memoryFragments++;
    if (this.onCollectMemory) this.onCollectMemory();
  }

  // Instalar mejora
  installUpgrade(type) {
    const upgrade = this.upgrades[type];
    if (!upgrade || upgrade.level >= upgrade.maxLevel) return false;

    const costs = {
      motor: [10, 25, 50],
      chasis: [10, 25, 50],
      sensor: [15, 30, 60],
      arma: [15, 35, 70],
      solar: [10, 20, 40],
      memoria: [20, 40, 80]
    };

    const cost = costs[type][upgrade.level];
    if (this.scrap >= cost) {
      this.scrap -= cost;
      upgrade.level++;
      this.totalUpgrades++;
      if (this.onUpgrade) this.onUpgrade(type, upgrade.level);
      return true;
    }
    return false;
  }

  // Calcular velocidad basada en motor
  getSpeedMultiplier() {
    return 1 + (this.upgrades.motor.level * 0.25);
  }

  // Calcular defensa basada en chasis
  getDefenseMultiplier() {
    return 1 + (this.upgrades.chasis.level * 0.5);
  }

  // Calcular recarga solar
  getSolarRechargeRate() {
    return this.upgrades.solar.level * 0.02; // % por frame en luz
  }

  // Obtener arma actual
  getWeapon() {
    return this.upgrades.arma.level;
  }

  // Obtener tipo de sensor
  getSensor() {
    return this.upgrades.sensor.level;
  }

  // Reset
  reset() {
    this.totalUpgrades = 0;
    this.scrap = 0;
    this.memoryFragments = 0;
    Object.values(this.upgrades).forEach(u => u.level = 0);
  }
}
