import { useState } from "react";
import {
  Search,
  Filter,
  Activity,
} from "lucide-react";

const auditLogs = [
  {
    id: "LOG-001",
    action: "USER_ROLE_UPDATED",
    actor: "Arvind Rawat",
    actorEmail: "arvind@example.com",
    resource: "User: Rahul Sharma",
    timestamp: "21 Aug 2026, 09:12",
    ip: "192.168.1.10",
  },
  {
    id: "LOG-002",
    action: "TRANSFER_APPROVED",
    actor: "Rahul Sharma",
    actorEmail: "rahul@example.com",
    resource: "TR-1024",
    timestamp: "21 Aug 2026, 08:56",
    ip: "192.168.1.15",
  },
  {
    id: "LOG-003",
    action: "WAREHOUSE_CREATED",
    actor: "Arvind Rawat",
    actorEmail: "arvind@example.com",
    resource: "Warehouse: Delhi Central",
    timestamp: "20 Aug 2026, 18:30",
    ip: "192.168.1.10",
  },
  {
    id: "LOG-004",
    action: "TRANSFER_COMPLETED",
    actor: "Rahul Sharma",
    actorEmail: "rahul@example.com",
    resource: "TR-1021",
    timestamp: "20 Aug 2026, 16:22",
    ip: "192.168.1.15",
  },
];

export default function AuditLogs() {
  const [search, setSearch] =
    useState("");

  const filteredLogs =
    auditLogs.filter((log) => {
      const query =
        search.toLowerCase();

      return (
        log.action
          .toLowerCase()
          .includes(query) ||
        log.actor
          .toLowerCase()
          .includes(query) ||
        log.resource
          .toLowerCase()
          .includes(query)
      );
    });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77736b]">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          Audit Logs
        </h1>

        <p className="mt-1 text-[11px] text-[#77736b]">
          Track important actions performed across
          the system.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 border border-[#ddd9d1] bg-[#fbfaf7] p-4 md:flex-row">

        <div className="relative flex-1">

          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#77736b]"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="form-input pl-9"
            placeholder="Search action, user or resource..."
          />

        </div>

        <select className="form-input md:w-48">
          <option value="">
            All Actions
          </option>

          <option value="USER">
            User Actions
          </option>

          <option value="TRANSFER">
            Transfer Actions
          </option>

          <option value="WAREHOUSE">
            Warehouse Actions
          </option>
        </select>

        <button className="flex items-center justify-center gap-2 border border-[#d8d4cc] px-4 text-[10px] font-semibold hover:bg-[#ebe8e1]">
          <Filter size={13} />
          Filter
        </button>

      </div>

      {/* Log table */}
      <div className="overflow-x-auto border border-[#ddd9d1] bg-[#fbfaf7]">

        <table className="w-full min-w-[1000px] border-collapse">

          <thead>
            <tr className="border-b border-[#ddd9d1] bg-[#f1efe9]">

              <th className="table-head">
                EVENT
              </th>

              <th className="table-head">
                ACTOR
              </th>

              <th className="table-head">
                RESOURCE
              </th>

              <th className="table-head">
                TIMESTAMP
              </th>

              <th className="table-head">
                IP ADDRESS
              </th>

            </tr>
          </thead>

          <tbody>

            {filteredLogs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#ebe8e1] last:border-0 hover:bg-[#f6f4ef]"
              >

                <td className="table-cell">

                  <div className="flex items-center gap-3">

                    <div className="flex h-7 w-7 items-center justify-center border border-[#d8d4cc] bg-[#f1efe9]">
                      <Activity size={12} />
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold">
                        {formatAction(
                          log.action
                        )}
                      </p>

                      <p className="mt-1 text-[8px] text-[#99958d]">
                        {log.id}
                      </p>
                    </div>

                  </div>

                </td>

                <td className="table-cell">

                  <p className="text-[10px] font-semibold">
                    {log.actor}
                  </p>

                  <p className="mt-1 text-[8px] text-[#77736b]">
                    {log.actorEmail}
                  </p>

                </td>

                <td className="table-cell">
                  {log.resource}
                </td>

                <td className="table-cell">
                  {log.timestamp}
                </td>

                <td className="table-cell font-mono text-[9px]">
                  {log.ip}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

function formatAction(action) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}