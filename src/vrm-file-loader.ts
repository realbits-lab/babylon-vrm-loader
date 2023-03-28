//*-----------------------------------------------------------------------------
//* TODO: Patched.
// import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
//*-----------------------------------------------------------------------------

import { GLTFFileLoader } from '@babylonjs/loaders/glTF/glTFFileLoader';

//*-----------------------------------------------------------------------------
//* TODO: Patched.
import type { Nullable } from '@babylonjs/core/types';
import type { VRMManager } from './vrm-manager';
import type { Scene } from '@babylonjs/core/scene';
import type { ISceneLoaderProgressEvent } from '@babylonjs/core/Loading/sceneLoader';
//*-----------------------------------------------------------------------------

/**
 * VRM/VCI ファイルを読み込めるようにする
 * 拡張子を変更しただけ
 */
export class VRMFileLoader extends GLTFFileLoader {
    public name = 'vrm';
    public extensions = {
        '.vrm': { isBinary: true },
        '.vci': { isBinary: true },
    };
    //*-------------------------------------------------------------------------
    //* TODO: Patched.
    public uri: string;
    public vrmManager: Nullable<VRMManager> = null;
    //*-------------------------------------------------------------------------

    public createPlugin() {
        return new VRMFileLoader();
    }

    //*-------------------------------------------------------------------------
    //* TODO: Patched.
    public loadAsync(scene: Scene, data: any, rootUrl: string, onProgress?: (event: ISceneLoaderProgressEvent) => void, fileName?: string): Promise<void> {
        this.uri = rootUrl;
        if (fileName) this.uri += fileName;
        return super.loadAsync(scene, data, rootUrl, onProgress, fileName);
    }
    //*-------------------------------------------------------------------------
}

//*-----------------------------------------------------------------------------
//* TODO: Patched.
// if (SceneLoader) {
//     SceneLoader.RegisterPlugin(new VRMFileLoader());
// }
//*-----------------------------------------------------------------------------
