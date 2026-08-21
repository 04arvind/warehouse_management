import { useForm } from "react-hook-form";
import Button from "../common/Button";

export default function WarehouseForm({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      name: "",
      code: "",
      location: "",
      address: "",
      capacity: "",
      status: "ACTIVE",
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >

      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <label className="form-label">
            Warehouse Name
          </label>

          <input
            {...register("name", {
              required: "Warehouse name is required",
            })}
            className="form-input"
            placeholder="Delhi Central Warehouse"
          />

          {errors.name && (
            <p className="form-error">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label">
            Warehouse Code
          </label>

          <input
            {...register("code", {
              required: "Warehouse code is required",
            })}
            className="form-input uppercase"
            placeholder="DEL-001"
          />

          {errors.code && (
            <p className="form-error">
              {errors.code.message}
            </p>
          )}
        </div>

      </div>

      <div className="grid gap-4 sm:grid-cols-2">

        <div>
          <label className="form-label">
            Location
          </label>

          <input
            {...register("location", {
              required: "Location is required",
            })}
            className="form-input"
            placeholder="New Delhi"
          />

          {errors.location && (
            <p className="form-error">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label">
            Maximum Capacity
          </label>

          <input
            type="number"
            {...register("capacity", {
              required: "Capacity is required",
              min: {
                value: 1,
                message: "Capacity must be greater than 0",
              },
            })}
            className="form-input"
            placeholder="50000"
          />

          {errors.capacity && (
            <p className="form-error">
              {errors.capacity.message}
            </p>
          )}
        </div>

      </div>

      <div>
        <label className="form-label">
          Address
        </label>

        <textarea
          {...register("address")}
          rows={3}
          className="form-input resize-none"
          placeholder="Full warehouse address..."
        />
      </div>

      <div>
        <label className="form-label">
          Status
        </label>

        <select
          {...register("status")}
          className="form-input"
        >
          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>
      </div>

      <div className="flex justify-end gap-2 border-t border-[#ddd9d1] pt-5">

        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={loading}
        >
          {initialData
            ? "Update Warehouse"
            : "Create Warehouse"}
        </Button>

      </div>

    </form>
  );
}