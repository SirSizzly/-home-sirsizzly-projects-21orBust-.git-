export default function ShopPanel({ run, shop }) {
  if (!shop) return null;

  return (
    <div className="bg-slate-800/60 rounded-lg p-4 border border-slate-700">
      <div className="text-sm uppercase tracking-wide text-slate-400 mb-2">
        Shop
      </div>

      <div className="flex flex-col gap-3">
        {shop.offers.map((offer) => (
          <div
            key={offer.slot_index}
            className="flex justify-between items-center bg-slate-900/60 p-3 rounded-md"
          >
            <div>
              <div className="font-semibold capitalize">{offer.key}</div>
              <div className="text-xs text-slate-400">{offer.type}</div>
            </div>

            <div className="text-sm font-semibold">{offer.price}g</div>
          </div>
        ))}
      </div>
    </div>
  );
}
