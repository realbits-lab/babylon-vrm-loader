import type { Material } from '@babylonjs/core/Materials/material';
import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Nullable } from '@babylonjs/core/types';
import type { IGLTFLoaderExtension, IMaterial, IMeshPrimitive } from '@babylonjs/loaders/glTF/2.0';
import { GLTFLoader } from '@babylonjs/loaders/glTF/2.0';
import { VRMManager } from './vrm-manager';
import { VRMMaterialGenerator } from './vrm-material-generator';

//*-----------------------------------------------------------------------------
//* TODO: Patched.
import type { VRMFileLoader } from './vrm-file-loader';
import type { GLTFLoaderExtensionObserver } from '../../loader-observer';
import type { V3DCore } from '../../../index';
//*-----------------------------------------------------------------------------

/**
 * `extensions` に入る拡張キー
 */
const NAME = 'VRM';

/**
 * VRM 拡張を処理する
 * [Specification](https://github.com/vrm-c/vrm-specification/tree/master/specification/0.0)
 */
export class VRMLoaderExtension implements IGLTFLoaderExtension {
    //*-------------------------------------------------------------------------
    //* TODO: Patched.
    public static readonly NAME = 'VRM';
    //*-------------------------------------------------------------------------

    /**
     * @inheritdoc
     */
    public readonly name = NAME;
    /**
     * @inheritdoc
     */
    public enabled = true;
    /**
     * この Mesh index 以降が読み込み対象
     */
    private meshesFrom = 0;
    /**
     * この TransformNode index 以降が読み込み対象
     */
    private transformNodesFrom = 0;
    /**
     * この Material index 以降が読み込み対象
     */
    private materialsFrom = 0;

    //*-------------------------------------------------------------------------
    //* TODO: Patched.
    /**
     * Loader observers
     */
    private loaderObservers: GLTFLoaderExtensionObserver[] = [];
    private onLoadedCallBack: Function;
    /**
     * VRM Manager from this load.
     */
    private manager: VRMManager;
    //*-------------------------------------------------------------------------

    /**
     * @inheritdoc
     */
    public constructor(
        private loader: GLTFLoader,
        //* TODO: Patched.
        private v3DCore: V3DCore
    ) {
        // console.log('call constructor()');

        // GLTFLoader has already added rootMesh as __root__ before load extension
        // @see glTFLoader._loadData
        this.meshesFrom = this.loader.babylonScene.meshes.length - 1;
        this.transformNodesFrom = this.loader.babylonScene.transformNodes.length;
        this.materialsFrom = this.loader.babylonScene.materials.length;

        //*---------------------------------------------------------------------
        //* TODO: Patched.
        this.addLoaderObserver(this.v3DCore);
        this.onLoadedCallBack = () => {
            // console.log('call this.onLoadedCallBack()');
            // console.log('this.manager: ', this.manager);

            v3DCore.addVRMManager(this.manager);
        };
        v3DCore.addOnLoadCompleteCallbacks(this.onLoadedCallBack);
        //*---------------------------------------------------------------------
    }

    /**
     * @inheritdoc
     */
    public dispose(): void {
        (this.loader as any) = null;

        //*---------------------------------------------------------------------
        //* TODO: Patched.
        this.loaderObservers = [];
        this.v3DCore.removeOnLoadCompleteCallback(this.onLoadedCallBack);
        //*---------------------------------------------------------------------
    }

    /**
     * @inheritdoc
     */
    public onReady() {
        // console.log('call onReady()');
        // console.log('this.loader: ', this.loader);

        if (!this.loader.gltf.extensions || !this.loader.gltf.extensions[NAME]) {
            // console.log('call return');
            return;
        }

        //*---------------------------------------------------------------------
        //* TODO: Patched.
        // const scene = this.loader.babylonScene;
        // const manager = new VRMManager(
        //     this.loader.gltf.extensions[VRMLoaderExtension.NAME],
        //     this.loader.babylonScene,
        //     this.meshesFrom,
        //     this.transformNodesFrom,
        //     this.materialsFrom,
        // );
        // scene.metadata = scene.metadata || {};
        // scene.metadata.vrmManagers = scene.metadata.vrmManagers || [];
        // scene.metadata.vrmManagers.push(this.manager);

        const uri = (this.loader.parent as unknown as VRMFileLoader).uri;
        this.manager = new VRMManager(this.loader.gltf.extensions[NAME], this.loader.babylonScene, this.meshesFrom, this.transformNodesFrom, this.materialsFrom, uri);
        //*---------------------------------------------------------------------

        this.loader.babylonScene.onDisposeObservable.add(() => {
            // Scene dispose 時に Manager も破棄する
            //*-----------------------------------------------------------------
            //* TODO: Patched.
            // manager.dispose();
            this.manager.dispose();
            // this.loader.babylonScene.metadata.vrmManagers = [];
            //*-----------------------------------------------------------------
        });

        //*---------------------------------------------------------------------
        //* TODO: Patched.
        // console.log('try to call observer.onLoadReady()');
        for (const observer of this.loaderObservers) {
            // console.log('observer: ', observer);
            observer.onLoadReady();
        }
        //*---------------------------------------------------------------------
    }

    /**
     * @inheritdoc
     */
    //* TODO: Patched.
    // public _loadVertexDataAsync(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh) {
    public _loadVertexDataAsync(context: string, primitive: IMeshPrimitive, babylonMesh: Mesh): any {
        if (!primitive.extras || !primitive.extras.targetNames) {
            return null;
        }
        // まだ MorphTarget が生成されていないので、メタ情報にモーフターゲット情報を入れておく
        babylonMesh.metadata = babylonMesh.metadata || {};
        babylonMesh.metadata.vrmTargetNames = primitive.extras.targetNames;
        return null;
    }

    /**
     * @inheritdoc
     */
    public _loadMaterialAsync(context: string, material: IMaterial, mesh: Mesh, babylonDrawMode: number, assign: (babylonMaterial: Material) => void): Nullable<Promise<Material>> {
        // ジェネレータでマテリアルを生成する
        return new VRMMaterialGenerator(this.loader).generate(context, material, mesh, babylonDrawMode, assign);
    }

    //*-------------------------------------------------------------------------
    //* TODO: Patched.
    /**
     * Add observer
     */
    public addLoaderObserver(observer: GLTFLoaderExtensionObserver) {
        this.loaderObservers.push(observer);
    }
    //*-------------------------------------------------------------------------
}

//*-----------------------------------------------------------------------------
//* TODO: Patched.
// ローダーに登録する
// GLTFLoader.RegisterExtension(NAME, (loader) => new VRMLoaderExtension(loader));
//*-----------------------------------------------------------------------------
