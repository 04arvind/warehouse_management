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
    formState: { errors },
  } = useForm();

  const [items, setItems] = useState([]);
  const [itemsError, setItemsError] =
    useState("");

  const sourceWarehouse = watch(
    "sourceWarehouse"
  );

  const filteredProducts =
    products.filter((product) => {
      if (!sourceWarehouse) {
        return false;
      }

      if (!product.warehouseId) {
        return true;
      }

      return (
        String(product.warehouseId) ===
        String(sourceWarehouse)
      );
    });

  const addProduct = (productId) => {
    const product = products.find(
      (p) => p.id === productId
    );

    if (!product) return;
    setItemsError("");

    const alreadyExists = items.some(
      (item) => item.productId === product.id
    );

    if (alreadyExists) return;

    setItems((prev) => [
      ...prev,
      {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        available: product.available || 0,
        quantity: 1,
      },
    ]);
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
        "Please add at least one product."
      );
      return;
    }

    const hasInvalidQuantity =
      items.some(
        (item) =>
          Number(item.quantity) <= 0 ||
          Number(item.quantity) >
            Number(item.available)
      );

    if (hasInvalidQuantity) {
      setItemsError(
        "One or more item quantities are invalid."
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
              Source Warehouse
            </label>

            <select
              {...register("sourceWarehouse", {
                required: "Source warehouse is required",
              })}
              className="form-input"
            >
              <option value="">
                Select Origin
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
                  {warehouse.name}
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
                Select Destination
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
                  {warehouse.name}
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
            Add Product
          </label>

          <select
            disabled={!sourceWarehouse}
            className="form-input"
            value=""
            onChange={(e) =>
              addProduct(e.target.value)
            }
          >
            <option value="">
              Search / Select Product
            </option>

            {filteredProducts.map((product) => (
              <option
                key={product.id}
                value={product.id}
              >
                {product.name} — {product.sku}
              </option>
            ))}
          </select>

          {sourceWarehouse &&
            filteredProducts.length === 0 && (
              <p className="form-error">
                No inventory items are available in the selected source warehouse.
              </p>
            )}
        </div>

        <div className="mt-5">
          {items.length === 0 ? (
            <p className="border border-dashed border-[#d8d4cc] p-6 text-center text-[10px] text-[#77736b]">
              No products added to this transfer.
            </p>
          ) : (
            items.map((item) => (
              <TransferItem
                key={item.productId}
                item={item}
                onIncrease={increase}
                onDecrease={decrease}
                onRemove={remove}
              />
            ))
          )}
        </div>

        {itemsError && (
          <p className="form-error">
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