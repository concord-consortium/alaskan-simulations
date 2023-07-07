import $ from "jquery";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Constellations } from "../../common-3d/models/constellations";
import { Stars } from "../../common-3d/models/stars";
import { config } from "../../config";
import { localSiderealTimeToCelestialSphereRotation } from "../../utils/sim-utils";
import { toLocalSiderealTime } from "../../utils/time-conversion";
import { ambientLight, box, horizon } from "../models/simple-models";
import { ISimState } from "../types";
import CustomConstellations from "../../common-3d/models/custom-constellations";

const CELESTIAL_SPHERE_RADIUS = 1000;

const ENABLE_CAMERA_CONTROLS = true;
const ADD_SOUTH_MARKER = true;

export default class BaseView {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  props: ISimState;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  stars: Stars;
  constellations: Constellations;
  customConstellations: CustomConstellations;
  celestialSphereContainer: THREE.Object3D;

  constructor(parentEl: HTMLElement, props: ISimState) {
    const width = parentEl.clientWidth;
    const height = parentEl.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.0001, 10000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    // this.renderer.setClearColor(0x000000, 1);
    this.renderer.setSize(width, height);
    parentEl.appendChild(this.renderer.domElement);

    this.celestialSphereContainer = new THREE.Object3D();
    this.stars = new Stars(CELESTIAL_SPHERE_RADIUS);
    this.constellations = new Constellations(CELESTIAL_SPHERE_RADIUS);
    this.customConstellations = new CustomConstellations();

    this._initScene(props);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = ENABLE_CAMERA_CONTROLS;
    this.controls.enablePan = ENABLE_CAMERA_CONTROLS;
    this.controls.enableZoom = ENABLE_CAMERA_CONTROLS;
    this.controls.rotateSpeed = 0.5;

    this.props = {} as ISimState;
    this.setProps(props);

    this._setInitialCamPos();
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
  }

  render(timestamp: number) {
    this.controls.update();
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

  _initScene(props: ISimState) {
    this.celestialSphereContainer.add(this.stars.rootObject);
    this.celestialSphereContainer.add(this.customConstellations.rootObject);

    if (props.showConstellations) {
      this.celestialSphereContainer.add(this.constellations.rootObject);
    }
    this.scene.add(this.celestialSphereContainer);

    this.scene.add(ambientLight());

    if (ADD_SOUTH_MARKER) {
      const southMarker = box();
      southMarker.position.z = 10;
      this.scene.add(southMarker);
      this.scene.add(horizon());
    }
  }

  _setInitialCamPos() {
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;

    // Update field of view.
    this.camera.fov = config.horizonFov;
    this.camera.updateProjectionMatrix();

    this.controls.target.x = 0;
    // Keep Z value small, so target is very close to camera, and orbit controls behave pretty much like first person camera.
    this.controls.target.z = 0.1;
    // This value decides about the initial camera angle.
    this.controls.target.y = Math.tan(THREE.MathUtils.degToRad(config.horizonCameraAngle)) * this.controls.target.z;
  }

  setTimeAndLongitude(epochTime: number, longitude: number) {
    const date = new Date(epochTime);
    const lst = toLocalSiderealTime(date, longitude);
    const rotation = localSiderealTimeToCelestialSphereRotation(lst);
    this.celestialSphereContainer.rotation.y = -rotation;
  }

  _updateLat() {
    const rotation = THREE.MathUtils.degToRad(90 - this.props.lat);
    this.celestialSphereContainer.rotation.x = -rotation;
  }

  _updateEpochTime() {
    this.setTimeAndLongitude(this.props.epochTime, this.props.long);
  }

  _updateLong() {
    this.setTimeAndLongitude(this.props.epochTime, this.props.long);
  }

  _updateShowConstellations() {
    if (this.props.showConstellations) {
      this.celestialSphereContainer.add(this.constellations.rootObject);
    } else {
      this.celestialSphereContainer.remove(this.constellations.rootObject);
    }
  }
}
