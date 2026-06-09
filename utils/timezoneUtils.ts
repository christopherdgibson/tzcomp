export function toPascalCase(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function zoneClean(input: string): string {
    return input.replace("/", " | ").replaceAll("_", " ")
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
    return new Date(2000, input - 1).toLocaleString("default", { month: "short" });
}

export function getDaysInMonth(year: number | undefined, month: number | undefined): number {
    if (year == null || month == null) return 31;
    // month here is 1-based (Intl convention), so month gets the next month, day 0 = last day of current month
    return new Date(year, month, 0).getDate();
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

export function timeZoneParts(date: Date, timeZone: string = "UTC") {
    const tzFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hourCycle: 'h23'
    });

    return Object.fromEntries(
        tzFormatter.formatToParts(date)
            .filter(p => p.type !== 'literal')
            .map(p => [p.type, parseInt(p.value)])
    );
}

export function partsToUTC(
    parts: ReturnType<typeof timeZoneParts>,
    overrides: { year?: number; month?: number; day?: number; hour?: number; minute?: number; second?: number } = {}
) {
    return Date.UTC(
        overrides.year   ?? parts.year,
        (overrides.month ?? parts.month) - 1,
        overrides.day    ?? parts.day,
        overrides.hour   ?? parts.hour,
        overrides.minute ?? parts.minute,
        overrides.second ?? parts.second,
    );
}