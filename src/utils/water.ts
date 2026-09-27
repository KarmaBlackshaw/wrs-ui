// ponytail: settings["water.tdsAcceptableRangePpm"] is null until go-live; swap for the setting once it carries a real value.
export const TDS_MAX_PPM = 40;

export function isTdsOutOfRange(tds: number) {
  return tds > TDS_MAX_PPM;
}
