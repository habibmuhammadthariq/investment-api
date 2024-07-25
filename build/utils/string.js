export function padWithZero(value, padCount) {
    const stringValue = String(value); // Convert to string if not already
    const paddingLength = Math.max(padCount - stringValue.length, 0);
    return "0".repeat(paddingLength) + stringValue;
}
