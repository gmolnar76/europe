import type { ExpressionSpecification, FilterSpecification } from "maplibre-gl";

export function inAdminNames(names: string[]): FilterSpecification {
  return ["in", ["get", "ADMIN"], ["literal", names]] as FilterSpecification;
}

export function colorByMembership(
  eaNames: string[],
  ezNames: string[],
  colors = { ea: "#0A2A6A88", ez: "#FFCC0088", other: "#00000000" }
): ExpressionSpecification {
  return [
    "case",
    ["in", ["get", "ADMIN"], ["literal", eaNames]], colors.ea,
    ["in", ["get", "ADMIN"], ["literal", ezNames]], colors.ez,
    colors.other,
  ] as unknown as ExpressionSpecification;
}
