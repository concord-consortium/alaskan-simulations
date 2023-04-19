import * as THREE from "three";
import stars from "../data/CEASAR-HYG-for-import-9k.csv";
import constellations from "../data/constellations.csv";
import { calculateEquatorialPosition } from "../../utils/sim-utils";

export class Constellations {
  container: THREE.LineSegments;

  constructor(radius: number) {

    const material = new THREE.LineBasicMaterial({
      color: 0x74b9ff,
      linewidth: 1
    });

    const starById: Record<number, any> = {};
    stars.forEach((star: any) => {
      starById[star.Hip] = star;
    });

    const points: THREE.Vector3[] = [];
    constellations.forEach((constellation: any) => {
      const starIds: number[] = constellation.__parsed_extra;
      starIds.forEach(starId => {
        const star = starById[starId];
        const starPosition = calculateEquatorialPosition(star.RadianRA, star.RadianDec, radius);
        points.push(starPosition);
      });
    });

    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    this.container = new THREE.LineSegments(geometry, material);
  }

  get rootObject() {
    return this.container;
  }
}
