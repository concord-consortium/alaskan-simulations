import * as THREE from "three";
import { calculateEquatorialPosition } from "../../utils/sim-utils";
import { config } from "../../config";
import circleImg from "../assets/circle.png";
import allStars from "../data/CEASAR-HYG-for-import-9k.csv";
import constellations from "../data/constellations.csv";

const STAR_SIZES = [1, 2, 3, 4, 5, 6, 7];
const SIZE_POW = 3;
const SIZE_MULT = config.starSizeMult;
const MIN_CONSTELLATION_STAR_SIZE = config.minConstellationStarSize;
const MAX_CONSTELLATION_STAR_SIZE = config.maxConstellationStarSize;
const CONSTELLATION_STAR_SIZE_RANGE = MAX_CONSTELLATION_STAR_SIZE - MIN_CONSTELLATION_STAR_SIZE;

interface Star {
  Hip: number;
  "Const-abbreviations": string;
  "Const-names": string;
  "ProperName": string;
  "B-F-ID": string;
  "F-ID": string;
  "B-ID": string;
  RA: number;
  RadianRA: number;
  Dec: number;
  RadianDec: number;
  Distance: number;
  Mag: number;
  AbsMag: number;
  Spectrum: string;
  ColorIndex: number;
}

interface MinMax {
  min: number;
  max: number;
}

const getStarsMinAndMaxMagnitude = (stars: Star[]): MinMax => {
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    if (star.Mag > max) {
      max = star.Mag;
    }
    if (star.Mag < min) {
      min = star.Mag;
    }
  }
  return { min, max };
};

const getRelativeStarMagnitude = (star: Star, {min, max}: MinMax) => {
  return (star.Mag - min) / (max - min);
};

export class Stars {
  container = new THREE.Object3D();

  constructor(radius: number) {
    const starInConstellation: Record<number, boolean | undefined> = {};
    constellations.forEach((constellation: any) => {
      constellation.__parsed_extra.forEach((starId: number) => starInConstellation[starId] = true);
    });

    const stars = (allStars as Star[]).filter(star => starInConstellation[star.Hip] || star.AbsMag >= config.minAbsStarMagnitude);
    const starMag = getStarsMinAndMaxMagnitude(stars);

    const constellationStars: Star[] = [];
    stars.forEach(star => {
      if (starInConstellation[star.Hip]) {
        constellationStars.push(star);
      }
    });
    const constellationMag = getStarsMinAndMaxMagnitude(constellationStars);

    const starsBySize: any[] = STAR_SIZES.map(_ => []);

    const addStars = (starsGroup: any[], size: number) => {
      const vertexCount = starsGroup.length;

      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array(vertexCount * 3);
      const colors = new Float32Array(vertexCount * 3);

      for (let i = 0; i < vertexCount; i++) {
        const star = starsGroup[i];
        const vertex = calculateEquatorialPosition(star.RadianRA, star.RadianDec, radius);
        vertices[i * 3] = vertex.x;
        vertices[i * 3 + 1] = vertex.y;
        vertices[i * 3 + 2] = vertex.z;
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const textureLoader = new THREE.TextureLoader();
      const circleTexture = textureLoader.load(circleImg);
      const material = new THREE.PointsMaterial({
        size: Math.pow(size, SIZE_POW) * SIZE_MULT,
        map: circleTexture,
        sizeAttenuation: false,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
        vertexColors: true
      });

      const points = new THREE.Points(geometry, material);
      this.container.add(points);
    };

    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      let relativeMagnitude: number;
      if (starInConstellation[star.Hip]) {
        relativeMagnitude = getRelativeStarMagnitude(star, constellationMag);
        const size = MIN_CONSTELLATION_STAR_SIZE + (CONSTELLATION_STAR_SIZE_RANGE * relativeMagnitude);
        addStars([star], size);
      } else {
        relativeMagnitude = getRelativeStarMagnitude(star, starMag);
        const sizeIdx = Math.round(relativeMagnitude * (STAR_SIZES.length - 1));
        starsBySize[sizeIdx].push(star);
      }
    }

    starsBySize.forEach((starsGroup, sizeIdx) => addStars(starsGroup, STAR_SIZES[sizeIdx]));
  }

  get rootObject() {
    return this.container;
  }
}
