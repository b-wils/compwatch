export const getImageForMap = (map) => {
	if (!map) {
		return null;
	}
  return process.env.PUBLIC_URL + "/images/maps/" + map.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, "_") + "_link.png";
}