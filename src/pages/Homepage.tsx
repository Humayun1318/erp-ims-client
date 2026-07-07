import { Link } from "react-router";

// Representative rows only — swap for real dashboard data once wired up.
const PREVIEW_ROWS = [
  {
    sku: "SKU-10231",
    name: "Wireless Mouse M1",
    stock: 142,
    status: "In Stock",
  },
  { sku: "SKU-10874", name: "USB-C Hub 7-Port", stock: 4, status: "Low Stock" },
  {
    sku: "SKU-11029",
    name: "Mechanical Keyboard K2",
    stock: 0,
    status: "Out of Stock",
  },
];

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
  "In Stock": { dot: "bg-[#1D8348]", text: "text-[#1D8348]" },
  "Low Stock": { dot: "bg-[#F39C12]", text: "text-[#F39C12]" },
  "Out of Stock": { dot: "bg-[#E74C3C]", text: "text-[#E74C3C]" },
};

export default function Homepage() {
  return (
    <main className="min-h-screen w-full bg-[#F2F3F3] font-[Amazon_Ember,_Helvetica_Neue,_Arial,_sans-serif]">
      {/* ── Top utility strip — the "nav is the product" signal ── */}
      <div className="flex h-14 items-center justify-between bg-[#232F3E] px-6">
        <div className="flex items-center gap-2 text-[13px] text-white/90">
          <span className="font-bold tracking-tight text-white">ERP</span>
          <span className="text-white/40">/</span>
          <span className="font-mono text-[12px] text-white/60">
            inventory-sales-console
          </span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-white/70">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#1D8348]" />
          All systems operational
        </div>
      </div>

      {/* ── Hero — white canvas, dense, functional ── */}
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:items-center md:justify-between md:py-28">
        {/* Headline block */}
        <div className="flex max-w-md flex-col gap-5 text-center md:text-left">
          <span className="font-mono text-[12px] font-medium uppercase tracking-wider text-[#879596]">
            v1.0 · Inventory &amp; Sales Console
          </span>

          <h1 className="text-[32px] font-bold leading-[1.15] tracking-[-0.01em] text-[#16191F] md:text-[40px]">
            Inventory &amp; Sales,
            <br />
            Unified.
          </h1>

          <p className="text-[15px] leading-relaxed text-[#545B64]">
            One workspace for product stock, customer records, and sale history
            — every total calculated server-side, every role scoped to exactly
            what it needs.
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 md:items-start">
            <Link
              to="/login"
              className="inline-flex h-11 items-center justify-center rounded-[4px] bg-[#FF9900] px-7 text-[14px] font-bold text-[#16191F] shadow-[0_1px_4px_rgba(0,0,0,0.1)] transition-colors duration-100 hover:bg-[#EC7211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0073BB]"
            >
              Get Started — Sign In
            </Link>
            <span className="text-[13px] text-[#879596]">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-[#0073BB] underline-offset-2 hover:text-[#005276] hover:underline"
              >
                Register free
              </Link>
            </span>
          </div>
        </div>

        {/* ── Signature: a real resource-table preview, not a stock illustration ── */}
        <div
          aria-hidden
          className="w-full max-w-sm overflow-hidden rounded-[4px] border border-[#D5DBDB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
        >
          <div className="flex items-center justify-between border-b border-[#EAEDED] px-4 py-3">
            <span className="text-[13px] font-bold text-[#16191F]">
              Products
            </span>
            <span className="text-[12px] text-[#879596]">3 of 128</span>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wide text-[#545B64]">
                <th scope="col" className="px-4 py-2">
                  SKU
                </th>
                <th scope="col" className="px-4 py-2">
                  Product
                </th>
                <th scope="col" className="px-4 py-2 text-right">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {PREVIEW_ROWS.map((row) => {
                const style = STATUS_STYLES[row.status];
                return (
                  <tr key={row.sku} className="border-t border-[#EAEDED]">
                    <td className="px-4 py-3 font-mono text-[12px] text-[#545B64]">
                      {row.sku}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[13px] text-[#16191F]">
                        {row.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                        <span
                          aria-hidden
                          className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                        />
                        <span className={style.text}>{row.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[13px] text-[#16191F]">
                      {row.stock}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="border-t border-[#EAEDED] bg-[#F2F3F3] px-4 py-2 text-[11px] text-[#879596]">
            Live counts update after every sale — stock never trusted from the
            client.
          </div>
        </div>
      </div>
    </main>
  );
}
