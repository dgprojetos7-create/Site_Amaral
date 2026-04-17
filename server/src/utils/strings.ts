export const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const MOJIBAKE_PATTERN = /Ã|Â|�|ƒ|¢|©|§|£|º|ª/;

export const repairTextEncoding = (value: string) => {
  let repairedValue = value;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (!MOJIBAKE_PATTERN.test(repairedValue)) {
      break;
    }

    try {
      const bytes = Uint8Array.from(repairedValue, (character) => character.charCodeAt(0));
      const decodedValue = new TextDecoder('utf-8', { fatal: true }).decode(bytes);

      if (decodedValue === repairedValue) {
        break;
      }

      repairedValue = decodedValue;
    } catch {
      break;
    }
  }

  return repairedValue;
};

export const asBoolean = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }

  return false;
};
