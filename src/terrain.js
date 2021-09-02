require("./perlin");

class Terrain {
  constructor({
    amplitude = 20,
    flying = 0.1,
    animated = false,
    baseColor = "black",
  } = {}) {
    this.flyingStep = flying;
    this.flying = 0;
    this.amplitude = amplitude;
    this.animated = animated;
    this.baseColor = baseColor;

    // Setup a geometry
    this.geometry = new THREE.PlaneGeometry(400, 400, 50, 50);
    this.setupColor();

    this.loader = new THREE.TextureLoader();
    this.texture = this.loader.load("terrain.jpeg");
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.offset.set(0, 0);
    this.texture.repeat.set(2, 2);

    // Setup a material
    this.material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      wireframe: false,
      flatShading: true,
      side: THREE.DoubleSide
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    noise.seed(Math.random());
  }

  setupColor() {
    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < this.geometry.attributes.position.count; i += 3) {
      color.set(this.baseColor);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    this.geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );
  }

  setup() {
    this.randomizeTerrain();
    return this.mesh;
  }

  randomIntervalNumber(interval, quantity) {
    let array = [];
    for (let i = 0; i <= quantity; i++) {
      let number = (interval * (0.5 * i)) / quantity;
      array.push(number);
    }
    return array.reverse();
  }

  randomizeTerrain() {
    const v = this.mesh.geometry.attributes.position.array;

    for (var i = 2; i <= v.length; i += 3) {
      const newV = noise.perlin2(
        v[i - 2] / 30 + this.flying,
        v[i - 1] / 30 + this.flying
      );
      v[i] = newV * this.amplitude;
    }

    this.mesh.geometry.attributes.position.needsUpdate = true;
  }

  update() {
    if (this.animated) {
      this.flying += this.flyingStep;
      this.randomizeTerrain();
    }
  }
}

module.exports = Terrain;
