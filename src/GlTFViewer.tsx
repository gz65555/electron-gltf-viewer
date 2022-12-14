/* eslint-disable no-console */
/* eslint no-multi-assign: "off" */
/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-underscore-dangle: 0 */
import {
  AmbientLight,
  AssetType,
  BoundingBox,
  Camera,
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
  Texture2D,
  Vector3,
  WebGLEngine,
} from "oasis-engine";
import { useEffect } from "react";
import "./gltf-viewer.less";
import { SimpleDropzone } from "simple-dropzone";
import { EventEmitter } from "eventemitter3";
import { useRootStore } from "./store/RootStore";
import { ipcRenderer } from "electron";
import { IGlTF } from "./types/IGlTF";
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

    this.loadEnv("pisa").then(() => {
      this.initScene();
      this.initDropZone();
      this.initDefaultDebugMesh();
      this.emit("ready");
    });

    this.controller.addDefaultControl();
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

  private loadEnv(envName: keyof typeof envList) {
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

  private initScene() {
    this.engine.canvas.resizeByClientSize();
    this.controller.minDistance = 0;

    this.lightEntity1.transform.setRotation(-45, 0, 0);
    this.lightEntity2.transform.setRotation(-45, 180, 0);
    this.engine.run();

    window.onresize = () => {
      this.engine.canvas.resizeByClientSize();
    };
  }

  private initDefaultDebugMesh() {
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

  private setCenter(renderers: Renderer[]) {
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

  private initDropZone() {
    const dropCtrl = new SimpleDropzone(document.body, this.$input);
    dropCtrl.on("drop", ({ files }) => this.loadFileMaps(files));
  }

  private loadFileMaps(files: Map<string, File>) {
    const modelReg = /\.(gltf|glb)$/i;

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
      }
    });

    if (mainFile) {
      mainFile.arrayBuffer().then((buffer) => {
        const url = URL.createObjectURL(mainFile);
        this.loadModel(url, filesMap, type as any, new Uint8Array(buffer));
      });
    }
  }

  /** ???????????? */
  private handleGlTFResource(asset: GLTFResource, buffer: Uint8Array) {
    const { defaultSceneRoot, materials, animations } = asset;
    this.dropSuccess();
    this.gltfRootEntity = defaultSceneRoot;
    this.rootEntity.addChild(defaultSceneRoot);

    this.emit("loaded", asset, buffer);

    const meshRenderers = [];
    defaultSceneRoot.getComponentsIncludeChildren(MeshRenderer, meshRenderers);

    this.setCenter(meshRenderers);
  }

  private dropStart() {
    this.$dropZone!.classList.add("hide");
    this.$spinner!.classList.remove("hide");
  }

  private dropError() {
    this.$dropZone!.classList.remove("hide");
    this.$spinner!.classList.add("hide");
  }

  private dropSuccess() {
    this.$dropZone!.classList.add("hide");
    this.$spinner!.classList.add("hide");
  }

  private destroyGLTF() {
    this.gltfRootEntity.destroy();
  }
}

let oasis: Oasis = null;

export function GlTFView() {
  const rootStore = useRootStore();
  useEffect(() => {
    if (!oasis) {
      oasis = new Oasis();

      function openFile(arg: Uint8Array) {
        const blob = URL.createObjectURL(new Blob([arg.buffer]));
        oasis.loadModel(blob, {}, "glb", arg);
      }

      /** ??????????????? glTF ?????? */
      ipcRenderer.on("file-opened", (event, arg: Uint8Array) => {
        openFile(arg);
      });

      /** ???????????? glTF/glb ?????? */
      ipcRenderer.on("file-opened-once", (event, arg: Uint8Array) => {
        if (arg) {
          openFile(arg);
        } else {
          postMessage({ payload: "removeLoading" }, "*");
        }
      });

      /** React ?????????????????????????????????????????? */
      ipcRenderer.send("init-file-fetch");

      /** glTF loaded */
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
