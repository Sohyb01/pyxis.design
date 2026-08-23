import localFont from "next/font/local";

export const brandUiFont = localFont({
  src: [
    {
      path: "../../public/brand/_shared/Inter-Variable.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  display: "swap",
});
