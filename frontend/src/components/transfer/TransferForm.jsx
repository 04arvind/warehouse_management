import { useState } from "react";
import { useForm } from "react-hook-form";
import TransferItem from "./TransferItem";
import Button from "../common/Button";

export default function TransferForm({
  warehouses = [],
  products = [],
  onSubmit,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] = useState("");
  const [selectedProductToAdd, setSelectedProductToAdd] = useState("");

  const sourceWarehouse = watch("sourceWarehouse");

  // Robust product filtering
  const filteredProducts = products.filter((product) => {
    if (!sourceWarehouse) return true;

    const targetWh = warehouses.find(
      (w) => String(w._id || w.id) === String(sourceWarehouse)
    );
    const targetWhId = String(targetWh?._id || targetWh?.id || sourceWarehouse);
    const targetWhName = (targetWh?.name || "").toLowerCase();
    const targetWhCode = (targetWh?.code || "").toLowerCase();

    const pWhId = String(
      product.warehouseId ||
      product.warehouse?._id ||
      product.warehouse?.id ||
      product.warehouse ||
      ""
    );
    const pWhName = String(
      product.warehouse?.name || product.warehouse || ""
    ).toLowerCase();

    const isMatch =
      pWhId === targetWhId ||
      pWhName === targetWhName ||
      pWhName === targetWhCode;

    return isMatch;
  });

  // If filtered is empty for selected warehouse, fallback to all available products
  const displayProducts =
    filteredProducts.length > 0 ? filteredProducts : products;

  const addProduct = (productId) => {
    if (!productId) return;

    const product = products.find(
      (p) => String(p.id || p._id) === String(productId)
    );

    if (!product) return;
    setItemsError("");

    // If source warehouse was not selected yet, auto-select product's warehouse
    if (!sourceWarehouse && (product.warehouseId || product.warehouse)) {
      const matchWh = warehouses.find(
        (w) =>
          String(w._id || w.id) === String(product.warehouseId) ||
          w.name.toLowerCase() === String(product.warehouse).toLowerCase()
      );
      if (matchWh) {
        setValue("sourceWarehouse", matchWh._id || matchWh.id);
      }
    }

    const prodId = product.id || product._id;
    const alreadyExists = items.some(
      (item) => String(item.productId) === String(prodId)
    );

    if (alreadyExists) {
      setItemsError(`"${product.name}" is already in the manifest.`);
      return;
    }

    const availableStock = Math.max(1, Number(product.available ?? product.quantity ?? 100));

    setItems((prev) => [
      ...prev,
      {
        productId: prodId,
        productName: product.name || product.product || product.productName,
        sku: product.sku || `SKU-${prodId}`,
        available: availableStock,
        quantity: 1,
      },
    ]);

    setSelectedProductToAdd("");
  };

  const increase = (item) => {
    setItems((prev) =>
      prev.map((current) =>
        current.productId === item.productId &&
        current.quantity < current.available
          ? {
              ...current,
              quantity: current.quantity + 1,
            }
          : current
      )
    );
  };

  const decrease = (item) => {
    setItems((prev) =>
      prev.map((current) =>
        current.productId === item.productId &&
        current.quantity > 1
          ? {
              ...current,
              quantity: current.quantity - 1,
            }
          : current
      )
    );
  };

  const setQuantity = (item, newQty) => {
    setItems((prev) =>
      prev.map((current) =>
        current.productId === item.productId
          ? {
              ...current,
              quantity: newQty,
            }
          : current
      )
    );
  };

  const remove = (item) => {
    setItems((prev) =>
      prev.filter(
        (current) =>
          current.productId !== item.productId
      )
    );
  };

  const submit = (data) => {
    setItemsError("");

    if (items.length === 0) {
      setItemsError(
        "Please add at least one product to the manifest."
      );
      return;
    }

    onSubmit?.({
      ...data,
      items,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="space-y-6"
    >

      {/* Routing */}
      <section className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">

        <div className="mb-5">
          <p className="text-[9px] font-bold">
            01
          </p>

          <h2 className="mt-1 text-sm font-semibold">
            Routing Details
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <label className="form-label">
              Source Warehouse (Origin)
            </label>

            <select
              {...register("sourceWarehouse", {
                required: "Source warehouse is required",
              })}
              className="form-input"
            >
              <option value="">
                Select Origin Warehouse
              </option>

              {warehouses.map((warehouse) => (
                <option
                  key={
                    warehouse._id ||
                    warehouse.id
                  }
                  value={
                    warehouse._id ||
                    warehouse.id
                  }
                >
                  {warehouse.name} ({warehouse.code || "WH"})
                </option>
              ))}
            </select>

            {errors.sourceWarehouse && (
              <p className="form-error">
                {errors.sourceWarehouse.message}
              </p>
            )}
          </div>

          <div>
            <label className="form-label">
              Destination Warehouse
            </label>

            <select
              {...register(
                "destinationWarehouse",
                {
                  required:
                    "Destination warehouse is required",
                  validate: (value) =>
                    value !== sourceWarehouse ||
                    "Source and destination must be different",
                }
              )}
              className="form-input"
            >
              <option value="">
                Select Destination Warehouse
              </option>

              {warehouses.map((warehouse) => (
                <option
                  key={
                    warehouse._id ||
                    warehouse.id
                  }
                  value={
                    warehouse._id ||
                    warehouse.id
                  }
                >
                  {warehouse.name} ({warehouse.code || "WH"})
                </option>
              ))}
            </select>

            {errors.destinationWarehouse && (
              <p className="form-error">
                {errors.destinationWarehouse.message}
              </p>
            )}
          </div>

        </div>
      </section>

      {/* Manifest */}
      <section className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">

        <div className="mb-5">
          <p className="text-[9px] font-bold">
            02
          </p>

          <h2 className="mt-1 text-sm font-semibold">
            Manifest
          </h2>
        </div>

        <div>
          <label className="form-label">
            Add Product to Manifest
          </label>

          <div className="flex gap-2">
            <select
              className="form-input flex-1"
              value={selectedProductToAdd}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedProductToAdd(val);
                if (val) {
                  addProduct(val);
                }
              }}
            >
              <option value="">
                Select a product to add...
              </option>

              {displayProducts.map((product) => (
                <option
                  key={product.id || product._id}
                  value={product.id || product._id}
                >
                  {product.name} — {product.sku} ({product.available || 0} in stock)
                </option>
              ))}
            </select>

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (selectedProductToAdd) {
                  addProduct(selectedProductToAdd);
                } else if (displayProducts.length > 0) {
                  addProduct(displayProducts[0].id || displayProducts[0]._id);
                }
              }}
            >
              Add Product
            </Button>
          </div>

          {!sourceWarehouse && (
            <p className="mt-1 text-[10px] text-[#77736b]">
              Tip: Select origin warehouse to filter stock or pick any available item above.
            </p>
          )}
        </div>

        <div className="mt-5">
          {items.length === 0 ? (
            <p className="border border-dashed border-[#d8d4cc] p-6 text-center text-[10px] text-[#77736b]">
              No products added to this transfer yet. Select a product above to add to the manifest.
            </p>
          ) : (
            items.map((item) => (
              <TransferItem
                key={item.productId}
                item={item}
                onIncrease={increase}
                onDecrease={decrease}
                onQuantityChange={setQuantity}
                onRemove={remove}
              />
            ))
          )}
        </div>

        {itemsError && (
          <p className="mt-3 text-[11px] text-[#9e2a2b] font-semibold">
            {itemsError}
          </p>
        )}

      </section>

      {/* Logistics */}
      <section className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">

        <div className="mb-5">
          <p className="text-[9px] font-bold">
            03
          </p>

          <h2 className="mt-1 text-sm font-semibold">
            Logistics Parameters
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <label className="form-label">
              Transfer Priority
            </label>

            <select
              {...register("priority")}
              className="form-input"
              defaultValue="STANDARD"
            >
              <option value="STANDARD">
                Standard
              </option>

              <option value="EXPEDITED">
                Expedited
              </option>

              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </div>

          <div>
            <label className="form-label">
              Required By
            </label>

            <input
              type="date"
              {...register("requiredBy")}
              className="form-input"
            />
          </div>

        </div>

        <div className="mt-4">
          <label className="form-label">
            Additional Notes
          </label>

          <textarea
            {...register("notes")}
            rows={4}
            className="form-input resize-none"
            placeholder="Special handling instructions or additional notes..."
          />
        </div>

      </section>

      <div className="flex justify-end">
        <Button
          type="submit"
          size="lg"
          loading={loading}
        >
          Create Transfer Request
        </Button>
      </div>

    </form>
  );
}