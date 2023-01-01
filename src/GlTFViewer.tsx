/* eslint-disable no-console */
/* eslint no-multi-assign: "off" */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-underscore-dangle: 0 */
import {
  DecodeMode,
  downloadArrayBuffer,
  IBLBaker,
  SphericalHarmonics3Baker,
  toBuffer,
} from "@oasis-engine/baker";
import {
  AmbientLight,
  AssetType,
  BoundingBox,
  Camera,
  Color,
  DirectLight,
  Entity,
  GLTFResource,
  Material,
  MeshRenderer,
  PBRMaterial,
  PrimitiveMesh,
  Renderer,
  Scene,
  SkyBoxMaterial,
  SphericalHarmonics3,
  Texture2D,
  TextureCube,
  Vector3,
  WebGLEngine,
} from "oasis-engine";
import { useEffect, useRef, useState } from "react";
// import WrapperLayout from "../components/layout";
import "./gltf-viewer.less";
// @ts-ignore
import { SimpleDropzone } from "simple-dropzone";
import { EventEmitter } from "eventemitter3";
import { useRootStore } from "./store/RootStore";
import { ipcRenderer } from "electron";
import { IGlTF } from "./types/IGlTF";
import { MaterialInspector } from "./components/leva/Material";
import { OrbitControl } from "./controls";

const envList = {
  sunset:
    "https://gw.alipayobjects.com/os/bmw-prod/89c54544-1184-45a1-b0f5-c0b17e5c3e68.bin",
  pisa: "https://gw.alipayobjects.com/os/bmw-prod/6470ea5e-094b-4a77-a05f-4945bf81e318.bin",
  park: "https://gw.alipayobjects.com/os/bmw-prod/37f204c2-bc5b-4344-a368-8251bbeb0717.bin",
  foot_2K:
    "https://gw.alipayobjects.com/os/bmw-prod/23c1893a-fe29-4e91-bd6a-bb1c4201a876.bin",
};

class Oasis extends EventEmitter {
  textures: Record<string, Texture2D> = {};
  env: Record<string, AmbientLight> = {};

  engine: WebGLEngine = new WebGLEngine("canvas-gltf-viewer", { alpha: true });
  scene: Scene = this.engine.sceneManager.activeScene;
  skyMaterial: SkyBoxMaterial = new SkyBoxMaterial(this.engine);

  // Entity
  rootEntity: Entity = this.scene.createRootEntity("root");
  cameraEntity: Entity = this.rootEntity.createChild("scene-camera");
  gltfRootEntity: Entity = this.rootEntity.createChild("gltf");
  lightEntity1: Entity = this.rootEntity.createChild("light1");
  lightEntity2: Entity = this.rootEntity.createChild("light2");

  // Component
  camera: Camera = this.cameraEntity.addComponent(Camera);
  controller: OrbitControl = this.cameraEntity.addComponent(OrbitControl);
  light1: DirectLight = this.lightEntity1.addComponent(DirectLight);
  light2: DirectLight = this.lightEntity2.addComponent(DirectLight);

  state = {
    // Scene
    background: true,
    // Lights
    env: "park" as any,
    lights: true,
    lightIntensity1: 1,
    lightIntensity2: 1,
  };
  _materials: Material[] = [];

  // temporary
  _boundingBox: BoundingBox = new BoundingBox();
  _center: Vector3 = new Vector3();
  _extent: Vector3 = new Vector3();

  // DOM
  $spinner = document.getElementById("spinner");
  $dropZone = document.getElementById("dropZone");
  $input = document.getElementById("input");

  glTFData: any;

  constructor() {
    super();

    this.loadEnv(this.state.env).then(() => {
      this.initScene();
      this.initDropZone();
      this.initDefaultDebugMesh();
      this.emit("ready");
    });

    this.controller.addDefaultControl();
  }

  loadEnv(envName: keyof typeof envList) {
    return new Promise((resolve) => {
      this.engine.resourceManager
        .load<AmbientLight>({
          type: AssetType.Env,
          url: envList[envName],
        })
        .then((env) => {
          this.env[envName] = env;

          this.scene.ambientLight = env;
          // this.skyMaterial.textureCubeMap = env.specularTexture;
          // this.skyMaterial.textureDecodeRGBM = true;
          resolve(true);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  initScene() {
    this.engine.canvas.resizeByClientSize();
    this.controller.minDistance = 0;

    // debug sync
    if (this.state.background) {
      // this.scene.background.mode = BackgroundMode.Sky;
    }
    if (!this.state.lights) {
      this.light1.enabled = this.light2.enabled = false;
    }
    this.light1.intensity = this.state.lightIntensity1;
    this.light2.intensity = this.state.lightIntensity2;
    this.lightEntity1.transform.setRotation(-45, 0, 0);
    this.lightEntity2.transform.setRotation(-45, 180, 0);
    this.engine.run();

    window.onresize = () => {
      this.engine.canvas.resizeByClientSize();
    };
  }

  initDefaultDebugMesh() {
    const mesh = PrimitiveMesh.createSphere(this.engine, 5, 64);
    const material = new PBRMaterial(this.engine);
    material.metallic = 1;
    material.roughness = 0;
    material.name = "default";
    const renderer = this.gltfRootEntity.addComponent(MeshRenderer);

    renderer.mesh = mesh;
    renderer.setMaterial(material);

    this.setCenter([renderer]);
  }

  setCenter(renderers: Renderer[]) {
    const boundingBox = this._boundingBox;
    const center = this._center;
    const extent = this._extent;

    boundingBox.min.set(0, 0, 0);
    boundingBox.max.set(0, 0, 0);

    renderers.forEach((renderer) => {
      BoundingBox.merge(renderer.bounds, boundingBox, boundingBox);
    });
    boundingBox.getExtent(extent);
    const size = extent.length();

    boundingBox.getCenter(center);
    this.controller.target.set(center.x, center.y, center.z);
    this.cameraEntity.transform.setPosition(center.x, center.y, size * 3);

    this.camera.farClipPlane = size * 12;
    this.camera.nearClipPlane = size / 100;

    this.controller.maxDistance = size * 10;
  }

  initDropZone() {
    const dropCtrl = new SimpleDropzone(document.body, this.$input);
    dropCtrl.on("drop", ({ files }) => this.loadFileMaps(files));
  }

  loadFileMaps(files: Map<string, File>) {
    const modelReg = /\.(gltf|glb)$/i;
    const imgReg = /\.(jpg|jpeg|png)$/i;
    const envReg = /\.(hdr|hdri)$/i;

    let mainFile: File;
    let type = "gltf";

    const filesMap = {}; // [fileName]:LocalUrl
    const fileArray: any = Array.from(files); // ['/*/*.*',obj:File]

    fileArray.some((f) => {
      const file = f[1];
      if (modelReg.test(file.name)) {
        type = RegExp.$1;
        mainFile = file;
        return true;
      }

      return false;
    });

    fileArray.forEach((f) => {
      const file = f[1];
      if (!modelReg.test(file.name)) {
        const url = URL.createObjectURL(file);
        const fileName = file.name;
        filesMap[fileName] = url;
        if (imgReg.test(fileName)) {
          this.addTexture(fileName, url);
        } else if (envReg.test(fileName)) {
          this.addEnv(fileName, url);
        }
      }
    });

    if (mainFile) {
      mainFile.arrayBuffer().then((buffer) => {
        const url = URL.createObjectURL(mainFile);
        this.loadModel(url, filesMap, type as any, new Uint8Array(buffer));
      });
    }
  }

  loadModel(
    url: string,
    filesMap: Record<string, string>,
    type: "gltf" | "glb",
    buffer: Uint8Array
  ) {
    this.dropStart();
    this.destroyGLTF();

    // replace relative path
    if (type.toLowerCase() === "gltf") {
      this.engine.resourceManager
        .load({
          type: AssetType.JSON,
          url,
        })
        .then((gltf: IGlTF) => {
          // @ts-ignore
          gltf.buffers.concat(gltf.images).forEach((item) => {
            if (!item) return;
            let { uri } = item;
            if (uri) {
              let index = uri.lastIndexOf("/");
              if (index > -1) {
                uri = uri.substr(index + 1);
              }
              if (filesMap[uri]) {
                item.uri = filesMap[uri];
              }
            }
          });
          const blob = new Blob([JSON.stringify(gltf)]);
          const urlNew = URL.createObjectURL(blob);
          this.engine.resourceManager
            .load<GLTFResource>({
              type: AssetType.Prefab,
              url: `${urlNew}#.gltf`,
            })
            .then((asset) => {
              this.handleGlTFResource(asset, buffer);
            })
            .catch(() => {
              this.dropError();
            });
        });
    } else {
      this.engine.resourceManager
        .load<GLTFResource>({
          type: AssetType.Prefab,
          url: `${url}#.glb`,
        })
        .then((asset) => {
          this.handleGlTFResource(asset, buffer);
        })
        .catch(() => {
          this.dropError();
        });
    }
  }

  /** 加载完毕 */
  handleGlTFResource(asset: GLTFResource, buffer: Uint8Array) {
    const { defaultSceneRoot, materials, animations } = asset;
    this.dropSuccess();
    this.gltfRootEntity = defaultSceneRoot;
    this.rootEntity.addChild(defaultSceneRoot);

    this.emit("loaded", asset, buffer);

    const meshRenderers = [];
    defaultSceneRoot.getComponentsIncludeChildren(MeshRenderer, meshRenderers);

    this.setCenter(meshRenderers);
  }

  addTexture(name: string, url: string) {
    const repeat = Object.keys(this.textures).find(
      (textureName) => textureName === name
    );
    if (repeat) {
      console.warn(`${name} 已经存在，请更换图片名字重新上传`);
      return;
    }
    this.engine.resourceManager
      .load<Texture2D>({
        type: AssetType.Texture2D,
        url,
      })
      .then((texture) => {
        this.textures[name] = texture;
        console.log("图片上传成功！", name);
      });
  }

  async addEnv(name: keyof typeof envList, url: string) {
    const texture = await this.engine.resourceManager.load<TextureCube>({
      url,
      type: "HDR-RGBE", // from baker
    });

    const bakedHDRCubeMap = IBLBaker.fromTextureCubeMap(
      texture,
      DecodeMode.RGBE
    );

    const sh = new SphericalHarmonics3();
    SphericalHarmonics3Baker.fromTextureCubeMap(texture, DecodeMode.RGBE, sh);
    const arrayBuffer = toBuffer(bakedHDRCubeMap, sh);
    downloadArrayBuffer(arrayBuffer, name);

    // update debugger
    const blob = new Blob([arrayBuffer], { type: "text/plain" });
    const bakeUrl = URL.createObjectURL(blob);
    this.state.env = name;
    envList[name] = bakeUrl;
    this.loadEnv(name);
  }

  dropStart() {
    this.$dropZone!.classList.add("hide");
    this.$spinner!.classList.remove("hide");
  }

  dropError() {
    this.$dropZone!.classList.remove("hide");
    this.$spinner!.classList.add("hide");
  }

  dropSuccess() {
    this.$dropZone!.classList.add("hide");
    this.$spinner!.classList.add("hide");
  }

  destroyGLTF() {
    this.gltfRootEntity.destroy();
  }
}

let oasis: Oasis = null;
export function GlTFView() {
  const rootStore = useRootStore();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!oasis) {
      oasis = new Oasis();
      setReady(true);
      function openFile(arg: Uint8Array) {
        const blob = URL.createObjectURL(new Blob([arg.buffer]));
        oasis.loadModel(blob, {}, "glb", arg);
      }
      ipcRenderer.on("file-opened", (event, arg: Uint8Array) => {
        openFile(arg);
      });
      ipcRenderer.on("file-opened-once", (event, arg: Uint8Array) => {
        console.log("file-opened-once", arg);
        if (arg) {
          openFile(arg);
        } else {
          postMessage({ payload: "removeLoading" }, "*");
        }
      });
      ipcRenderer.send("init-file-fetch");
      oasis.on("loaded", (asset: GLTFResource, buffer) => {
        rootStore.initGlTF(asset, buffer);
        postMessage({ payload: "removeLoading" }, "*");
      });
    }
  }, []);
  return (
    <>
      <div className="page-gltf-view">
        <canvas
          id="canvas-gltf-viewer"
          style={{
            width: "100vw",
            height: "100vh",
            position: "fixed",
            outline: "none",
          }}
        />
        <div id="dropZone" className="dropZone">
          <img
            className="upload"
            src="https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*-sHKTYv5U94AAAAAAAAAAAAAARQnAQ"
          />
          <input id="input" type="file" className="input" multiple />
          <p>Drop your gltf, glb here!</p>
        </div>
        <div id="spinner" className="spinner hide" />
      </div>
    </>
  );
}
