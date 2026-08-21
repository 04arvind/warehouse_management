const steps = [
  "CREATED",
  "APPROVED",
  "IN TRANSIT",
  "COMPLETED",
];

const statusIndex = {
  PENDING: 0,
  APPROVED: 1,
  IN_TRANSIT: 2,
  COMPLETED: 3,
  REJECTED: -1,
  CANCELLED: -1,
};

export default function TransferTimeline({
  status = "PENDING",
}) {
  const currentIndex =
    statusIndex[status] ?? 0;

  return (
    <div className="border border-[#ddd9d1] bg-[#fbfaf7] p-5">

      <h3 className="text-sm font-semibold">
        Transfer Timeline
      </h3>

      <div className="mt-6">

        {steps.map((step, index) => {
          const completed =
            index <= currentIndex;

          const isCurrent =
            index === currentIndex;

          return (
            <div
              key={step}
              className="flex gap-4"
            >

              <div className="flex flex-col items-center">

                <div
                  className={`
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    border
                    text-[9px]
                    font-bold
                    ${
                      completed
                        ? "border-black bg-black text-white"
                        : "border-[#d8d4cc] bg-[#f1efe9] text-[#77736b]"
                    }
                  `}
                >
                  {index + 1}
                </div>

                {index !== steps.length - 1 && (
                  <div
                    className={`
                      my-1
                      h-10
                      w-px
                      ${
                        index < currentIndex
                          ? "bg-black"
                          : "bg-[#d8d4cc]"
                      }
                    `}
                  />
                )}

              </div>

              <div className="pb-8">

                <p
                  className={`
                    text-[10px]
                    font-semibold
                    ${
                      isCurrent
                        ? "text-black"
                        : "text-[#77736b]"
                    }
                  `}
                >
                  {step}
                </p>

                {isCurrent && (
                  <p className="mt-1 text-[9px] text-[#77736b]">
                    Current transfer status
                  </p>
                )}

              </div>

            </div>
          );
        })}

        {(status === "REJECTED" ||
          status === "CANCELLED") && (
          <div className="mt-2 border border-[#d8d4cc] bg-[#f1efe9] p-3">
            <p className="text-[10px] font-semibold">
              Transfer {status.toLowerCase()}
            </p>

            <p className="mt-1 text-[9px] text-[#77736b]">
              This transfer request has no further status actions.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}