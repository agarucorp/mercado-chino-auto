import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LISTINGS_DATA } from "@/data/listings";
import ClasificadoDetail from "@/pages/ClasificadoDetail";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: false,
  supabase: null,
}));

function renderAviso(id: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[`/clasificados/${id}`]}>
        <Routes>
          <Route path="/clasificados/:id" element={<ClasificadoDetail />} />
          <Route path="/clasificados" element={<p>listado</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ClasificadoDetail", () => {
  it("muestra el aviso del set estático cuando el id coincide", async () => {
    const listing = LISTINGS_DATA[0];
    renderAviso(listing.id);
    expect((await screen.findAllByText(/2024 BYD Song Pro/)).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: /Volver a clasificados/i })).toHaveAttribute(
      "href",
      "/clasificados",
    );
  });
});
