import { defineQuery, enterQuery } from "bitecs";
import { HubsWorld } from "../app";
import { NetworkDebug, Networked } from "../bit-components";
import { NetworkDebugPrefab } from "../prefabs/network-debug";
import { renderAsEntity } from "../utils/jsx-entity";
import { Text as TroikaText } from "troika-three-text";
import { formatComponentProps } from "../react-components/debug-panel/ECSSidebar";
import { Material, Scene } from "three";
import { forEachMaterial } from "../utils/material-utils";

const networkedObjectsQuery = defineQuery([Networked]);
const networkDebugQuery = defineQuery([NetworkDebug]);
const enteredNetworkedObjectsQuery = enterQuery(networkedObjectsQuery);
export function networkDebugSystem(world: HubsWorld, scene: Scene) {
  enteredNetworkedObjectsQuery(world).forEach(eid => {
    const obj = world.eid2obj.get(eid);
    if (obj) {
      const debugHelper = renderAsEntity(world, NetworkDebugPrefab());
      const textObj = world.eid2obj.get(debugHelper)! as TroikaText;
      obj.add(world.eid2obj.get(debugHelper)!);
      textObj.text = formatComponentProps(eid, Networked);
      textObj.renderOrder = 999;
      forEachMaterial(textObj, function (mat: Material) {
        mat.depthTest = false;
      });
    }
  });
  networkDebugQuery(world).forEach(eid => {
    const textObj = world.eid2obj.get(eid)! as TroikaText;
    textObj.text = formatComponentProps(textObj.parent!.eid, Networked);
    textObj.sync();
  });
}
