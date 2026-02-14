import {
	PUBLIC_ASSETS,
	type PublicAssetFolder,
	type PublicAssetPath,
} from "../generated/public-assets";
import { getRandomArrayElement } from "./array";

export function getRandomPublicAsset(key: PublicAssetFolder) {
	const basePath = import.meta.env.SERVER_BASE_URL ?? import.meta.env.BASE_URL;

	return `${basePath ? basePath : ""}${getRandomArrayElement(PUBLIC_ASSETS[key])}` as PublicAssetPath;
}
