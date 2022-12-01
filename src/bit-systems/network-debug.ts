import { defineComponent, defineQuery, enterQuery, exitQuery } from "bitecs";
import { HubsWorld } from "../app";
import { NetworkDebug, Networked } from "../bit-components";
import { NetworkDebugPrefab } from "../prefabs/network-debug";
import { renderAsEntity } from "../utils/jsx-entity";
import { Text as TroikaText } from "troika-three-text";
import { formatComponentProps, formatObjectName } from "../react-components/debug-panel/ECSSidebar";
import { Material, Scene, Vector3 } from "three";
import { forEachMaterial } from "../utils/material-utils";
import { EntityID } from "../utils/networking-types";

const targets = new Map<EntityID, EntityID>();
const networkedObjectsQuery = defineQuery([Networked]);
const enteredNetworkedObjectsQuery = enterQuery(networkedObjectsQuery);
const networkDebugQuery = defineQuery([NetworkDebug]);
const exitedNetworkDebugQuery = exitQuery(networkDebugQuery);

const _scale = new Vector3();

export function networkDebugSystem(world: HubsWorld, scene: Scene) {
  enteredNetworkedObjectsQuery(world).forEach(eid => {
    const obj = world.eid2obj.get(eid);
    if (obj) {
      const debugHelper = renderAsEntity(world, NetworkDebugPrefab());
      const textObj = world.eid2obj.get(debugHelper)! as TroikaText;

      targets.set(debugHelper, eid);
      scene.add(world.eid2obj.get(debugHelper)!);
      textObj.renderOrder = 999;
      forEachMaterial(textObj, function (mat: Material) {
        mat.depthTest = false;
      });
    }
  });
  exitedNetworkDebugQuery(world).forEach(eid => {
    targets.delete(eid);
  });
  networkDebugQuery(world).forEach(eid => {
    const target = targets.get(eid)!;

    const textObj = world.eid2obj.get(eid)! as TroikaText;
    const targetObj = world.eid2obj.get(target)!;

    targetObj.updateMatrices();
    targetObj.matrixWorld.decompose(textObj.position, textObj.quaternion, _scale);
    textObj.matrixNeedsUpdate = true;

    textObj.text = formatObjectName(targetObj) + "\nNetworked " + formatComponentProps(target, Networked);
    textObj.sync();
  });
}
