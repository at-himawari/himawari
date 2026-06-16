type FrontMatterData = Record<string, unknown>;

type FrontMatterResult = {
  data: FrontMatterData;
  content: string;
};

function parseScalar(value: string): unknown {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    trimmed.startsWith("[")
  ) {
    try {
      return JSON.parse(trimmed.replace(/^'|'$/g, '"'));
    } catch {
      return trimmed.slice(1, -1);
    }
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  return trimmed;
}

function parseData(frontMatter: string): FrontMatterData {
  return frontMatter.split(/\r?\n/).reduce<FrontMatterData>((data, line) => {
    const match = line.match(/^([^:#][^:]*):\s*(.*)$/);

    if (!match) {
      return data;
    }

    const [, key, value] = match;
    data[key.trim()] = parseScalar(value);
    return data;
  }, {});
}

function stringifyValue(value: unknown): string {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  return String(value ?? "");
}

function parseFrontMatter(source: string): FrontMatterResult {
  if (!source.startsWith("---")) {
    return { data: {}, content: source };
  }

  const normalized = source.replace(/\r\n/g, "\n");
  const end = normalized.indexOf("\n---", 3);

  if (end === -1) {
    return { data: {}, content: source };
  }

  const frontMatter = normalized.slice(3, end).trim();
  const contentStart = normalized.indexOf("\n", end + 4);
  const content = contentStart === -1 ? "" : normalized.slice(contentStart + 1);

  return {
    data: parseData(frontMatter),
    content,
  };
}

function stringify(content: string, data: FrontMatterData): string {
  const frontMatter = Object.entries(data)
    .map(([key, value]) => `${key}: ${stringifyValue(value)}`)
    .join("\n");

  return `---\n${frontMatter}\n---\n\n${content}`;
}

const matter = Object.assign(parseFrontMatter, { stringify });

export default matter;
