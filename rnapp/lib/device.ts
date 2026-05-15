import * as Application from "expo-application";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Device identity for binding a dealer account to one device.
 *
 * This is a device *identifier*, not attribute "fingerprinting": on Android the
 * OS Android ID (stable across app reinstalls), and elsewhere a random id kept
 * in the secure keystore (which survives reinstalls on iOS).
 */

const DEVICE_ID_KEY = "dealer_device_id";

/** A 32-character random hex string — the fallback device identifier. */
function randomDeviceId(): string {
  let id = "";
  for (let i = 0; i < 32; i += 1) {
    id += Math.floor(Math.random() * 16).toString(16);
  }
  return id;
}

/** Returns a stable identifier for this device + install. */
export async function getDeviceId(): Promise<string> {
  if (Platform.OS === "android") {
    const androidId = Application.getAndroidId();
    if (androidId) {
      return androidId;
    }
  }

  const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (stored) {
    return stored;
  }
  const fresh = randomDeviceId();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, fresh);
  return fresh;
}

/** A human-readable device label, shown to the distributor when approving. */
export function getDeviceLabel(): string {
  const model = Device.modelName ?? Device.deviceName ?? "Unknown device";
  const os = Platform.OS === "ios" ? "iOS" : "Android";
  return `${model} · ${os}`;
}
