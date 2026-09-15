import { describe, expect, it } from "vitest";
import { extractFromHtml, extractFromJina, isHttpUrl } from "./news-extract";

describe("isHttpUrl", () => {
  it("acepta http y https", () => {
    expect(isHttpUrl("https://ejemplo.com/nota")).toBe(true);
    expect(isHttpUrl("http://ejemplo.com/nota")).toBe(true);
  });

  it("rechaza javascript y texto suelto", () => {
    expect(isHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isHttpUrl("nota sin url")).toBe(false);
    expect(isHttpUrl("ftp://x.com")).toBe(false);
  });
});

describe("extractFromHtml", () => {
  it("lee og:title, og:image y el artículo", () => {
    const html = `<html><head>
      <title>Titulo corto</title>
      <meta property="og:title" content="BYD lanza un modelo en Argentina" />
      <meta property="og:description" content="La marca presenta su SUV en el mercado local." />
      <meta property="og:image" content="https://cdn.ejemplo.com/foto.jpg" />
      <meta property="og:site_name" content="MotorArg" />
    </head><body>
      <article><p>Primer párrafo de la nota con bastante texto para copiar el cuerpo.</p></article>
    </body></html>`;

    const extracted = extractFromHtml(html, "https://motorarg.com/nota");
    expect(extracted.title).toBe("BYD lanza un modelo en Argentina");
    expect(extracted.excerpt).toContain("SUV");
    expect(extracted.imageUrl).toBe("https://cdn.ejemplo.com/foto.jpg");
    expect(extracted.sourceName).toBe("MotorArg");
    expect(extracted.body).toContain("Primer párrafo");
    expect(extracted.sourceUrl).toBe("https://motorarg.com/nota");
  });
});

describe("extractFromJina", () => {
  it("parsea Title y Markdown Content del proxy", () => {
    const extracted = extractFromJina(
      `Title: Chery anuncia precios

URL Source: https://fuente.com/chery

Markdown Content:
Chery publicó la lista de precios para Argentina con tres versiones.`,
      "https://fuente.com/chery",
    );
    expect(extracted.title).toBe("Chery anuncia precios");
    expect(extracted.sourceUrl).toBe("https://fuente.com/chery");
    expect(extracted.sourceName).toBe("fuente.com");
    expect(extracted.body).toContain("lista de precios");
  });
});
