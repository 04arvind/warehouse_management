import {
  useNavigate,
} from "react-router-dom";

import Button from "../components/common/Button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">

      <div className="text-center">

        <p className="text-6xl font-bold">
          404
        </p>

        <h1 className="mt-3 text-lg font-semibold">
          Page not found
        </h1>

        <p className="mt-2 text-[11px] text-[#77736b]">
          The page you're looking for doesn't exist.
        </p>

        <div className="mt-5">
          <Button
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Back to Dashboard
          </Button>
        </div>

      </div>

    </div>
  );
}