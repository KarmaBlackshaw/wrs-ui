export function formatMoney(centavos: number) {
  return `₱${(centavos / 100).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function padToCentavos(pad: string) {
  return Number(pad || "0");
}
