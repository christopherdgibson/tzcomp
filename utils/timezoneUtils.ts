export function toPascalCase(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function zoneClean(zone: string): string {
    return zone.replace("/", " | ").replaceAll("_", " ")
}

export function padTimeDigits(input: number | null | undefined): string {
    if (input == null) {
        return "0";
    }
    return input.toString().padStart(2, "0");
}

export function getMonthShort (input: number | null | undefined): string {
    if (input == null) {
        return "";
    }
    return new Date(2000, input).toLocaleString("default", { month: "short" });
}

export function getHours12h(input: number | null | undefined): string {
    if (input == null) {
        return "";
    }

    if (input <= 12) {
        return input.toString() + "am";
    } else {
        return (input-12).toString() + "pm";
    }
}