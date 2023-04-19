import $ from "jquery";
import * as THREE from "three";
import CameraControls from "camera-controls";
import models from "../models/common-models";
import Earth from "../models/earth";
import * as data from "../solar-system-data";
import { ISimState } from "../types";
import { Orbit } from "../models/orbit";
import { ObserverArrow } from "../models/observer-arrow";
import { Stars } from "../../common-3d/models/stars";
import { Constellations } from "../../common-3d/models/constellations";
import { config } from "../../config";

CameraControls.install( { THREE } );

export default class BaseView {
  camera: THREE.PerspectiveCamera;
  controls: CameraControls;
  props: ISimState;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;

  earth: Earth;
  orbit: Orbit;
  observerArrow: ObserverArrow;
  stars: Stars;
  constellations: Constellations;
  celestialSphereContainer: THREE.Object3D;
  outlinedSunSprite: THREE.Sprite;
  visibleSunSprite: THREE.Sprite;

  initialUpdate = true;

  clock: THREE.Clock;

  constructor(parentEl: HTMLElement, props: ISimState) {
    const width = parentEl.clientWidth;
    const height = parentEl.clientHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, data.EARTH_ORBITAL_RADIUS * 100);
    this.renderer = new THREE.WebGLRenderer({antialias:true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(width, height);
    parentEl.appendChild(this.renderer.domElement);

    this.earth = new Earth();
    this.orbit = new Orbit();
    this.observerArrow = new ObserverArrow();
    this.outlinedSunSprite = models.sunSprite(false);
    this.visibleSunSprite = models.sunSprite(true);

    this.celestialSphereContainer = new THREE.Object3D();
    this.celestialSphereContainer.rotation.y = -Math.PI;
    this.celestialSphereContainer.rotation.z = -data.EARTH_TILT;

    this.stars = new Stars(config.orbitCelestialSphereRadius);
    this.constellations = new Constellations(config.orbitCelestialSphereRadius);

    this.clock = new THREE.Clock();

    this._initScene(props);

    this.controls = new CameraControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;
    this.controls.minDistance = 1000;
    this.controls.maxDistance = config.orbitCelestialSphereRadius * 4;
    this.controls.fitToBox(this.orbit.rootObject, false, {
      paddingTop: data.EARTH_ORBITAL_RADIUS * 1.1,    // 1.1 to shink it to fit between
      paddingBottom: data.EARTH_ORBITAL_RADIUS * 1.1  // the controls in the simulation view
    });
    this.controls.rotateAzimuthTo(1.5 * Math.PI, false);

    // the 13 pixel view offset is to move the sun to between the upper label and lower controls
    this.camera.setViewOffset(width, height, 0, 13, width, height);

    this.props = {} as any;
    this.setProps(props);
  }

  setProps(newProps: Partial<ISimState>) {
    const oldProps = $.extend(this.props);
    this.props = $.extend(this.props, newProps);
    let key: keyof ISimState;
    // Iterate over all the properties and call update handles for ones that have been changed.
    for (key in this.props) {
      if (this.props[key] !== oldProps[key]) {
        // Transform property name to name of the function that handles its update. For example:
        // earthTilt -> _updateEarthTilt.
        const funcName = `_update${key[0].toUpperCase()}${key.substr(1)}`;
        if (typeof (this as any)[funcName] === "function") {
          (this as any)[funcName]();
        }
      }
    }
    this.initialUpdate = false;
  }

  render(timestamp: number) {
    this.controls.update(this.clock.getDelta());
    this.renderer.render(this.scene, this.camera);
  }

  // Resizes canvas to fill its parent.
  resize() {
    const $parent = $(this.renderer.domElement).parent();
    const newWidth = $parent.width();
    const newHeight = $parent.height();
    if (newWidth && newHeight) {
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(newWidth, newHeight);
    }
  }

  // Called automatically when 'day' property is updated.
  _updateDay() {
    (this.props.day != null) && this.earth.setPositionFromDay(this.props.day);
  }

  // Called automatically when 'earthTilt' property is updated.
  _updateEarthTilt() {
    this.earth.setTilted(this.props.earthTilt);
  }

  _updateEarthRotation() {
    (this.props.earthRotation != null) && (this.earth.rotation = this.props.earthRotation);
  }

  _updateLat() {
    this.observerArrow.setLatLong(this.props.lat, this.props.long);
  }

  _updateLong() {
    this.observerArrow.setLatLong(this.props.lat, this.props.long);
  }

  _updateObserverCameraAngle() {
    this.observerArrow.setCameraAngle(this.props.observerCameraAngle);
  }

  _updateCameraRotation() {
    this.controls.rotate(-Math.PI / 2, 0, !this.initialUpdate);
  }

  _updateShowConstellations() {
    if (this.props.showConstellations) {
      this.celestialSphereContainer.add(this.constellations.rootObject);
    } else {
      this.celestialSphereContainer.remove(this.constellations.rootObject);
    }
  }

  _updateShowDaylight() {
    this.scene.add(this.props.showDaylight ? this.visibleSunSprite : this.outlinedSunSprite);
    this.scene.remove(this.props.showDaylight ? this.outlinedSunSprite : this.visibleSunSprite);
  }

  _updateTiltCamera() {
    this.controls.rotatePolarTo(this.props.tiltCamera ? 0 : 1.25, !this.initialUpdate);
  }

  _initScene(props: ISimState) {
    this.scene.add(models.ambientLight());
    this.scene.add(models.sunLight());
    this.scene.add(models.sunOnlyLight());

    this.earth.earthObject.add(models.earthAxis());
    this.scene.add(this.earth.rootObject);

    this.scene.add(this.orbit.rootObject);
    this.scene.add(props.showDaylight ? this.visibleSunSprite : this.outlinedSunSprite);

    this.earth.earthObject.add(this.observerArrow.rootObject);

    this.celestialSphereContainer.add(this.stars.rootObject);
    if (props.showConstellations) {
      this.celestialSphereContainer.add(this.constellations.rootObject);
    }
    this.scene.add(this.celestialSphereContainer);
  }
}
