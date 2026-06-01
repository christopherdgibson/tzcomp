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

export function getHours12h(input: number): number {
    if (input ===0) {
        return 12;
    }
    if (input <=12) {
        return input;
    } else {
        return (input-12);
    }
}

export function getHours24h(input: number, isPm: boolean): number {
    if (input === 12) {
        return isPm ? 12 : 0;
    } 
     if (isPm) {
        return (input+12);
    } else {
        return input;
    }
}

export function getHoursAmPm(input: number | null | undefined): string {
    if (input == null) {
        return "";
    }

    if (input <= 12) {
        return "am";
    } else {
        return "pm";
    }
}