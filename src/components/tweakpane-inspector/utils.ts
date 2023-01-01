export function transformEnumToOptions(enumData: any) {
  const options = {};
  for (const k in enumData) {
    // @ts-ignore
    if (isNaN(k)) {
      options[k] = enumData[k];
    }
  }
  return options;
}
