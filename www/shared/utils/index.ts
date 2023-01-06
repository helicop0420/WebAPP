export function classNames(
  ...classes: (string | boolean | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function getFullName({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName?: string | null;
}): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

export function getUrlQueryString() {
  const existingQueryString = new URLSearchParams(
    window.location.search
  ).toString();

  if (existingQueryString) {
    return `?${existingQueryString}`;
  }

  return "";
}
