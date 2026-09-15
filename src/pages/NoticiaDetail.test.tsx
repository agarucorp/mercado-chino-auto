import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { NEWS_DATA } from "@/data/news";
import NoticiaDetail from "@/pages/NoticiaDetail";
import { describe, expect, it } from "vitest";

function renderNota(id: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/noticias/${id}`]}>
        <Routes>
          <Route path="/noticias/:id" element={<NoticiaDetail />} />
          <Route path="/noticias" element={<p>listado</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("NoticiaDetail", () => {
  it("muestra el título de una nota del set estático", async () => {
    const article = NEWS_DATA[0];
    renderNota(article.id);
    expect(await screen.findByRole("heading", { name: article.title })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Radar de noticias/i })).toHaveAttribute(
      "href",
      "/noticias",
    );
  });
});
