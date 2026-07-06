export const MATERIALS_TEXTURES_2D = "Materials & Textures 2D";
export const MATERIALS_TEXTURES_3D = "Materials & Textures 3D";
export const DESIGN_LIBRARY_2D = "Design library 2D";
export const DESIGN_LIBRARY_3D = "Design library 3D";

const COMPONENT_TYPE_ALIASES = {
  "2D": MATERIALS_TEXTURES_2D,
  "3D": MATERIALS_TEXTURES_3D,
  [MATERIALS_TEXTURES_2D]: MATERIALS_TEXTURES_2D,
  [MATERIALS_TEXTURES_3D]: MATERIALS_TEXTURES_3D,
  [DESIGN_LIBRARY_2D]: DESIGN_LIBRARY_2D,
  [DESIGN_LIBRARY_3D]: DESIGN_LIBRARY_3D,
};

export const normalizeComponentType = (value) => COMPONENT_TYPE_ALIASES[value] || value || "";

export const is3DComponentType = (value) => {
  const normalizedValue = normalizeComponentType(value);
  return normalizedValue === MATERIALS_TEXTURES_3D || normalizedValue === DESIGN_LIBRARY_3D;
};

export const is2DComponentType = (value) => {
  const normalizedValue = normalizeComponentType(value);
  return normalizedValue === MATERIALS_TEXTURES_2D || normalizedValue === DESIGN_LIBRARY_2D;
};

export const formatComponentTypeLabel = (value) => normalizeComponentType(value);
