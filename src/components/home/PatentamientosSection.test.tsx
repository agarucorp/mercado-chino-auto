import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PatentamientosSection } from "./PatentamientosSection";

function renderSection() {
  return render(
    <MemoryRouter>
      <PatentamientosSection />
    </MemoryRouter>,
  );
}

describe("PatentamientosSection", () => {
  it("muestra el ranking 2026 y cambia al filtrar por año", () => {
    renderSection();

    expect(
      screen.getByRole("heading", { name: "Patentamientos 0 km" }),
    ).toBeInTheDocument();
    expect(screen.getByText("BJ30")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /BJ30/i })).toHaveAttribute(
      "href",
      "/marcas/baic/bj30",
    );

    fireEvent.click(screen.getByRole("button", { name: "2024" }));
    expect(screen.getByText("Tiggo 4 Hybrid")).toBeInTheDocument();
    expect(screen.queryByText("Dolphin Mini")).not.toBeInTheDocument();
  });

  it("expande el ranking completo", () => {
    renderSection();
    const expand = screen.getByRole("button", { name: /Ver ranking completo/i });
    fireEvent.click(expand);
    const list = screen.getByRole("list");
    expect(within(list).getAllByRole("link").length).toBeGreaterThan(12);
  });
});
